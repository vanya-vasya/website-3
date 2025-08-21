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
    console.log('=== Networx Payment API Called ===');
    const body = await request.json();
    console.log('Request body:', body);
    
    const { amount, currency = 'USD', orderId, description, customerEmail } = body;

    if (!amount || !orderId) {
      console.log('Missing required fields:', { amount, orderId });
      return NextResponse.json(
        { error: 'Amount and orderId are required' },
        { status: 400 }
      );
    }

    const shopId = process.env.NETWORX_SHOP_ID;
    const secretKey = process.env.NETWORX_SECRET_KEY;
    
    console.log('Environment variables:', {
      shopId: shopId ? 'SET' : 'MISSING',
      secretKey: secretKey ? 'SET' : 'MISSING',
      apiUrl: process.env.NETWORX_API_URL,
      returnUrl: process.env.NETWORX_RETURN_URL,
      testMode: process.env.NETWORX_TEST_MODE
    });

    if (!shopId || !secretKey) {
      console.log('Credentials missing - shopId:', !!shopId, 'secretKey:', !!secretKey);
      return NextResponse.json(
        { error: 'Networx credentials not configured' },
        { status: 500 }
      );
    }

    // Параметры для BeGateway API
    const tokenData = {
      request: {
        amount: amount * 100, // BeGateway использует центы
        currency: currency,
        description: description || 'Payment for order',
        order_id: orderId,
        tracking_id: orderId,
        credit_card: {
          verification: false
        },
        customer: {
          email: customerEmail
        },
        billing_address: {
          first_name: 'Customer',
          last_name: 'Customer'
        },
        notification_url: process.env.NETWORX_WEBHOOK_URL,
        success_url: process.env.NETWORX_RETURN_URL,
        fail_url: process.env.NETWORX_CANCEL_URL,
        cancel_url: process.env.NETWORX_CANCEL_URL,
        test: process.env.NETWORX_TEST_MODE === 'true'
      }
    };

    console.log('Token data before signature:', tokenData);
    
    // Создаем подпись
    const signature = createSignature(tokenData, secretKey);
    console.log('Generated signature:', signature);

    // Добавляем подпись к данным
    const requestData = {
      ...tokenData,
      signature: signature,
    };

    console.log('Final request data:', requestData);
    // Попробуем BeGateway API endpoints (Networx может использовать BeGateway)
    const possibleUrls = [
      'https://demo-gateway.begateway.com/transactions/notifications',
      'https://checkout.begateway.com/checkout',
      'https://gateway.begateway.com/transactions',
      'https://checkout.networxpay.com/checkout'
    ];
    
    const apiUrl = possibleUrls[2]; // Попробуем BeGateway transactions endpoint
    console.log('Making request to:', apiUrl);

    // ВРЕМЕННОЕ РЕШЕНИЕ: Mock API response для тестирования
    // TODO: Заменить на настоящий Networx API когда получим правильную документацию
    
    console.log('=== USING MOCK API RESPONSE ===');
    console.log('Real API call would be made to:', apiUrl);
    console.log('With auth:', `Shop ID: ${shopId}`);
    console.log('Request data:', JSON.stringify(tokenData, null, 2));
    
    // Создаем mock токен для тестирования
    const mockToken = `test_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Возвращаем успешный mock ответ
    return NextResponse.json({
      success: true,
      token: mockToken,
      payment_url: `https://checkout.networxpay.com?token=${mockToken}`,
      mock: true,
      message: 'Mock response - replace with real Networx API when available'
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
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
