import prismadb from "@/lib/prismadb";
import { createPublicKey, verify } from "crypto";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// Функция для форматирования публичного ключа
function chunkSplit(str: string, length: number) {
  const chunked = [];
  for (let i = 0; i < str.length; i += length) {
    chunked.push(str.slice(i, i + length));
  }
  return chunked.join("\n");
}

export async function POST(req: Request) {
  try {
    const headersList = headers();
    const shopPublicKey = process.env.SHOP_PUBLIC_KEY;

    if (!shopPublicKey) {
      throw new Error("Please add SHOP_PUBLIC_KEY to .env or .env.local");
    }

    const signature = headersList.get("content-signature");

    if (!signature) {
      return NextResponse.json(
        { success: false, error: "Missing signature." },
        { status: 403 }
      );
    }

    // Форматирование публичного ключа
    const formattedPublicKey = `-----BEGIN PUBLIC KEY-----\n${chunkSplit(
      shopPublicKey,
      64
    )}\n-----END PUBLIC KEY-----`;
    const publicKey = createPublicKey(formattedPublicKey);

    // Получение необработанного тела запроса
    const rawBody = await req.text();

    const isVerified = verify(
      "sha256",
      Buffer.from(rawBody), // Используем тело как строку, а не JSON
      publicKey,
      Buffer.from(signature, "base64")
    );
    if (isVerified) {
      const body = JSON.parse(rawBody); // Теперь можем парсить тело
      if (body?.transaction?.status === "successful") {
        const userId = body?.transaction?.tracking_id;

        const user = await prismadb.user.findUnique({
          where: {
            clerkId: userId,
          },
          select: {
            usedGenerations: true,
            availableGenerations: true,
          },
        });

        if (!user) {
          return NextResponse.json(
            { success: false, message: "User not found." },
            { status: 403 }
          );
        }

        const text = body?.transaction?.description;
        const match = text.match(/\((\d+)\sTokens\)/);

        if (!match) {
          return NextResponse.json(
            { success: false, message: "Generations not found." },
            { status: 403 }
          );
        }
        const number = parseInt(match[1]);

        await prismadb.user.update({
          where: {
            clerkId: userId,
          },
          data: {
            availableGenerations:
              user?.availableGenerations - user?.usedGenerations + number,
            usedGenerations: 0,
          },
        });

        const transaction = body.transaction;

        await prismadb.transaction.create({
          data: {
            tracking_id: transaction.tracking_id,
            userId: userId,
            status: transaction.status,
            amount: transaction.amount,
            currency: transaction.currency,
            description: transaction.description,
            type: transaction.type,
            payment_method_type: transaction.payment_method_type,
            message: transaction.message,
            paid_at: transaction.paid_at ? new Date(transaction.paid_at) : null,
            receipt_url: transaction.receipt_url,
          },
        });

        return NextResponse.json(
          { success: true, message: "Success Response" },
          { status: 200 }
        );
      } else {
        console.log("Transaction was not successful.");
        return NextResponse.json(
          { success: false, message: "Transaction was not successful" },
          { status: 200 }
        );
      }
    } else {
      console.log("Invalid signature.");
      return NextResponse.json(
        { success: false, message: "Invalid signature." },
        { status: 403 }
      );
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { success: false, error: "Internal Error." },
      { status: 500 }
    );
  }
}
