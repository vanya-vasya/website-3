import Receipt from "@/components/pdf/receipt";
import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";

// @react-pdf/renderer needs the Node.js runtime (not Edge)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type GenerateReceiptBody = {
  receiptId?: string;
  email?: string;
  date?: string;
  tokens?: number;
  description?: string;
  amount?: number;
  currency?: string;
};

export async function POST(req: Request) {
  let body: GenerateReceiptBody;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { receiptId, email, date, tokens, description, amount, currency } =
    body;

  const missingFields = (
    [
      ["receiptId", receiptId],
      ["email", email],
      ["date", date],
      ["tokens", tokens],
      ["description", description],
      ["amount", amount],
      ["currency", currency],
    ] as const
  )
    .filter(([, value]) => value === undefined || value === null || value === "")
    .map(([name]) => name);

  if (missingFields.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missingFields.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    const pdfBuffer = await renderToBuffer(
      <Receipt
        receiptId={receiptId}
        email={email as string}
        date={date as string}
        tokens={tokens as number}
        description={description as string}
        amount={amount as number}
        currency={currency as string}
      />
    );

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(pdfBuffer.length),
        "Content-Disposition": `inline; filename="receipt-${receiptId}.pdf"`,
      },
    });
  } catch (error) {
    console.error("[GENERATE_RECEIPT_ERROR]", error);
    return NextResponse.json(
      {
        error: "Failed to generate receipt PDF",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
