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

    // Networx Pay API credentials and configuration
    const shopId = process.env.NETWORX_SHOP_ID || '29959';
    const secretKey = process.env.NETWORX_SECRET_KEY || 'dbfb6f4e977f49880a6ce3c939f1e7be645a5bb2596c04d9a3a7b32d52378950';
    const apiUrl = process.env.NETWORX_API_URL || 'https://api.networxpay.com';  // Updated to correct API URL
    const returnUrl = process.env.NETWORX_RETURN_URL || 'http://localhost:3001/payment/success';
    const cancelUrl = process.env.NETWORX_CANCEL_URL || 'http://localhost:3001/payment/cancel';
    const webhookUrl = process.env.NETWORX_WEBHOOK_URL || 'http://localhost:3001/api/webhooks/networx';
    const testMode = process.env.NETWORX_TEST_MODE === 'true' ? true : false;
    
    console.log('Environment variables:', {
      shopId: shopId ? 'SET' : 'MISSING',
      secretKey: secretKey ? 'SET' : 'MISSING',
      apiUrl,
      returnUrl,
      testMode
    });
    
    console.log('API Version: 1, Authentication: HTTP Basic');

    // Request structure according to Networx Pay API v1 documentation
    const requestData = {
      shop_id: shopId,
      amount: amount * 100, // Amount in cents
      currency: currency,
      description: description || 'Payment for order',
      order_id: orderId,
      customer_email: customerEmail,
      return_url: returnUrl,
      cancel_url: cancelUrl,
      notification_url: webhookUrl,
      test_mode: testMode ? 1 : 0
    };

    console.log('Request data before signature:', requestData);
    
    // Create signature according to Networx Pay documentation
    const signature = createSignature(requestData, secretKey);
    console.log('Generated signature:', signature);

    // Add signature to request data
    const finalRequestData = {
      ...requestData,
      signature: signature,
    };

    console.log('Final request data:', finalRequestData);
    
    // FOR DEVELOPMENT: Use test mode implementation until correct API endpoints are confirmed
    if (testMode) {
      console.log('🧪 TEST MODE: Simulating payment token creation');
      
      // Generate a test token for development
      const testToken = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const testTransactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log('✅ TEST MODE: Token created successfully:', testToken);
      
      return NextResponse.json({
        success: true,
        token: testToken,
        payment_url: `https://checkout.networxpay.com?token=${testToken}`,
        transaction_id: testTransactionId,
        test_mode: true,
        message: 'Test payment token created successfully (development mode)'
      });
    }
    
    // Make real API call to Networx Pay (Production mode)
    const networxApiUrl = `${apiUrl}/api/v1/payment/create`;  // Correct API endpoint according to Networx Pay docs
    console.log('Making request to:', networxApiUrl);

    try {
      const networxResponse = await fetch(networxApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString('base64')}`,
        },
        body: JSON.stringify(finalRequestData),
      });

      if (!networxResponse.ok) {
        const errorData = await networxResponse.text();
        console.error('Networx API Error Response:', errorData);
        return NextResponse.json(
          { 
            error: 'Failed to create payment token',
            details: `API returned ${networxResponse.status}: ${errorData}`
          },
          { status: 400 }
        );
      }

      const networxResult = await networxResponse.json();
      console.log('Networx API Success Response:', networxResult);

      // Проверяем успешность ответа от Networx
      if (networxResult.success || networxResult.token) {
        return NextResponse.json({
          success: true,
          token: networxResult.token,
          payment_url: networxResult.payment_url || `https://checkout.networxpay.com?token=${networxResult.token}`,
          transaction_id: networxResult.transaction_id,
        });
      } else {
        console.error('Networx API returned unsuccessful response:', networxResult);
        return NextResponse.json(
          { 
            error: 'Payment token creation failed',
            details: networxResult.error || networxResult.message || 'Unknown error'
          },
          { status: 400 }
        );
      }

    } catch (fetchError) {
      console.error('Network error calling Networx API:', fetchError);
      return NextResponse.json(
        { 
          error: 'Failed to connect to payment gateway',
          details: fetchError instanceof Error ? fetchError.message : 'Network error'
        },
        { status: 500 }
      );
    }

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

    const shopId = process.env.NETWORX_SHOP_ID || '29959';
    const secretKey = process.env.NETWORX_SECRET_KEY || 'dbfb6f4e977f49880a6ce3c939f1e7be645a5bb2596c04d9a3a7b32d52378950';
    const apiUrl = process.env.NETWORX_API_URL || 'https://gateway.networxpay.com';

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

    // Send request to Networx API for status check
    const networxResponse = await fetch(`${apiUrl}/v3/transactions/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString('base64')}`,
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
