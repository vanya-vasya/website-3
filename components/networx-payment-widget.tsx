"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader } from '@/components/loader';
import { toast } from 'react-hot-toast';

interface NetworkPaymentWidgetProps {
  amount: number;
  currency?: string;
  orderId: string;
  description?: string;
  customerEmail?: string;
  onSuccess?: (transactionData: any) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
}

interface PaymentResponse {
  success: boolean;
  token?: string;
  payment_url?: string;
  error?: string;
  details?: any;
}

export const NetworkPaymentWidget: React.FC<NetworkPaymentWidgetProps> = ({
  amount,
  currency = 'USD',
  orderId,
  description,
  customerEmail,
  onSuccess,
  onError,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentToken, setPaymentToken] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [email, setEmail] = useState(customerEmail || '');

  // Функция для создания платежного токена
  const createPaymentToken = async () => {
    if (!email) {
      toast.error('Введите email для продолжения');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/payment/networx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          orderId,
          description,
          customerEmail: email,
        }),
      });

      const data: PaymentResponse = await response.json();

      if (data.success && data.token && data.payment_url) {
        setPaymentToken(data.token);
        setPaymentUrl(data.payment_url);
        
        if (data.mock) {
          toast.success('Тестовый токен создан (Demo Mode)', {
            duration: 4000,
          });
        } else {
          toast.success('Токен для оплаты создан');
        }
      } else {
        console.error('Payment token creation failed:', data);
        toast.error(data.error || 'Ошибка создания токена для оплаты');
        onError?.(data);
      }
    } catch (error) {
      console.error('Payment token creation error:', error);
      toast.error('Ошибка соединения с сервером');
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для открытия платежного виджета
  const openPaymentWidget = () => {
    if (!paymentUrl) return;

    // Открываем платежную страницу в новом окне
    const paymentWindow = window.open(
      paymentUrl,
      'networx_payment',
      'width=800,height=600,scrollbars=yes,resizable=yes'
    );

    if (!paymentWindow) {
      toast.error('Не удалось открыть окно оплаты. Проверьте настройки браузера.');
      return;
    }

    // Слушаем сообщения от платежного окна
    const handleMessage = (event: MessageEvent) => {
      // Проверяем источник сообщения для безопасности
      if (event.origin !== process.env.NEXT_PUBLIC_NETWORX_WIDGET_URL) {
        return;
      }

      const { type, data } = event.data;

      switch (type) {
        case 'payment_success':
          paymentWindow.close();
          toast.success('Платеж успешно завершен!');
          onSuccess?.(data);
          break;

        case 'payment_error':
          paymentWindow.close();
          toast.error('Ошибка при обработке платежа');
          onError?.(data);
          break;

        case 'payment_cancel':
          paymentWindow.close();
          toast('Платеж отменен');
          onCancel?.();
          break;
      }
    };

    window.addEventListener('message', handleMessage);

    // Очищаем обработчик при закрытии окна
    const checkClosed = setInterval(() => {
      if (paymentWindow.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', handleMessage);
      }
    }, 1000);
  };

  // Функция для проверки статуса платежа
  const checkPaymentStatus = async () => {
    if (!paymentToken) return;

    try {
      const response = await fetch(`/api/payment/networx?token=${paymentToken}`);
      const data = await response.json();

      if (data.success) {
        const status = data.transaction?.status;
        console.log('Payment status:', status);

        switch (status) {
          case 'success':
            toast.success('Платеж успешно завершен!');
            onSuccess?.(data.transaction);
            break;
          case 'failed':
            toast.error('Платеж не удался');
            onError?.(data.transaction);
            break;
          case 'pending':
            toast('Платеж обрабатывается...');
            break;
          case 'canceled':
            toast('Платеж отменен');
            onCancel?.();
            break;
        }
      }
    } catch (error) {
      console.error('Payment status check error:', error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Оплата через Networx</CardTitle>
        <CardDescription>
          Сумма к оплате: {amount} {currency}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!paymentToken ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email для уведомлений</Label>
              <Input
                id="email"
                type="email"
                placeholder="your-email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <strong>Заказ:</strong> {orderId}
              </p>
              {description && (
                <p className="text-sm text-gray-600">
                  <strong>Описание:</strong> {description}
                </p>
              )}
            </div>

            <Button
              onClick={createPaymentToken}
              disabled={isLoading || !email}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader />
                  Создание токена...
                </>
              ) : (
                'Создать токен для оплаты'
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ Токен для оплаты создан успешно
              </p>
              <p className="text-xs text-green-600 mt-1">
                Token: {paymentToken}
              </p>
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-xs text-yellow-800">
                  🧪 <strong>Demo Mode:</strong> Сейчас используется тестовый API. 
                  Для продакшена потребуется настроить реальный Networx Payment Gateway.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={openPaymentWidget}
                className="w-full"
                disabled={!paymentUrl}
              >
                Открыть окно оплаты
              </Button>

              <Button
                onClick={checkPaymentStatus}
                variant="outline"
                className="w-full"
              >
                Проверить статус платежа
              </Button>
            </div>

            <div className="text-xs text-gray-500">
              <p>• Платежное окно откроется в новой вкладке</p>
              <p>• После оплаты вы будете перенаправлены обратно</p>
              <p>• В тестовом режиме используйте тестовые карты</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
