import { PolicyHeading, PolicyLayout, PolicyText } from "@/components/policy-layout";
import {
  COMPANY_EMAIL,
  TOKEN_CREDITING_SENTENCE,
  TOKEN_CREDITING_TIMEFRAME,
} from "@/lib/company";

const PaymentPolicy = () => {
  return (
    <PolicyLayout
      title="Payment Policy"
      lede="How Yum-mi takes payment for token purchases."
    >
      <PolicyText>
        Payments for Yum-mi are collected by QUICK FIT LTD, company number 15995367, registered at
        7 Cresset Rd, London, United Kingdom, E9 7FS.
      </PolicyText>
      <PolicyText>
        We accept Visa and Mastercard, processed through Secure-Processor’s hosted payment page.
        The Website offers price display in GBP, EUR and USD. Your actual transaction currency and
        final amount are shown at checkout before payment.
      </PolicyText>
      <PolicyText>
        Tokens are purchased through one-off payments. No recurring subscription or automatic top-up
        is created unless separately offered, clearly disclosed and expressly authorised by you.
      </PolicyText>
      <PolicyText>
        The checkout shows the package quantity, total price, any applicable taxes or fees, and the
        token crediting timeframe. The price shown is the amount charged. Yum-mi does not add a
        separate checkout fee. Purchased tokens are credited {TOKEN_CREDITING_TIMEFRAME}.{" "}
        {TOKEN_CREDITING_SENTENCE}
      </PolicyText>
      <PolicyText>
        Payments are authorised and captured at checkout as a single card payment. We do not place a
        separate authorisation hold. The name shown on your card statement is the billing descriptor
        registered for QUICK FIT LTD with Secure-Processor. We provide a purchase confirmation
        showing the amount, currency and tokens purchased.
      </PolicyText>
      <PolicyText>
        If a payment status is unclear, contact {COMPANY_EMAIL} before repeating payment. Refunds
        and cancellations are handled under our Refund and Cancellation Policy.
      </PolicyText>
      <PolicyHeading>Contact</PolicyHeading>
      <PolicyText>Payment questions: {COMPANY_EMAIL}.</PolicyText>
    </PolicyLayout>
  );
};

export default PaymentPolicy;
