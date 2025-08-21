"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft, Receipt } from 'lucide-react';
import { Loader } from '@/components/loader';

interface TransactionData {
  transaction_id?: string;
  order_id?: string;
  amount?: string;
  currency?: string;
  status?: string;
  customer_email?: string;
}

const PaymentSuccessPage = () => {
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchTransactionData = async () => {
      const token = searchParams.get('token');
      const orderId = searchParams.get('order_id');

      if (!token && !orderId) {
        setError('Отсутствуют данные транзакции');
        setIsLoading(false);
        return;
      }

      try {
        const queryParam = token ? `token=${token}` : `orderId=${orderId}`;
        const response = await fetch(`/api/payment/networx?${queryParam}`);
        const data = await response.json();

        if (data.success && data.transaction) {
          setTransactionData(data.transaction);
        } else {
          setError('Не удалось получить данные транзакции');
        }
      } catch (error) {
        console.error('Error fetching transaction data:', error);
        setError('Ошибка при получении данных транзакции');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactionData();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-gray-600">Проверяем статус платежа...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Ошибка</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/dashboard">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Вернуться в панель управления
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-600">
            Платеж успешно завершен!
          </CardTitle>
          <CardDescription>
            Спасибо за ваш платеж. Транзакция была обработана успешно.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {transactionData && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-gray-900">Детали транзакции:</h3>
              
              {transactionData.transaction_id && (
                <div className="flex justify-between">
                  <span className="text-gray-600">ID транзакции:</span>
                  <span className="font-mono text-sm">{transactionData.transaction_id}</span>
                </div>
              )}
              
              {transactionData.order_id && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Номер заказа:</span>
                  <span className="font-mono text-sm">{transactionData.order_id}</span>
                </div>
              )}
              
              {transactionData.amount && transactionData.currency && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Сумма:</span>
                  <span className="font-semibold">
                    {transactionData.amount} {transactionData.currency}
                  </span>
                </div>
              )}
              
              {transactionData.status && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Статус:</span>
                  <span className="text-green-600 font-semibold capitalize">
                    {transactionData.status}
                  </span>
                </div>
              )}
              
              {transactionData.customer_email && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="text-sm">{transactionData.customer_email}</span>
                </div>
              )}
            </div>
          )}

          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-4">
              Уведомление о платеже было отправлено на ваш email. 
              Вы можете продолжить использование всех функций платформы.
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <Link href="/dashboard" className="w-full">
              <Button className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Вернуться в панель управления
              </Button>
            </Link>
            
            <Link href="/dashboard/billing/payment-history" className="w-full">
              <Button variant="outline" className="w-full">
                <Receipt className="w-4 h-4 mr-2" />
                Посмотреть историю платежей
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;
