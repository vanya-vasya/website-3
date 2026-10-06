export const COOKIE_CONSENT_NAME = "yum-mi-cookie-consent";
export const COOKIE_SETTINGS_EVENT = "yum-mi-open-cookie-settings";
export const COOKIE_CONSENT_CHANGED_EVENT = "yum-mi-cookie-consent-changed";
export const GA_MEASUREMENT_ID = "G-DYY23NK5V1";
export const COOKIE_CONSENT_MAX_AGE = 60 * 60 * 24 * 180;

export type CookieConsent = {
  analytics: boolean;
};

export const readCookieConsent = (): CookieConsent | null => {
  if (typeof document === "undefined") return null;

  const entry = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_CONSENT_NAME}=`));

  if (!entry) return null;

  const value = decodeURIComponent(entry.split("=").slice(1).join("="));
  if (value === "all") return { analytics: true };
  if (value === "necessary") return { analytics: false };

  try {
    const parsed = JSON.parse(value) as Partial<CookieConsent>;
    if (typeof parsed.analytics === "boolean") {
      return { analytics: parsed.analytics };
    }
  } catch {
    return null;
  }

  return null;
};

export const writeCookieConsent = (consent: CookieConsent) => {
  const value = encodeURIComponent(JSON.stringify(consent));
  document.cookie = `${COOKIE_CONSENT_NAME}=${value}; Max-Age=${COOKIE_CONSENT_MAX_AGE}; Path=/; SameSite=Lax`;
  window.dispatchEvent(new Event(COOKIE_CONSENT_CHANGED_EVENT));
};

export const clearOptionalCookies = () => {
  const gaDisable = `ga-disable-${GA_MEASUREMENT_ID}`;
  (window as Window & Record<string, boolean>)[gaDisable] = true;

  const names = document.cookie
    .split(";")
    .map((part) => part.split("=")[0]?.trim())
    .filter((name): name is string => Boolean(name))
    .filter((name) => name === "_ga" || name.startsWith("_ga_"));

  names.forEach((name) => {
    document.cookie = `${name}=; Max-Age=0; Path=/`;
    document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${window.location.hostname}`;
  });
};
