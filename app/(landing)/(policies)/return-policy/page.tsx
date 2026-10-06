import { PolicyHeading, PolicyLayout, PolicyText } from "@/components/policy-layout";
import { COMPANY_EMAIL } from "@/lib/company";

const ReturnPolicy = () => {
  return (
    <PolicyLayout
      title="Refund and Cancellation Policy"
      lede="This policy applies to purchases of Yum-mi tokens from QUICK FIT LTD."
    >
      <PolicyText>This policy applies to purchases of Yum-mi tokens from QUICK FIT LTD.</PolicyText>

      <PolicyHeading>1. Our 14-Day Refund Offer</PolicyHeading>
      <PolicyText>
        You may request a refund for unused purchased tokens within 14 days of purchase. An entirely
        unused package is eligible for a full refund of the price paid. For a partially used
        package, we refund the proportion attributable to its remaining tokens, calculated using the
        price paid and the total number of tokens supplied in that package, including any package
        bonus. Tokens supplied entirely free of charge have no independent cash value.
      </PolicyText>
      <PolicyText>
        Spent tokens are allocated to a purchase before free promotional tokens are treated as used.
        Free tokens are not deducted in a way that reduces the refund of the price you paid for
        unused purchased tokens.
      </PolicyText>
      <PolicyText>
        This refund offer remains available for unused tokens even if you have started using other
        tokens or have validly lost a statutory cancellation right for a particular completed
        service or supplied output.
      </PolicyText>

      <PolicyHeading>2. Failed Generations and Purchase Problems</PolicyHeading>
      <PolicyText>
        Tokens charged for a generation that fails because of a technical problem with our service
        and provides no usable result will be restored. If payment was collected but the purchased
        tokens were not delivered within the stated timeframe, we will correct the issue or provide
        a refund where appropriate.
      </PolicyText>
      <PolicyText>
        Duplicate charges for the same purchase will be refunded. If services or digital content do
        not meet applicable legal requirements, we provide the remedy required by law, which may
        include repeat performance, replacement, a price reduction or a refund.
      </PolicyText>

      <PolicyHeading>3. Statutory Cancellation Rights</PolicyHeading>
      <PolicyText>
        Where applicable, consumers have a 14-day statutory cancellation period starting when the
        contract is concluded. Merely crediting tokens does not automatically remove this right.
      </PolicyText>
      <PolicyText>
        Early performance of services or early supply of digital content, and any effect on
        statutory cancellation rights, require the consents and acknowledgements prescribed by law.
        Any lawful charge for services performed before cancellation will be limited to what
        applicable law permits.
      </PolicyText>
      <PolicyText>
        Our separate refund offer for unused tokens and your rights concerning faulty or
        non-conforming services remain unaffected.
      </PolicyText>

      <PolicyHeading>4. How to Request a Refund or Cancel</PolicyHeading>
      <PolicyText>
        Contact {COMPANY_EMAIL} or use our contact form. Include your Account email, order number
        and purchase date. We may request information reasonably necessary to locate the purchase or
        verify the request. You do not need to give a reason to exercise a statutory cancellation
        right.
      </PolicyText>
      <PolicyText>
        For statutory cancellation, any clear statement communicating your decision to cancel is
        sufficient. You may use the optional model cancellation form below.
      </PolicyText>

      <PolicyHeading>5. Refund Processing</PolicyHeading>
      <PolicyText>
        Refunds are returned to the original payment method unless another method is lawfully
        permitted and agreed with you. Refunded tokens are removed from the Account.
      </PolicyText>
      <PolicyText>
        We make refunds without undue delay and within any applicable legal deadline. For statutory
        cancellation, this is normally no later than 14 calendar days after we are informed of your
        decision to cancel. We initiate other approved refunds within 14 days of approval.
      </PolicyText>
      <PolicyText>
        After initiation, refunds are generally expected to appear within 7 business days, depending
        on the payment provider. This is an estimate of bank processing time, not an extension of a
        statutory refund deadline. We do not impose a refund fee for statutory cancellation.
      </PolicyText>

      <PolicyHeading>6. Consumer Rights</PolicyHeading>
      <PolicyText>
        The 14-day commercial offer does not exclude claims outside that period where applicable law
        provides a remedy. Nothing in this policy restricts your mandatory consumer rights or your
        right to dispute a payment with your card issuer.
      </PolicyText>

      <PolicyHeading>Optional Model Cancellation Form</PolicyHeading>
      <PolicyText>
        To: QUICK FIT LTD, 7 Cresset Rd, London, United Kingdom, E9 7FS; {COMPANY_EMAIL}.
      </PolicyText>
      <PolicyText>
        I/We hereby give notice that I/We cancel my/our contract for the following purchase:
        [DESCRIPTION / ORDER NUMBER].
      </PolicyText>
      <PolicyText>Ordered on: [DATE].</PolicyText>
      <PolicyText>Name of consumer(s): [NAME].</PolicyText>
      <PolicyText>Address of consumer(s): [ADDRESS].</PolicyText>
      <PolicyText>
        Signature of consumer(s), only if this form is submitted on paper: [SIGNATURE].
      </PolicyText>
      <PolicyText>Date: [DATE].</PolicyText>
      <PolicyText>Delete as appropriate.</PolicyText>
    </PolicyLayout>
  );
};

export default ReturnPolicy;
