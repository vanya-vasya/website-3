import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";
import { settleMiaPayment } from "@/lib/mia-bpay";

// GET - Poll MIA QR payment status from the client and credit tokens once paid.
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const qrExtensionUUID = searchParams.get("uuid");
    if (!qrExtensionUUID) {
      return NextResponse.json(
        { error: "uuid query parameter is required" },
        { status: 400 }
      );
    }

    const transaction = await prismadb.transaction.findFirst({
      where: { tracking_id: qrExtensionUUID },
    });
    if (!transaction || transaction.userId !== userId) {
      return NextResponse.json(
        { error: "MIA transaction not found" },
        { status: 404 }
      );
    }

    const result = await settleMiaPayment(qrExtensionUUID);

    return NextResponse.json({
      success: true,
      isPaid: result.isPaid,
      alreadyProcessed: result.alreadyProcessed,
    });
  } catch (error) {
    console.error("[MIA] Status check error:", error);
    return NextResponse.json(
      {
        error: "Failed to check MIA payment status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
