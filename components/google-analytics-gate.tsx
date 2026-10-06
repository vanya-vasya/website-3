"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { useEffect, useState } from "react";
import {
  COOKIE_CONSENT_CHANGED_EVENT,
  GA_MEASUREMENT_ID,
  readCookieConsent,
} from "@/lib/cookie-consent";

export const GoogleAnalyticsGate = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const sync = () => {
      const consent = readCookieConsent();
      const analyticsEnabled = consent?.analytics === true;
      const gaDisable = `ga-disable-${GA_MEASUREMENT_ID}`;
      (window as Window & Record<string, boolean>)[gaDisable] = !analyticsEnabled;
      setEnabled(analyticsEnabled);
    };

    sync();
    window.addEventListener(COOKIE_CONSENT_CHANGED_EVENT, sync);
    return () => window.removeEventListener(COOKIE_CONSENT_CHANGED_EVENT, sync);
  }, []);

  if (!enabled) return null;

  return <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />;
};
