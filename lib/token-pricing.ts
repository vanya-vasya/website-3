import { GENERATIONS_PRICE } from "@/constants";
import { currenciesRate, type Currency } from "@/constants/index";

/**
 * Single source of truth for token pricing (landing cards, custom amount
 * and the "Buy More" modal). No bonuses, discounts or promos.
 *
 * EUR is pinned to fixed anchors:
 *   100 EUR  = 430 tokens
 *   1000 EUR = 4300 tokens
 * i.e. 4.3 tokens per 1 EUR (the two anchors are the same linear rate).
 */
export const EUR_ANCHORS = {
  small: { tokens: 430, price: 100 },
  large: { tokens: 4300, price: 1000 },
} as const;

const EUR_TOKENS_PER_EUR = EUR_ANCHORS.large.tokens / EUR_ANCHORS.large.price;

// Fixed EUR prices for specific bundles. They always win over the linear rate.
export const EUR_PRICE_OVERRIDES: Record<number, number> = {
  100: 23, // Your Own Tracker
  200: 46, // Your Own Chef
  350: 82.66,
  [EUR_ANCHORS.small.tokens]: EUR_ANCHORS.small.price,
  [EUR_ANCHORS.large.tokens]: EUR_ANCHORS.large.price,
  5200: 1224.92,
  10000: 2384.62,
};

const roundMoney = (value: number): number => Math.round(value * 100) / 100;

// How many tokens one unit of the given currency buys.
const getTokensPerCurrencyUnit = (currency: Currency): number => {
  if (currency === "EUR") return EUR_TOKENS_PER_EUR;
  if (currency === "GBP") return 1 / GENERATIONS_PRICE;
  // GENERATIONS_PRICE is in GBP; convert through the EUR-based rate table.
  const pricePerToken =
    (GENERATIONS_PRICE / currenciesRate["GBP"]) * currenciesRate[currency];
  return 1 / pricePerToken;
};

export const getTokenPrice = (tokens: number, currency: Currency): number => {
  if (!Number.isFinite(tokens) || tokens <= 0) return 0;
  if (currency === "EUR" && EUR_PRICE_OVERRIDES[tokens] !== undefined) {
    return EUR_PRICE_OVERRIDES[tokens];
  }
  return roundMoney(tokens / getTokensPerCurrencyUnit(currency));
};

// Whole tokens that fit into the given amount (never charges more than entered).
export const getTokensForAmount = (amount: number, currency: Currency): number => {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  if (currency === "EUR") {
    // An amount that equals a fixed bundle price buys exactly that bundle
    const bundle = Object.entries(EUR_PRICE_OVERRIDES).find(([, price]) => price === amount);
    if (bundle) return Number(bundle[0]);
  }
  // toFixed guards against float noise such as 4299.999999999
  return Math.floor(Number((amount * getTokensPerCurrencyUnit(currency)).toFixed(6)));
};
