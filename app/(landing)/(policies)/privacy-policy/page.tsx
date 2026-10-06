import { PolicyHeading, PolicyLayout, PolicyText } from "@/components/policy-layout";
import { COMPANY_EMAIL } from "@/lib/company";

const PrivacyPolicy = () => {
  return (
    <PolicyLayout
      title="Privacy Policy"
      lede="This policy explains how QUICK FIT LTD processes personal data when you use Yum-mi."
    >
      <PolicyText>
        Yum-mi is operated by QUICK FIT LTD, company number 15995367, registered at 7 Cresset Rd,
        London, United Kingdom, E9 7FS. QUICK FIT LTD is the controller of the personal data
        described in this Privacy Policy.
      </PolicyText>
      <PolicyText>
        This policy explains how we process personal data when you use our Website, create an
        Account, purchase tokens, upload content, use our AI tools or contact support. For privacy
        enquiries, contact {COMPANY_EMAIL}.
      </PolicyText>
      <PolicyText>
        This policy is an explanation of our processing practices. Browsing the Website does not
        constitute consent to all processing of personal data.
      </PolicyText>

      <PolicyHeading>Information We Collect</PolicyHeading>
      <PolicyText>
        <strong>Personal Information:</strong> When you register on yum-mi.com, we may collect your
        name, email address and the account details needed to provide the service.
      </PolicyText>
      <PolicyText>
        <strong>Usage Information:</strong> We may also collect information on how you interact with
        our website, including IP address, browser type and version, time zone setting, browser
        plug-in types and versions, operating system and platform, and other technology on the
        devices you use to access this website.
      </PolicyText>
      <PolicyText>
        <strong>User Content and Nutrition Information:</strong> We process photographs, prompts and
        other information you submit to generate recipes, nutritional suggestions and food
        estimates. This may include your age, dietary preferences, goals and allergy information
        where you choose to provide them. Only the information needed for the selected feature is
        required.
      </PolicyText>
      <PolicyText>
        <strong>Transactions and Usage:</strong> We process token purchases and balances, usage
        records, payment status and transaction references. Additional payment data is handled
        according to the arrangements described under “Payment Processing” below.
      </PolicyText>

      <PolicyHeading>Payment Processing</PolicyHeading>
      <PolicyText>
        Payments are processed by Secure-Processor on its hosted payment page at
        checkout.secure-processor.com. Secure-Processor collects the card details you enter on that
        page. We receive payment status, amount, currency, order reference and the email address
        used for the order. We do not receive the full card number from that hosted page. Their
        privacy information is shown on the hosted payment page before you pay.
      </PolicyText>

      <PolicyHeading>How We Use Your Information</PolicyHeading>
      <PolicyText>
        <strong>To Provide and Improve Our Services:</strong> We use your information to provide the
        AI generation services you request and to keep the service working.
      </PolicyText>
      <PolicyText>
        <strong>To Communicate with You:</strong> We use your email address to send purchase
        confirmations and service messages. Marketing is sent only where we have a lawful basis, and
        you can unsubscribe from marketing without losing access to purchased services.
      </PolicyText>
      <PolicyText>
        <strong>For Billing and Account Management:</strong> We use purchase and token records to
        credit tokens, show your balance and manage your account.
      </PolicyText>
      <PolicyText>
        <strong>To Ensure Security and Compliance:</strong> We use your information to help maintain
        the security of our website and to comply with legal requirements.
      </PolicyText>

      <PolicyHeading>Legal Bases and Health Information</PolicyHeading>
      <PolicyText>
        We process Account, purchase and generation information where necessary to perform our
        contract with you. We process records required by law on the basis of legal obligation. We
        rely on legitimate interests for proportionate fraud prevention, security and
        troubleshooting; our interests are protecting customers and maintaining a reliable service,
        subject to your rights.
      </PolicyText>
      <PolicyText>
        We obtain consent for optional cookies and marketing where required. You can unsubscribe
        from marketing without losing access to purchased services.
      </PolicyText>
      <PolicyText>
        Information revealing your health, such as allergy information, receives additional
        protection. Where we rely on your explicit consent, we obtain it separately before
        processing that information to personalise your requested nutrition features. You can
        withdraw it at any time by contacting {COMPANY_EMAIL}. Withdrawal stops the consent-based
        processing and may affect features that depend on that information, but does not affect the
        lawfulness of earlier processing.
      </PolicyText>

      <PolicyHeading>How We Share Your Information</PolicyHeading>
      <PolicyText>
        <strong>Service Providers:</strong> Our providers include n8n (AI generation workflows),
        OpenAI (where an image or code feature is invoked), Clerk (authentication), Vercel
        (hosting), Neon (database hosting), Google (optional analytics, only after consent) and
        Secure-Processor (card payments). We send each provider only the data necessary for its
        function.
      </PolicyText>
      <PolicyText>
        AI providers receive the prompts, food photographs and selected profile information you
        submit to generate the results you request. Their retention and use of this information are
        described below.
      </PolicyText>
      <PolicyText>
        Clerk, Inc. provides sign-in. Its privacy information is at https://clerk.com/privacy.
        OpenAI’s privacy information is at https://openai.com/policies/privacy-policy. Google’s
        privacy information is at https://policies.google.com/privacy. Vercel’s privacy information
        is at https://vercel.com/legal/privacy-policy. Neon’s privacy information is at
        https://neon.com/privacy-policy.
      </PolicyText>
      <PolicyText>
        <strong>Legal Requirements:</strong> We may disclose your information if required to do so
        by law or in response to valid requests by public authorities.
      </PolicyText>
      <PolicyText>
        <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of all
        or a portion of our assets, your information may be transferred to the acquiring entity.
      </PolicyText>

      <PolicyHeading>AI Processing and Model Training</PolicyHeading>
      <PolicyText>
        QUICK FIT LTD does not use your inputs or outputs to train its own models. We send prompts,
        food photographs and the profile details you include to n8n, and to OpenAI where an image or
        code feature is invoked, so those providers can return the generation you requested. We do
        not authorise those providers to use that content to train their general models. Any
        abuse-monitoring retention is the period described in the provider’s current privacy notice.
        You can ask {COMPANY_EMAIL} for the current retention arrangement.
      </PolicyText>
      <PolicyText>
        Providing content for a generation does not grant an unrestricted right to use health
        information for unrelated purposes.
      </PolicyText>

      <PolicyHeading>Automated Processing</PolicyHeading>
      <PolicyText>
        The tools produce recipe suggestions and nutritional estimates for you to review. They do
        not decide credit, employment, insurance, or access to an essential service.
      </PolicyText>

      <PolicyHeading>International Transfers</PolicyHeading>
      <PolicyText>
        Account data, authentication data, payment status and the prompts or photographs needed for
        a generation may be processed outside the UK, including in the United States, by Clerk,
        OpenAI, Google, Vercel, Neon and n8n, and by Secure-Processor in the country where it hosts
        checkout.
      </PolicyText>
      <PolicyText>
        Where a transfer safeguard is required, we use the mechanism that applies to that provider
        under UK GDPR or, where EU GDPR applies, under EU GDPR. You can obtain information about
        these safeguards by contacting {COMPANY_EMAIL}. If you are in the EEA, you can use the same
        address to ask about our EU GDPR arrangements, including any EU representative we are
        required to appoint.
      </PolicyText>

      <PolicyHeading>Data Security</PolicyHeading>
      <PolicyText>
        We implement appropriate technical and organizational measures to protect your personal
        information against accidental or unlawful destruction, loss, alteration, unauthorized
        disclosure, or access.
      </PolicyText>

      <PolicyHeading>Data Retention</PolicyHeading>
      <PolicyText>
        We retain Account information for as long as the account is open and for as long afterwards
        as needed to handle a dispute or legal claim. We retain uploaded photographs, prompts and
        generated results for as long as the account is open so we can provide the result you
        requested, unless you ask us to delete them sooner. We retain nutrition profile and health
        information for the same period, and we stop using it for personalisation when you withdraw
        consent. We retain purchase and accounting records for 6 years from the end of the financial
        year of the transaction, to meet UK company record-keeping duties. We retain technical logs
        for as long as needed to secure the service and investigate abuse, and support
        correspondence for as long as needed to resolve the request and any follow-up.
      </PolicyText>
      <PolicyText>
        We delete or anonymise information after the applicable retention period unless further
        retention is required by law or necessary for an ongoing dispute. AI-provider retention is
        the abuse-monitoring period stated in that provider’s current privacy notice.
      </PolicyText>

      <PolicyHeading>Your Rights</PolicyHeading>
      <PolicyText>
        Subject to applicable law and the relevant conditions, you may request access, correction,
        deletion, restriction of processing or portability of your personal data.
      </PolicyText>
      <PolicyText>
        You may object to processing based on legitimate interests and to direct marketing. Where we
        rely on consent, you may withdraw it at any time.
      </PolicyText>
      <PolicyText>
        Contact {COMPANY_EMAIL} to exercise your rights. Requests are normally free of charge and
        are handled within the applicable statutory period, normally one month under the UK GDPR or
        EU GDPR. We will explain any lawful extension or permitted pause where required.
      </PolicyText>
      <PolicyText>
        You may complain to the UK Information Commissioner&apos;s Office at
        https://ico.org.uk/make-a-complaint/ or another competent supervisory authority.
      </PolicyText>

      <PolicyHeading>Children</PolicyHeading>
      <PolicyText>
        Yum-mi is intended for adults aged 18 and over. If you believe that a child has provided
        personal data through our service, contact {COMPANY_EMAIL} so that we can investigate and
        take appropriate action.
      </PolicyText>

      <PolicyHeading>Changes to This Privacy Policy</PolicyHeading>
      <PolicyText>
        We may update this Privacy Policy from time to time. When we do, we will post the updated
        policy on this page and update the date at the top of the policy.
      </PolicyText>

      <PolicyHeading>Contact Us</PolicyHeading>
      <PolicyText>
        If you have any questions or concerns about this Privacy Policy, please contact us at{" "}
        {COMPANY_EMAIL}.
      </PolicyText>
    </PolicyLayout>
  );
};

export default PrivacyPolicy;
