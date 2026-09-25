import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";
import { createMiaDynamicQr } from "@/lib/mia-bpay";
import { GENERATIONS_PRICE } from "@/constants";
import { currenciesRate, currencies, Currency } from "@/constants/index";

const APP_URL = "https://www.yum-mi.com";

// POST - Create a MIA QR code for a token purchase.
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const tokens = Math.round(Number(body.tokens));
    const displayAmount = Number(body.amount);
    const displayCurrency = body.currency as Currency;

    if (!Number.isFinite(tokens) || tokens <= 0) {
      return NextResponse.json(
        { error: "A positive token amount is required" },
        { status: 400 }
      );
    }
    if (!Number.isFinite(displayAmount) || displayAmount <= 0) {
      return NextResponse.json(
        { error: "A positive amount is required" },
        { status: 400 }
      );
    }
    if (!currencies.includes(displayCurrency)) {
      return NextResponse.json(
        { error: "Unsupported currency" },
        { status: 400 }
      );
    }

    const user = await prismadb.user.findUnique({
      where: { clerkId: userId },
      select: { clerkId: true, email: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // MIA settles in Moldovan lei (MDL). Convert the displayed price (in
    // whichever currency the buyer picked) to MDL using the same EUR-based
    // rate table used for display, so the charged amount always matches
    // what was shown for the card flow.
    const amountMdl =
      Math.round(
        ((displayAmount / currenciesRate[displayCurrency]) *
          currenciesRate["MDL"]) *
          100
      ) / 100;

    const orderId = `mia_${userId}_${Date.now()}`;
    const description = `Yum-mi ${tokens} Tokens`;

    const qr = await createMiaDynamicQr({
      orderId,
      amount: amountMdl,
      description,
      redirectUrl: `${APP_URL}/dashboard`,
      callbackUrl: `${APP_URL}/api/webhooks/mia`,
      ttlSeconds: 900, // 15 minutes to scan & pay
    });

    await prismadb.transaction.create({
      data: {
        tracking_id: qr.qrExtensionUUID,
        userId: user.clerkId,
        status: "pending",
        amount: Math.round(amountMdl * 100),
        currency: "MDL",
        description,
        type: "payment",
        payment_method_type: "mia",
      },
    });

    return NextResponse.json({
      success: true,
      qrAsText: qr.qrAsText,
      qrExtensionUUID: qr.qrExtensionUUID,
      orderId,
      tokens,
      amountMdl,
    });
  } catch (error) {
    console.error("[MIA] QR creation error:", error);
    return NextResponse.json(
      {
        error: "Failed to create MIA QR code",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
