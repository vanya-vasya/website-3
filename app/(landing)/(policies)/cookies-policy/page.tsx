import { PolicyHeading, PolicyLayout, PolicyText } from "@/components/policy-layout";

const cookieRows = [
  {
    name: "yum-mi-cookie-consent",
    provider: "Yum-mi",
    purpose: "Stores your choice to accept or reject optional analytics cookies",
    category: "Strictly necessary",
    duration: "6 months",
  },
  {
    name: "__session",
    provider: "Clerk",
    purpose: "Keeps you signed in",
    category: "Strictly necessary",
    duration: "For the signed-in session",
  },
  {
    name: "__client_uat",
    provider: "Clerk",
    purpose: "Detects whether a Clerk sign-in exists on this browser",
    category: "Strictly necessary",
    duration: "Up to 1 year",
  },
  {
    name: "_ga",
    provider: "Google",
    purpose: "Distinguishes users for Google Analytics",
    category: "Optional analytics",
    duration: "2 years",
  },
  {
    name: "_ga_DYY23NK5V1",
    provider: "Google",
    purpose: "Stores Google Analytics session state for this site",
    category: "Optional analytics",
    duration: "2 years",
  },
];

const CookiesPolicy = () => {
  return (
    <PolicyLayout
      title="Cookies Policy"
      lede="This Cookies Policy explains the cookies Yum-mi uses and how you can control them."
    >
      <PolicyText>
        At yum-mi.com, we use cookies to operate the site and, if you allow it, to measure how the
        site is used. This policy explains what cookies are, how we use them, and your choices.
      </PolicyText>

      <PolicyHeading>Consent</PolicyHeading>
      <PolicyText>
        We use strictly necessary cookies to provide services you request. Optional analytics
        cookies are enabled only after you give consent. We do not use advertising or targeting
        cookies. You can refuse optional cookies without losing access to the core service.
      </PolicyText>

      <PolicyHeading>What Are Cookies?</PolicyHeading>
      <PolicyText>
        Cookies are small text files that are placed on your device when you visit a website. They
        help us recognize your device and store information about your preferences or past actions
        on our site.
      </PolicyText>

      <PolicyHeading>Types of Cookies We Use</PolicyHeading>
      <PolicyText>We use the following types of cookies on yum-mi.com:</PolicyText>
      <PolicyText>
        <strong>Strictly necessary cookies:</strong> These cookies are required for sign-in, security
        and to remember your cookie choice. The site does not ask for consent before setting them.
      </PolicyText>
      <PolicyText>
        <strong>Optional analytics cookies:</strong> Google Analytics cookies are set only after you
        accept analytics. They help us understand how the site is used. They are not required to
        buy tokens or use the nutrition tools.
      </PolicyText>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-black border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Cookie or technology</th>
              <th className="border border-gray-300 p-2">Provider</th>
              <th className="border border-gray-300 p-2">Purpose</th>
              <th className="border border-gray-300 p-2">Category</th>
              <th className="border border-gray-300 p-2">Duration</th>
            </tr>
          </thead>
          <tbody>
            {cookieRows.map((row) => (
              <tr key={row.name}>
                <td className="border border-gray-300 p-2">{row.name}</td>
                <td className="border border-gray-300 p-2">{row.provider}</td>
                <td className="border border-gray-300 p-2">{row.purpose}</td>
                <td className="border border-gray-300 p-2">{row.category}</td>
                <td className="border border-gray-300 p-2">{row.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PolicyHeading>How We Use Cookies</PolicyHeading>
      <PolicyText>We use cookies to:</PolicyText>
      <PolicyText>Keep the website working, including sign-in and payment pages.</PolicyText>
      <PolicyText>Remember whether you accepted or rejected optional analytics cookies.</PolicyText>
      <PolicyText>
        Measure site usage with Google Analytics, only after you accept optional analytics cookies.
      </PolicyText>

      <PolicyHeading>Your Cookie Choices</PolicyHeading>
      <PolicyText>
        Our cookie controls allow you to accept optional cookies, reject them or choose individual
        categories. You can change your preferences or withdraw consent at any time through “Cookie
        Settings” in the Website footer.
      </PolicyText>
      <PolicyText>
        You can also delete or block cookies through your browser. Blocking strictly necessary
        cookies may prevent functions such as sign-in from working. Refusing optional cookies does
        not prevent purchases or basic use of the service.
      </PolicyText>
    </PolicyLayout>
  );
};

export default CookiesPolicy;
