import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Функция для верификации подписи webhook согласно документации Networx
function verifyWebhookSignature(data: Record<string, any>, signature: string, secretKey: string): boolean {
  // Удаляем подпись из данных для верификации
  const { signature: _, ...dataForSignature } = data;

  // Сортируем параметры по ключу
  const sortedParams = Object.keys(dataForSignature)
    .sort()
    .reduce((obj: Record<string, any>, key) => {
      obj[key] = dataForSignature[key];
      return obj;
    }, {});

  // Создаем строку для подписи
  const signString = Object.entries(sortedParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  // Создаем подпись HMAC SHA256
  const expectedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(signString)
    .digest('hex');

  return expectedSignature === signature;
}

// POST - Обработка webhook уведомлений от Networx
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Networx webhook received:', body);

    const secretKey = process.env.NETWORX_SECRET_KEY;
    if (!secretKey) {
      console.error('NETWORX_SECRET_KEY not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Верифицируем подпись webhook
    const signature = body.signature;
    if (!signature) {
      console.error('Missing signature in webhook');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    const isValidSignature = verifyWebhookSignature(body, signature, secretKey);
    if (!isValidSignature) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 403 }
      );
    }

    // Обрабатываем различные типы уведомлений
    const { 
      status, 
      order_id, 
      transaction_id, 
      amount, 
      currency, 
      type,
      customer_email,
      error_message 
    } = body;

    console.log(`Payment notification: Order ${order_id}, Status: ${status}, Type: ${type}`);

    // Обработка статусов согласно документации Networx
    switch (status) {
      case 'success':
        console.log(`✅ Payment successful for order ${order_id}, amount: ${amount} ${currency}`);
        // Здесь вы можете обновить статус заказа в базе данных
        // await updateOrderStatus(order_id, 'paid', transaction_id);
        // await sendConfirmationEmail(customer_email, order_id);
        break;

      case 'failed':
        console.log(`❌ Payment failed for order ${order_id}, error: ${error_message}`);
        // Здесь вы можете обновить статус заказа как неудачный
        // await updateOrderStatus(order_id, 'failed', transaction_id, error_message);
        break;

      case 'pending':
        console.log(`⏳ Payment pending for order ${order_id}`);
        // Здесь вы можете обновить статус заказа как ожидающий
        // await updateOrderStatus(order_id, 'pending', transaction_id);
        break;

      case 'canceled':
        console.log(`🚫 Payment canceled for order ${order_id}`);
        // Здесь вы можете обновить статус заказа как отмененный
        // await updateOrderStatus(order_id, 'canceled', transaction_id);
        break;

      case 'refunded':
        console.log(`💰 Payment refunded for order ${order_id}`);
        // Здесь вы можете обработать возврат
        // await updateOrderStatus(order_id, 'refunded', transaction_id);
        break;

      default:
        console.log(`❓ Unknown payment status: ${status} for order ${order_id}`);
    }

    // Дополнительная обработка для разных типов транзакций
    switch (type) {
      case 'payment':
        console.log('Processing payment transaction');
        break;
      case 'refund':
        console.log('Processing refund transaction');
        break;
      case 'chargeback':
        console.log('Processing chargeback transaction');
        break;
      default:
        console.log(`Processing ${type} transaction`);
    }

    // Возвращаем успешный ответ согласно требованиям Networx
    return NextResponse.json({ status: 'ok' }, { status: 200 });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// GET - Для проверки доступности endpoint'а
export async function GET() {
  return NextResponse.json({
    message: 'Networx webhook endpoint is active',
    timestamp: new Date().toISOString(),
  });
}
