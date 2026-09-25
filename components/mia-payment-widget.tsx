"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { toast } from "react-hot-toast";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";

interface MiaPaymentWidgetProps {
  amount: number;
  currency: string;
  tokens: number;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
  onCancel?: () => void;
}

const POLL_INTERVAL_MS = 3000;
const QR_TTL_SECONDS = 900; // matches ttlSeconds sent to the create-qr API

export const MiaPaymentWidget: React.FC<MiaPaymentWidgetProps> = ({
  amount,
  currency,
  tokens,
  onSuccess,
  onError,
  onCancel,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [qrExtensionUUID, setQrExtensionUUID] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(QR_TTL_SECONDS);
  const [expired, setExpired] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimers = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    pollRef.current = null;
    countdownRef.current = null;
  }, []);

  useEffect(() => stopTimers, [stopTimers]);

  const generateQr = useCallback(async () => {
    setIsCreating(true);
    setExpired(false);
    stopTimers();

    try {
      const response = await fetch("/api/payment/mia/create-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokens, amount, currency }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to create MIA payment");
      }

      const imageDataUrl = await QRCode.toDataURL(data.qrAsText, {
        width: 260,
        margin: 1,
      });

      setQrImage(imageDataUrl);
      setQrExtensionUUID(data.qrExtensionUUID);
      setSecondsLeft(QR_TTL_SECONDS);

      // Countdown timer for the QR's validity window.
      countdownRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setExpired(true);
            stopTimers();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Poll for payment confirmation.
      pollRef.current = setInterval(async () => {
        try {
          const statusResponse = await fetch(
            `/api/payment/mia/check-status?uuid=${encodeURIComponent(
              data.qrExtensionUUID
            )}`
          );
          const statusData = await statusResponse.json();

          if (statusData.success && statusData.isPaid) {
            stopTimers();
            toast.success("MIA payment received!");
            onSuccess?.();
          }
        } catch (pollError) {
          console.error("[MIA] Poll error:", pollError);
        }
      }, POLL_INTERVAL_MS);
    } catch (error) {
      console.error("[MIA] QR generation error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to start MIA payment"
      );
      onError?.(error);
    } finally {
      setIsCreating(false);
    }
  }, [amount, currency, tokens, onSuccess, onError, stopTimers]);

  useEffect(() => {
    generateQr();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div
      className="flex flex-col items-center gap-4 py-2"
      style={{
        fontFamily:
          'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <p className="text-black text-sm text-center">
        Scan this code with your banking app to pay via{" "}
        <span className="font-bold">MIA</span>
      </p>

      <div className="flex items-center justify-center w-[260px] h-[260px] rounded-lg border-2 border-black bg-white">
        {isCreating && !qrImage && <Loader />}
        {qrImage && !expired && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qrImage} alt="MIA QR code" width={260} height={260} />
        )}
        {expired && (
          <p className="text-center text-sm text-gray-500 px-4">
            This code has expired. Generate a new one to continue.
          </p>
        )}
      </div>

      {!expired && qrImage && (
        <p className="text-xs text-gray-500">
          Code expires in {minutes}:{seconds.toString().padStart(2, "0")}
        </p>
      )}

      <div className="text-black text-sm font-bold">
        {tokens} Tokens — {amount.toFixed(2)} {currency}
      </div>

      <div className="flex w-full gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1 border-gray-300 text-black"
          onClick={onCancel}
        >
          Cancel
        </Button>
        {expired && (
          <Button
            type="button"
            disabled={isCreating}
            className="flex-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:from-green-500 hover:via-green-600 hover:to-green-700 text-white font-bold"
            onClick={generateQr}
          >
            {isCreating ? <Loader /> : "Generate new code"}
          </Button>
        )}
      </div>

      {qrExtensionUUID && (
        <p className="text-[10px] text-gray-400 break-all">
          Order ref: {qrExtensionUUID}
        </p>
      )}
    </div>
  );
};
