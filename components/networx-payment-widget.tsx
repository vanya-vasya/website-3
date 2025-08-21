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
  mock?: boolean;
  message?: string;
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

  // Function to create payment token
  const createPaymentToken = async () => {
    if (!email) {
      toast.error('Please enter email to continue');
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
        
        toast.success('Payment token created successfully');
      } else {
        console.error('Payment token creation failed:', data);
        toast.error(data.error || 'Failed to create payment token');
        onError?.(data);
      }
    } catch (error) {
      console.error('Payment token creation error:', error);
      toast.error('Server connection error');
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to open payment widget
  const openPaymentWidget = () => {
    if (!paymentUrl) return;

    // Open payment page in new window
    const paymentWindow = window.open(
      paymentUrl,
      'networx_payment',
      'width=800,height=600,scrollbars=yes,resizable=yes'
    );

    if (!paymentWindow) {
      toast.error('Failed to open payment window. Please check your browser settings.');
      return;
    }

    // Listen for messages from payment window
    const handleMessage = (event: MessageEvent) => {
      // Check message origin for security
      const widgetUrl = process.env.NEXT_PUBLIC_NETWORX_WIDGET_URL || 'https://checkout.networxpay.com';
      if (event.origin !== widgetUrl) {
        return;
      }

      const { type, data } = event.data;

      switch (type) {
        case 'payment_success':
          paymentWindow.close();
          toast.success('Payment completed successfully!');
          onSuccess?.(data);
          break;

        case 'payment_error':
          paymentWindow.close();
          toast.error('Payment processing error');
          onError?.(data);
          break;

        case 'payment_cancel':
          paymentWindow.close();
          toast('Payment cancelled');
          onCancel?.();
          break;
      }
    };

    window.addEventListener('message', handleMessage);

    // Clean up handler when window closes
    const checkClosed = setInterval(() => {
      if (paymentWindow.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', handleMessage);
      }
    }, 1000);
  };

  // Function to check payment status
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
            toast.success('Payment completed successfully!');
            onSuccess?.(data.transaction);
            break;
          case 'failed':
            toast.error('Payment failed');
            onError?.(data.transaction);
            break;
          case 'pending':
            toast('Payment processing...');
            break;
          case 'canceled':
            toast('Payment cancelled');
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
        <CardTitle>Payment via Networx</CardTitle>
        <CardDescription>
          Amount to pay: {amount} {currency}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!paymentToken ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email for notifications</Label>
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
                <strong>Order:</strong> {orderId}
              </p>
              {description && (
                <p className="text-sm text-gray-600">
                  <strong>Description:</strong> {description}
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
                  Creating token...
                </>
              ) : (
                'Create Payment Token'
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ Payment token created successfully
              </p>
              <p className="text-xs text-green-600 mt-1">
                Token: {paymentToken}
              </p>
            </div>

            <div className="space-y-2">
              <Button
                onClick={openPaymentWidget}
                className="w-full"
                disabled={!paymentUrl}
              >
                Open Payment Window
              </Button>

              <Button
                onClick={checkPaymentStatus}
                variant="outline"
                className="w-full"
              >
                Check Payment Status
              </Button>
            </div>

            <div className="text-xs text-gray-500">
              <p>• Payment window will open in a new tab</p>
              <p>• You will be redirected back after payment</p>
              <p>• Use real bank cards for payment</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
