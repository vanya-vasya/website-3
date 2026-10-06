"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  COOKIE_SETTINGS_EVENT,
  clearOptionalCookies,
  readCookieConsent,
  writeCookieConsent,
  type CookieConsent,
} from "@/lib/cookie-consent";

const buttonClass =
  "px-4 py-2 text-sm font-semibold rounded-md border border-black focus:outline-none focus:ring-2 focus:ring-black";

export const CookieConsentBanner = () => {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [managing, setManaging] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const stored = readCookieConsent();
    setAnalytics(stored?.analytics ?? false);
    setOpen(stored === null);
    setReady(true);

    const handleOpenSettings = () => {
      const current = readCookieConsent();
      setAnalytics(current?.analytics ?? false);
      setManaging(true);
      setOpen(true);
    };

    window.addEventListener(COOKIE_SETTINGS_EVENT, handleOpenSettings);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, handleOpenSettings);
  }, []);

  const handleSave = (consent: CookieConsent) => {
    writeCookieConsent(consent);
    if (!consent.analytics) clearOptionalCookies();
    setAnalytics(consent.analytics);
    setManaging(false);
    setOpen(false);
  };

  const handleAcceptAll = () => handleSave({ analytics: true });
  const handleRejectOptional = () => handleSave({ analytics: false });
  const handleSavePreferences = () => handleSave({ analytics });
  const handleManage = () => setManaging(true);

  if (!ready || !open) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[80] p-4"
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
    >
      <div className="mx-auto max-w-3xl rounded-lg border border-gray-300 bg-white p-4 text-black shadow-xl">
        <h2 id="cookie-consent-title" className="text-base font-semibold">
          Cookies
        </h2>
        <p className="mt-2 text-sm leading-6">
          We use necessary cookies to operate Yum-mi. With your permission, we also use optional
          cookies for analytics. You can accept optional cookies, reject them or manage your
          preferences. See our{" "}
          <Link href="/cookies-policy" className="underline">
            Cookies Policy
          </Link>{" "}
          for details.
        </p>

        {managing && (
          <fieldset className="mt-4 space-y-2 text-sm">
            <legend className="font-semibold">Cookie categories</legend>
            <label className="flex items-start gap-2">
              <input type="checkbox" checked disabled className="mt-1" />
              <span>Strictly necessary. Always on. Used for sign-in and to store this choice.</span>
            </label>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(event) => setAnalytics(event.target.checked)}
                className="mt-1"
              />
              <span>Analytics. Google Analytics. Optional.</span>
            </label>
          </fieldset>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className={`${buttonClass} bg-black text-white`} onClick={handleAcceptAll}>
            Accept All
          </button>
          <button type="button" className={`${buttonClass} bg-white`} onClick={handleRejectOptional}>
            Reject Optional
          </button>
          {managing ? (
            <button type="button" className={`${buttonClass} bg-white`} onClick={handleSavePreferences}>
              Save preferences
            </button>
          ) : (
            <button type="button" className={`${buttonClass} bg-white`} onClick={handleManage}>
              Manage Preferences
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
