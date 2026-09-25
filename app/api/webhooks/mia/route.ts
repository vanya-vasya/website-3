import { NextRequest, NextResponse } from "next/server";

import { settleMiaPayment } from "@/lib/mia-bpay";

/**
 * Callback endpoint for the MIA QR payment provider. The exact callback
 * payload shape is confirmed with the provider when server-to-server
 * callbacks are enabled for the merchant account (see
 * https://blog.bpay.md/ro/dev-ro-qrmia/). We defensively look for the QR
 * extension identifier under a few likely keys and re-verify the payment
 * status ourselves before crediting any tokens — we never trust the
 * callback body alone.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    console.log("[MIA] Webhook received:", JSON.stringify(body));

    const qrExtensionUUID: string | undefined =
      body.qrExtensionUUID ||
      body.extensionUUID ||
      body.uuid ||
      body.qrExtensionUuid;

    if (!qrExtensionUUID) {
      console.warn("[MIA] Webhook missing QR extension identifier");
      return NextResponse.json({ status: "ok" }, { status: 200 });
    }

    const result = await settleMiaPayment(qrExtensionUUID);
    console.log("[MIA] Webhook settlement result:", result);

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("[MIA] Webhook processing error:", error);
    // Always acknowledge so the provider doesn't endlessly retry; the
    // client-side polling loop will settle the payment as a fallback.
    return NextResponse.json({ status: "ok" }, { status: 200 });
  }
}

// GET - Health check for the MIA webhook endpoint.
export async function GET() {
  return NextResponse.json({
    message: "MIA webhook endpoint is active",
    timestamp: new Date().toISOString(),
  });
}
