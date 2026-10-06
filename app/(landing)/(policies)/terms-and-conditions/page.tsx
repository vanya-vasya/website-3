import { PolicyHeading, PolicyLayout, PolicyText } from "@/components/policy-layout";
import { COMPANY_EMAIL, TOKEN_CREDITING_TIMEFRAME } from "@/lib/company";

const TermsAndConditions = () => {
  return (
    <PolicyLayout
      title="Terms and Conditions"
      lede="These Terms and Conditions govern your use of Yum-mi and purchases of its services."
    >
      <PolicyText>
        These Terms and Conditions govern your use of Yum-mi at https://www.yum-mi.com/ and
        purchases of its services. Yum-mi is operated by QUICK FIT LTD, a company registered in
        England and Wales under company number 15995367, with its registered office at 7 Cresset
        Rd, London, United Kingdom, E9 7FS. In these Terms, “we”, “us” and “our” refer to QUICK
        FIT LTD. Contact us at {COMPANY_EMAIL}.
      </PolicyText>
      <PolicyText>
        Creating an Account or browsing the Website does not itself create an obligation to make a
        purchase. Before placing a paid order, you will be asked to accept these Terms and the
        Refund and Cancellation Policy.
      </PolicyText>

      <PolicyHeading>1. Use of Services</PolicyHeading>
      <PolicyHeading>Eligibility</PolicyHeading>
      <PolicyText>
        To use our services, you must be at least 18 years old and capable of entering into a
        binding contract.
      </PolicyText>
      <PolicyHeading>Registration</PolicyHeading>
      <PolicyText>
        You are required to create an account to access our AI generation services. During
        registration, you must provide accurate and complete information. You must take reasonable
        steps to protect your Account credentials and promptly notify {COMPANY_EMAIL} of suspected
        unauthorised access. Your responsibility for unauthorised activity will be determined under
        applicable law; use of your credentials does not automatically make you responsible for
        every transaction.
      </PolicyText>

      <PolicyHeading>2. Services and Tokens</PolicyHeading>
      <PolicyText>
        Yum-mi provides AI-assisted recipe generation, nutritional suggestions and estimates of
        calories and macronutrients from user inputs, including food photographs.
      </PolicyText>
      <PolicyText>
        Tokens are prepaid service credits used to access these features. The token cost of each
        action is displayed before you confirm it. The number of tokens included in a package,
        including package bonuses, and the total price are displayed before purchase.
      </PolicyText>
      <PolicyText>
        Free promotional tokens, where offered, have no cash value. Any promotional conditions are
        disclosed when the offer is made. Purchased tokens do not expire.
      </PolicyText>
      <PolicyText>
        Tokens are made available in your Account {TOKEN_CREDITING_TIMEFRAME}. If payment has been
        collected but tokens have not been credited within that timeframe, contact {COMPANY_EMAIL}{" "}
        for correction or a refund where appropriate.
      </PolicyText>
      <PolicyText>
        If a generation fails because of a technical problem with our service and no usable result
        is provided, any tokens charged for that failed action will be restored. Tokens are charged
        only after a successful generation. If they are not restored automatically, contact{" "}
        {COMPANY_EMAIL} with the relevant transaction or generation details.
      </PolicyText>
      <PolicyText>
        We will not retrospectively increase the token cost of an action you have already
        confirmed. Material changes affecting purchased token balances will be communicated in
        advance and will not remove your mandatory rights.
      </PolicyText>

      <PolicyHeading>AI Output and Food Safety</PolicyHeading>
      <PolicyText>
        Yum-mi provides automated information for general cooking and nutrition purposes. Outputs
        are estimates and may contain errors, including errors in ingredient identification,
        portion sizes, calorie values and nutritional calculations.
      </PolicyText>
      <PolicyText>
        The service does not provide a clinical diagnosis, medical treatment or a substitute for
        advice from a qualified healthcare professional. Check ingredients, product labels and
        preparation instructions yourself, particularly if you have food allergies or other dietary
        restrictions. A photograph alone cannot establish that a meal is free from allergens.
      </PolicyText>
      <PolicyText>
        These explanations do not exclude our obligations to provide the service with reasonable
        care and skill or your rights where the service does not meet applicable legal requirements.
      </PolicyText>

      <PolicyHeading>3. User Conduct</PolicyHeading>
      <PolicyText>
        You agree not to use our services for any unlawful or prohibited activities, including
        violating any applicable laws or regulations, infringing the intellectual property rights of
        others, distributing harmful or malicious software, or engaging in any activity that
        disrupts or interferes with our services.
      </PolicyText>

      <PolicyHeading>4. User Inputs and Generated Outputs</PolicyHeading>
      <PolicyText>
        You retain any rights you hold in the photographs, text and other materials you submit. You
        must have permission to submit those materials.
      </PolicyText>
      <PolicyText>
        You grant us a limited licence to process, store and display your inputs as necessary to
        provide the requested service, subject to our Privacy Policy. This does not grant an
        unrestricted right to publish your inputs or use them for advertising.
      </PolicyText>
      <PolicyText>
        As between you and QUICK FIT LTD, you may use the outputs generated for you to the extent
        permitted by applicable law and any third-party rights. We do not guarantee that
        AI-generated outputs are unique or qualify for copyright protection.
      </PolicyText>

      <PolicyHeading>5. Service Standards</PolicyHeading>
      <PolicyText>
        We will provide our services with reasonable care and skill and comply with applicable
        legal requirements for services and digital content. We cannot guarantee uninterrupted
        availability, but interruptions do not remove our obligations concerning accepted orders or
        purchased tokens.
      </PolicyText>

      <PolicyHeading>6. Liability</PolicyHeading>
      <PolicyText>
        We are responsible for loss or damage that is a foreseeable result of our breach of
        contract or our failure to exercise reasonable care and skill.
      </PolicyText>
      <PolicyText>
        Nothing in these Terms excludes or limits liability for fraud, fraudulent misrepresentation,
        death or personal injury caused by negligence, or any liability that cannot lawfully be
        excluded or limited. Your mandatory consumer rights remain unaffected.
      </PolicyText>

      <PolicyHeading>7. Your Responsibilities</PolicyHeading>
      <PolicyText>
        You must use the service lawfully and respect third-party rights. Any liability for loss
        caused by your conduct is determined under applicable law. Consumers are not subject to an
        unrestricted obligation to reimburse all of our losses, third-party claims or legal costs
        merely because they use the service.
      </PolicyText>

      <PolicyHeading>8. Changes to These Terms</PolicyHeading>
      <PolicyText>
        Updated Terms will be published with their effective date. The version accepted when a paid
        order was placed continues to govern that order.
      </PolicyText>
      <PolicyText>
        We will give reasonable advance notice of material changes affecting an ongoing service or
        purchased token balance, unless an immediate change is required by law or for urgent
        security reasons. Changes will not retrospectively reduce your rights concerning an existing
        purchase.
      </PolicyText>

      <PolicyHeading>9. Governing Law and Disputes</PolicyHeading>
      <PolicyText>
        These Terms are governed by the laws of England and Wales. If you are a consumer, this
        choice does not deprive you of mandatory protection under the law of your country of
        habitual residence where that law applies.
      </PolicyText>
      <PolicyText>
        The courts of England and Wales have non-exclusive jurisdiction. Nothing prevents you from
        bringing proceedings before another court available to you under mandatory consumer law or
        disputing a card transaction with your card issuer.
      </PolicyText>

      <PolicyHeading>10. Orders, Payments and Cancellation</PolicyHeading>
      <PolicyText>
        A contract for a token purchase is formed when payment is successfully confirmed by our
        payment provider and we accept the order by crediting the purchased tokens to your Account.
        Before payment, we display the total price, transaction currency, token quantity, any
        applicable fees or taxes, and the token crediting timeframe.
      </PolicyText>
      <PolicyText>
        Token purchases are one-off payments. We do not charge recurring subscription fees or
        automatically purchase further tokens unless you separately authorise a clearly disclosed
        recurring arrangement.
      </PolicyText>
      <PolicyText>
        Our Refund and Cancellation Policy explains cancellation rights and our 14-day refund offer
        for unused tokens. Crediting tokens to an Account does not, by itself, remove every
        cancellation or refund right concerning unused tokens.
      </PolicyText>
      <PolicyText>
        Where the law requires it, we obtain your express request before performing a service during
        the cancellation period. Any loss of a statutory cancellation right for a service depends on
        the applicable conditions, including full performance and the required acknowledgement. For
        digital content, early supply and any loss of cancellation rights depend on your express
        consent and acknowledgement.
      </PolicyText>
      <PolicyText>
        These rules do not remove our separate refund offer for unused tokens or your rights where
        the service or digital content does not meet applicable legal requirements.
      </PolicyText>

      <PolicyHeading>11. Contact Us</PolicyHeading>
      <PolicyText>
        If you have any questions or concerns about these Terms, please contact us at {COMPANY_EMAIL}.
      </PolicyText>
    </PolicyLayout>
  );
};

export default TermsAndConditions;
