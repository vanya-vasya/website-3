"use client";

import { COOKIE_SETTINGS_EVENT } from "@/lib/cookie-consent";

const fontFamily =
  'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export const CookieSettingsButton = () => {
  const handleOpenCookieSettings = () => {
    window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT));
  };

  return (
    <button
      type="button"
      onClick={handleOpenCookieSettings}
      className="text-left"
      style={{
        fontFamily,
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: "0.01em",
        textTransform: "none",
        color: "#0f172a",
        background: "transparent",
        border: 0,
        padding: 0,
        cursor: "pointer",
      }}
    >
      Cookie Settings
    </button>
  );
};
