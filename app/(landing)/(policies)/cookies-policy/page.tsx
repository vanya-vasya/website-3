import CTA from "@/components/landing/cta";

const CookiesPolicy = () => {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', backgroundColor: 'white', color: 'black', minHeight: '100vh' }}>
      <section className="page-title" style={{ backgroundColor: 'white', position: 'relative' }}>
        <style dangerouslySetInnerHTML={{__html: `
          .page-title::before, .page-title::after {
            display: none !important;
            content: none !important;
            background: none !important;
            filter: none !important;
          }
          .page-title__shape-1, .page-title__shape-2, .page-title__shape-3 {
            display: none !important;
          }
          .page-title {
            background: white !important;
            position: relative !important;
          }
          .page-title * {
            filter: none !important;
            background-image: none !important;
          }
        `}} />
        <div className="container">
          <div className="page-title__inner" style={{ padding: '60px 0 40px' }}>
            <div className="page-title__title-box">
              <h3 className="page-title__title" style={{ color: 'black', fontSize: '32px', marginBottom: '20px' }}>Cookies Policy</h3>
            </div>
            <p className="page-title__text" style={{ color: 'black' }}>
              This Cookies Policy provides important information about the use
              of cookies on our website. Please read it carefully to understand
              how we use cookies and how you can control them.
            </p>
          </div>
        </div>
      </section>
      <section className="career-page-top" style={{ backgroundColor: 'white' }}>
        <div className="container">
          <div className="career-page-top__inner">
            <div className="career-page-top__single">
              <div className="career-page-top__content-box" style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', maxHeight: '70vh', overflowY: 'auto', padding: '30px' }}>
                <div className="career-page-top__content-box-two">

                  <p className="career-page-top__text-1 pt-8" style={{ color: 'black' }}>
                    At nerbixa.com, we use cookies to enhance your browsing
                    experience, provide personalized services, and analyze our
                    website traffic. This policy explains what cookies are, how
                    we use them, and your choices regarding their usage.
                  </p>
                  <h4 className="career-page-top__title-3" style={{ color: 'black' }}>
                    What Are Cookies?
                  </h4>
                  <p className="career-page-top__text-1" style={{ color: 'black' }}>
                    Cookies are small text files that are placed on your device
                    when you visit a website. They help us recognize your device
                    and store information about your preferences or past actions
                    on our site.
                  </p>
                  <h4 className="career-page-top__title-3" style={{ color: 'black' }}>
                    Types of Cookies We Use
                  </h4>
                  <p className="career-page-top__text-1" style={{ color: 'black' }}>
                    We use the following types of cookies on nerbixa.com:
                  </p>
                  <ul className="career-page-top__points-list list-unstyled pt-4">
                    <li>
                      <div className="career-page-top__points-shape"></div>
                                              <p style={{ color: 'black' }}>
                        <strong>Essential Cookies:</strong> These cookies are
                        necessary for the basic functioning of our website. They
                        enable core features such as security, network
                        management, and accessibility.
                      </p>
                    </li>
                    <li>
                      <div className="career-page-top__points-shape"></div>
                                              <p style={{ color: 'black' }}>
                        <strong>Performance and Analytics Cookies:</strong> We
                        use these cookies to collect information about how you
                        use our website. This helps us understand website
                        performance and improve our services. We use Google
                        Analytics for this purpose.
                      </p>
                    </li>
                    <li>
                      <div className="career-page-top__points-shape"></div>
                                              <p style={{ color: 'black' }}>
                        <strong>Functionality Cookies:</strong> These cookies
                        allow our website to remember choices you make and
                        provide enhanced, more personalized features. For
                        example, they can remember your preferences on our site.
                      </p>
                    </li>
                    <li>
                      <div className="career-page-top__points-shape"></div>
                                              <p style={{ color: 'black' }}>
                        <strong>Advertising and Targeting Cookies:</strong> We
                        may use these cookies to make advertising messages more
                        relevant to you. They perform functions like preventing
                        the same ad from continuously reappearing, ensuring that
                        ads are properly displayed for advertisers, and in some
                        cases selecting advertisements that are based on your
                        interests.
                      </p>
                    </li>
                  </ul>
                  <h4 className="career-page-top__title-3" style={{ color: 'black' }}>
                    Third-Party Cookies
                  </h4>
                  <p className="career-page-top__text-1" style={{ color: 'black' }}>
                    In addition to our own cookies, we use third-party cookies
                    to report usage statistics of the website and deliver
                    advertisements on and through the site. These cookies are
                    provided by third-party services such as Google Analytics,
                    which help us understand and analyze how visitors use our
                    website.
                  </p>
                  <h4 className="career-page-top__title-3" style={{ color: 'black' }}>
                    How We Use Cookies
                  </h4>
                  <p className="career-page-top__text-1" style={{ color: 'black' }}>We use cookies to:</p>
                  <ul className="career-page-top__points-list list-unstyled pt-4">
                    <li>
                      <div className="career-page-top__points-shape"></div>
                        <p style={{ color: 'black' }}>Ensure the website functions properly and securely</p>
                    </li>
                    <li>
                      <div className="career-page-top__points-shape"></div>
                                              <p style={{ color: 'black' }}>
                        Improve your browsing experience by remembering your
                        preferences and settings
                      </p>
                    </li>
                    <li>
                      <div className="career-page-top__points-shape"></div>
                                              <p style={{ color: 'black' }}>
                        Understand how you use our website and identify areas
                        for improvement
                      </p>
                    </li>
                    <li>
                      <div className="career-page-top__points-shape"></div>
                                              <p style={{ color: 'black' }}>
                        Deliver personalized content and advertising that is
                        relevant to your interests
                      </p>
                    </li>
                  </ul>
                  <h4 className="career-page-top__title-3" style={{ color: 'black' }}>
                    Your Choices Regarding Cookies
                  </h4>
                  <p className="career-page-top__text-1" style={{ color: 'black' }}>
                    You have several options for managing cookies on your
                    device. You can:
                  </p>
                  <ul className="career-page-top__points-list list-unstyled pt-4">
                    <li>
                      <div className="career-page-top__points-shape"></div>
                        <p style={{ color: 'black' }}>Set your browser to block or delete cookies</p>
                    </li>
                    <li>
                      <div className="career-page-top__points-shape"></div>
                                              <p style={{ color: 'black' }}>
                        Use opt-out tools provided by third-party services like
                        Google Analytics
                      </p>
                    </li>
                    <li>
                      <div className="career-page-top__points-shape"></div>
                                              <p style={{ color: 'black' }}>
                        Adjust your preferences in our cookie consent manager,
                        if available
                      </p>
                    </li>
                  </ul>
                  <p className="career-page-top__text-1" style={{ color: 'black' }}>
                    Please note that blocking or deleting cookies may affect
                    your ability to use certain features of our website and may
                    impact your experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CookiesPolicy;
