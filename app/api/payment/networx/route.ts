import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Функция для создания подписи согласно документации Networx
function createSignature(data: Record<string, any>, secretKey: string): string {
  // Сортируем параметры по ключу
  const sortedParams = Object.keys(data)
    .sort()
    .reduce((obj: Record<string, any>, key) => {
      obj[key] = data[key];
      return obj;
    }, {});

  // Создаем строку для подписи
  const signString = Object.entries(sortedParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  // Создаем подпись HMAC SHA256
  return crypto
    .createHmac('sha256', secretKey)
    .update(signString)
    .digest('hex');
}

// POST - Создание токена для платежа
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = 'USD', orderId, description, customerEmail } = body;

    if (!amount || !orderId) {
      return NextResponse.json(
        { error: 'Amount and orderId are required' },
        { status: 400 }
      );
    }

    const shopId = process.env.NETWORX_SHOP_ID;
    const secretKey = process.env.NETWORX_SECRET_KEY;

    if (!shopId || !secretKey) {
      return NextResponse.json(
        { error: 'Networx credentials not configured' },
        { status: 500 }
      );
    }

    // Параметры для создания токена согласно документации Networx
    const tokenData = {
      shop_id: shopId,
      amount: amount,
      currency: currency,
      order_id: orderId,
      description: description || 'Payment for order',
      customer_email: customerEmail,
      success_url: process.env.NETWORX_RETURN_URL,
      fail_url: process.env.NETWORX_CANCEL_URL,
      callback_url: process.env.NETWORX_WEBHOOK_URL,
      test: process.env.NETWORX_TEST_MODE === 'true' ? 1 : 0,
    };

    // Создаем подпись
    const signature = createSignature(tokenData, secretKey);

    // Добавляем подпись к данным
    const requestData = {
      ...tokenData,
      signature: signature,
    };

    // Отправляем запрос к API Networx для создания токена
    const networxResponse = await fetch(`${process.env.NETWORX_API_URL}/v3/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    const networxResult = await networxResponse.json();

    if (!networxResponse.ok) {
      console.error('Networx API Error:', networxResult);
      return NextResponse.json(
        { error: 'Failed to create payment token', details: networxResult },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      token: networxResult.token,
      payment_url: `${process.env.NETWORX_WIDGET_URL}?token=${networxResult.token}`,
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Проверка статуса платежа
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const orderId = searchParams.get('orderId');

    if (!token && !orderId) {
      return NextResponse.json(
        { error: 'Token or orderId is required' },
        { status: 400 }
      );
    }

    const shopId = process.env.NETWORX_SHOP_ID;
    const secretKey = process.env.NETWORX_SECRET_KEY;

    if (!shopId || !secretKey) {
      return NextResponse.json(
        { error: 'Networx credentials not configured' },
        { status: 500 }
      );
    }

    // Параметры для проверки статуса
    const statusData = {
      shop_id: shopId,
      ...(token && { token }),
      ...(orderId && { order_id: orderId }),
    };

    // Создаем подпись
    const signature = createSignature(statusData, secretKey);

    // Добавляем подпись к данным
    const requestData = {
      ...statusData,
      signature: signature,
    };

    // Отправляем запрос к API Networx для проверки статуса
    const networxResponse = await fetch(`${process.env.NETWORX_API_URL}/v3/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    const networxResult = await networxResponse.json();

    if (!networxResponse.ok) {
      console.error('Networx Status API Error:', networxResult);
      return NextResponse.json(
        { error: 'Failed to check payment status', details: networxResult },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      status: networxResult.status,
      transaction: networxResult,
    });

  } catch (error) {
    console.error('Payment status check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
