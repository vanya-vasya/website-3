/**
 * MIA QR payment integration.
 *
 * User-facing label for this payment method is always "MIA" (QR MIA via
 * Moldovan banks). The underlying payment processor is Bpay
 * (https://blog.bpay.md/ro/dev-ro-qrmia/) and is referred to as "bpay" only
 * in internal code/identifiers — it must never leak into UI copy, emails or
 * receipts shown to end users.
 */

import crypto from "crypto";
import prismadb from "@/lib/prismadb";
import { transporter } from "@/config/nodemailer";
import { generatePdfReceipt } from "@/lib/receiptGeneration";

const PRODUCTION_BASE_URL = "https://qr-merchant.bpay.md";
const TEST_BASE_URL = "https://qr-test.bpay.md";

export interface BpayQrConfig {
  baseUrl: string;
  merchantId: string;
  secretKey: string;
  pointId: string;
}

export function getBpayQrConfig(): BpayQrConfig {
  const merchantId = process.env.MIA_MERCHANT_ID;
  const secretKey = process.env.MIA_SECRET_KEY;

  if (!merchantId || !secretKey) {
    throw new Error(
      "MIA payment is not configured: MIA_MERCHANT_ID / MIA_SECRET_KEY env vars are missing"
    );
  }

  const testMode = process.env.MIA_TEST_MODE === "true";
  const baseUrl =
    process.env.MIA_API_BASE_URL || (testMode ? TEST_BASE_URL : PRODUCTION_BASE_URL);

  return {
    baseUrl: baseUrl.replace(/\/+$/, ""),
    merchantId,
    secretKey,
    pointId: process.env.MIA_POINT_ID || "1",
  };
}

/** HMAC SHA-256 over `message`, base64-encoded, lower-cased (per Bpay docs). */
function signBpayMessage(secretKey: string, message: string): string {
  return crypto
    .createHmac("sha256", secretKey)
    .update(message, "utf8")
    .digest("base64")
    .toLowerCase();
}

/** yyyy-MM-ddTHH:mm:ss in UTC, as required by the Bpay API. */
function formatBpayDateTime(date: Date = new Date()): string {
  return date.toISOString().slice(0, 19);
}

function newTraceReference(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

function stripDashes(uuid: string): string {
  return uuid.replace(/-/g, "");
}

export interface CreateMiaQrParams {
  orderId: string;
  amount: number; // MDL, major units, e.g. 10.00
  description: string;
  redirectUrl?: string;
  callbackUrl?: string;
  ttlSeconds?: number;
}

export interface CreateMiaQrResult {
  qrHeaderUUID: string;
  qrExtensionUUID: string;
  qrAsText: string;
}

/** Creates a single-use dynamic MIA QR code for the given amount/order. */
export async function createMiaDynamicQr(
  params: CreateMiaQrParams
): Promise<CreateMiaQrResult> {
  const config = getBpayQrConfig();
  const dateTime = formatBpayDateTime();
  // Description is capped at a conservative 35 chars per API constraints.
  const description = params.description.slice(0, 35);
  const amount = Math.round(params.amount * 100) / 100;

  const signature = signBpayMessage(
    config.secretKey,
    `${dateTime}${config.merchantId}${amount}${description}`
  );

  const body: Record<string, unknown> = {
    dateTime,
    merchantId: config.merchantId,
    orderId: params.orderId,
    amount,
    description,
    pointId: config.pointId,
  };
  if (params.ttlSeconds) body.ttl = params.ttlSeconds;
  if (params.redirectUrl) body.redirectUrl = params.redirectUrl;
  if (params.callbackUrl) body.callback_url = params.callbackUrl;

  const response = await fetch(
    `${config.baseUrl}/api/Qr/CreateMerchantQrAdvanced`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-TraceReference": newTraceReference(),
        "X-HMAC-Signature": signature,
      },
      body: JSON.stringify(body),
    }
  );

  const text = await response.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // Non-JSON error response, fall through with raw text below.
  }

  if (!response.ok || !data?.qrExtensionUUID || !data?.qrAsText) {
    throw new Error(
      `MIA QR creation failed (${response.status}): ${
        data ? JSON.stringify(data) : text
      }`
    );
  }

  return {
    qrHeaderUUID: data.qrHeaderUUID,
    qrExtensionUUID: data.qrExtensionUUID,
    qrAsText: data.qrAsText,
  };
}

export interface MiaQrStatus {
  isPaid: boolean;
  receipt?: string;
  state?: number;
  amount?: number;
  paidAt?: string;
}

/** Verifies the payment status of a MIA QR extension (authoritative check). */
export async function getMiaQrStatus(
  qrExtensionUUID: string
): Promise<MiaQrStatus> {
  const config = getBpayQrConfig();
  const dateTime = formatBpayDateTime();
  const uuid = stripDashes(qrExtensionUUID);

  const signature = signBpayMessage(
    config.secretKey,
    `${uuid}${dateTime}${config.merchantId}`
  );

  const url = new URL(`${config.baseUrl}/api/Qr/GetQrStatus`);
  url.searchParams.set("uuid", uuid);
  url.searchParams.set("dateTime", dateTime);
  url.searchParams.set("merchantId", config.merchantId);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "X-TraceReference": newTraceReference(),
      "X-HMAC-Signature": signature,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data) {
    throw new Error(
      `MIA QR status check failed (${response.status}): ${JSON.stringify(data)}`
    );
  }

  const isPaid = Boolean(data.isPaid) && data.paymentDetails?.state === 100;

  return {
    isPaid,
    receipt: data.paymentDetails?.receipt,
    state: data.paymentDetails?.state,
    amount: data.paymentDetails?.provAmount,
    paidAt: data.paymentDetails?.createTime,
  };
}

export interface SettleMiaPaymentResult {
  isPaid: boolean;
  alreadyProcessed: boolean;
  tokensCredited?: number;
}

/**
 * Verifies a MIA QR payment against Bpay and, if genuinely paid, credits the
 * matching pending transaction exactly once. Safe to call repeatedly from
 * both client polling and the MIA webhook (idempotent).
 */
export async function settleMiaPayment(
  qrExtensionUUID: string
): Promise<SettleMiaPaymentResult> {
  const transaction = await prismadb.transaction.findFirst({
    where: { tracking_id: qrExtensionUUID },
  });

  if (!transaction) {
    throw new Error(`Unknown MIA transaction: ${qrExtensionUUID}`);
  }

  if (transaction.status === "successful") {
    return { isPaid: true, alreadyProcessed: true };
  }

  const status = await getMiaQrStatus(qrExtensionUUID);
  if (!status.isPaid) {
    return { isPaid: false, alreadyProcessed: false };
  }

  const match = (transaction.description || "").match(/(\d+)\s*Tokens/i);
  const tokens = match ? parseInt(match[1], 10) : 0;

  if (tokens <= 0) {
    throw new Error(
      `Cannot determine token count for MIA transaction ${qrExtensionUUID}`
    );
  }

  const user = await prismadb.user.findUnique({
    where: { clerkId: transaction.userId },
    select: { usedGenerations: true, availableGenerations: true, email: true },
  });

  if (!user) {
    throw new Error(`User not found for MIA transaction ${qrExtensionUUID}`);
  }

  await prismadb.$transaction(async (tx) => {
    await tx.user.update({
      where: { clerkId: transaction.userId },
      data: {
        availableGenerations:
          user.availableGenerations - user.usedGenerations + tokens,
        usedGenerations: 0,
      },
    });

    await tx.transaction.update({
      where: { id: transaction.id },
      data: {
        status: "successful",
        message: status.receipt
          ? `MIA payment confirmed, receipt #${status.receipt}`
          : "MIA payment confirmed",
        paid_at: status.paidAt ? new Date(status.paidAt) : new Date(),
      },
    });
  });

  try {
    const receiptId = transaction.id.slice(-8);
    const pdfBuffer = await generatePdfReceipt(
      receiptId,
      user.email,
      new Date().toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      }),
      tokens,
      transaction.description || `${tokens} Tokens`,
      transaction.amount || 0,
      transaction.currency || "MDL"
    );

    await transporter.sendMail({
      from: process.env.OUTBOX_EMAIL,
      to: user.email,
      subject: `Receipt #${receiptId} - Yum-Mi Tokens Purchase`,
      text: `Hi there,

We're excited to welcome you to Yum-Mi — thanks so much for your recent order on yum-mi.com!

You'll find your transaction receipt attached to this message. Be sure to keep it in case you need it later.

If you run into any issues, have questions about your token usage, or need guidance, our support team is just an email away at support@yum-mi.com. We're always ready to help.

We're honored to be part of your creative journey.

With appreciation,
The Yum-Mi Team
yum-mi.com
support@yum-mi.com`,
      attachments: [
        {
          filename: `receipt-${receiptId}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });
  } catch (emailError) {
    console.error("[MIA] Failed to send receipt email:", emailError);
    // Don't fail the settlement if the email fails to send.
  }

  return { isPaid: true, alreadyProcessed: false, tokensCredited: tokens };
}
