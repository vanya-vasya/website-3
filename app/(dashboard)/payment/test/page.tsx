"use client";

import { useState } from 'react';
import { NetworkPaymentWidget } from '@/components/networx-payment-widget';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';

const PaymentTestPage = () => {
  const [paymentConfig, setPaymentConfig] = useState({
    amount: 10.00,
    currency: 'USD',
    orderId: `order_${Date.now()}`,
    description: 'Тестовый платеж через Networx Payment Gateway',
    customerEmail: 'test@example.com',
  });

  const [showWidget, setShowWidget] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<any>(null);

  const handleConfigChange = (field: string, value: any) => {
    setPaymentConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentSuccess = (transactionData: any) => {
    console.log('Payment successful:', transactionData);
    setLastTransaction(transactionData);
    toast.success('Платеж успешно завершен!');
    setShowWidget(false);
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
    toast.error('Ошибка при обработке платежа');
    setShowWidget(false);
  };

  const handlePaymentCancel = () => {
    console.log('Payment canceled');
    toast('Платеж отменен пользователем');
    setShowWidget(false);
  };

  const resetTest = () => {
    setPaymentConfig({
      amount: 10.00,
      currency: 'USD',
      orderId: `order_${Date.now()}`,
      description: 'Тестовый платеж через Networx Payment Gateway',
      customerEmail: 'test@example.com',
    });
    setShowWidget(false);
    setLastTransaction(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Тестирование Networx Payment Gateway</h1>
        <p className="text-gray-600">
          Эта страница предназначена для тестирования интеграции с платежной системой Networx.
        </p>
        <Badge variant="secondary" className="mt-2">
          Тестовый режим
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Конфигурация платежа */}
        <Card>
          <CardHeader>
            <CardTitle>Настройки платежа</CardTitle>
            <CardDescription>
              Настройте параметры для тестового платежа
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Сумма</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={paymentConfig.amount}
                  onChange={(e) => handleConfigChange('amount', parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Валюта</Label>
                <Select 
                  value={paymentConfig.currency} 
                  onValueChange={(value) => handleConfigChange('currency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="RUB">RUB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="orderId">ID заказа</Label>
              <Input
                id="orderId"
                value={paymentConfig.orderId}
                onChange={(e) => handleConfigChange('orderId', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerEmail">Email клиента</Label>
              <Input
                id="customerEmail"
                type="email"
                value={paymentConfig.customerEmail}
                onChange={(e) => handleConfigChange('customerEmail', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <textarea
                id="description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={paymentConfig.description}
                onChange={(e) => handleConfigChange('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={() => setShowWidget(true)}
                className="flex-1"
                disabled={showWidget}
              >
                Показать виджет оплаты
              </Button>
              <Button 
                onClick={resetTest}
                variant="outline"
              >
                Сбросить
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Виджет платежа или результат */}
        <div className="space-y-6">
          {showWidget ? (
            <NetworkPaymentWidget
              amount={paymentConfig.amount}
              currency={paymentConfig.currency}
              orderId={paymentConfig.orderId}
              description={paymentConfig.description}
              customerEmail={paymentConfig.customerEmail}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              onCancel={handlePaymentCancel}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Инструкции для тестирования</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600">
                  <h4 className="font-semibold mb-2">Для тестирования используйте:</h4>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Тестовые карты согласно документации Networx</li>
                    <li>Любой валидный email</li>
                    <li>Суммы от 0.01 до 999999.99</li>
                  </ul>
                </div>

                <div className="text-sm text-gray-600">
                  <h4 className="font-semibold mb-2">Тестовые карты (если поддерживаются):</h4>
                  <div className="bg-gray-50 p-3 rounded font-mono text-xs">
                    <p>4111111111111111 - Visa успешная</p>
                    <p>4000000000000002 - Visa отклоненная</p>
                    <p>5555555555554444 - MasterCard успешная</p>
                  </div>
                </div>

                {!showWidget && (
                  <p className="text-center text-gray-500 italic">
                    Нажмите &quot;Показать виджет оплаты&quot; для начала тестирования
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Результат последней транзакции */}
          {lastTransaction && (
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Последняя успешная транзакция</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 p-4 rounded-lg">
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(lastTransaction, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Информация о конфигурации */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Информация о конфигурации</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Переменные окружения:</h4>
              <div className="space-y-1 text-gray-600">
                <p>• NETWORX_SHOP_ID: {process.env.NEXT_PUBLIC_NETWORX_SHOP_ID ? '✅ Настроен' : '❌ Не настроен'}</p>
                <p>• NETWORX_SECRET_KEY: ✅ Защищен</p>
                <p>• NETWORX_TEST_MODE: {process.env.NEXT_PUBLIC_NETWORX_TEST_MODE || 'true'}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">API Endpoints:</h4>
              <div className="space-y-1 text-gray-600">
                <p>• Создание платежа: /api/payment/networx</p>
                <p>• Webhook: /api/webhooks/networx</p>
                <p>• Успех: /payment/success</p>
                <p>• Отмена: /payment/cancel</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentTestPage;
