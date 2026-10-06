export const COMPANY_LEGAL_NAME = "QUICK FIT LTD";
export const COMPANY_NUMBER = "15995367";
export const COMPANY_ADDRESS = "7 Cresset Rd, London, United Kingdom, E9 7FS";
export const COMPANY_EMAIL = "info@yum-mi.com";
export const COMPANY_SITE = "https://www.yum-mi.com";
export const POLICIES_UPDATED = "6 October 2026";

export const TOKEN_CREDITING_TIMEFRAME =
  "after successful payment confirmation, normally within a few minutes";

export const TOKEN_CREDITING_SENTENCE = `Purchased tokens are credited ${TOKEN_CREDITING_TIMEFRAME}.`;

export const purchaseConfirmationText = `Hi there,

This email confirms your token purchase from QUICK FIT LTD, company number 15995367, registered at 7 Cresset Rd, London, United Kingdom, E9 7FS.

The attached receipt shows the amount, currency and tokens purchased. ${TOKEN_CREDITING_SENTENCE}

Before payment you agreed to the Terms and Conditions and the Refund and Cancellation Policy. The version you accepted governs this order:
${COMPANY_SITE}/terms-and-conditions
${COMPANY_SITE}/return-policy

Please keep this email as your copy of the purchase confirmation.

If a payment status is unclear, contact ${COMPANY_EMAIL} before repeating payment.

The Yum-mi Team
yum-mi.com
${COMPANY_EMAIL}`;
