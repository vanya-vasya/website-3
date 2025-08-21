import CTA from "@/components/landing/cta";

const ReturnPolicy = () => {
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
              <h3 className="page-title__title" style={{ color: 'black', fontSize: '32px', marginBottom: '20px' }}>Return Policy</h3>
            </div>
            <p className="page-title__text" style={{ color: 'black' }}>
              This Return Policy includes important information about the return
              process for our services. Please read it carefully.
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
                    At nerbixa.com, we strive to provide high-quality AI
                    generation services that meet your needs. However, if you
                    are not satisfied with your purchase, we offer a return
                    policy for unused generations. This policy is designed to
                    ensure that you have a positive experience with our platform
                    and feel confident in your purchases.
                  </p>
                  <p className="career-page-top__text-1 pt-4">
                    You may return any unused generations within 14 days of the
                    purchase date for a full refund. This return policy applies
                    to all generation packages available on our website. Please
                    read the following conditions carefully to understand the
                    requirements for returning unused generations.
                  </p>
                  <h4 className="career-page-top__title-3" style={{ color: 'black' }}>
                    Conditions for Returns
                  </h4>
                  <ul className="career-page-top__points-list list-unstyled">
                    <li>
                      <div className="career-page-top__points-shape"></div>
                                              <p style={{ color: 'black' }}>
                        <strong>Unused Generations:</strong> Only generations
                        that have not been used are eligible for return. Once a
                        generation has been used, it cannot be returned or
                        refunded. We define &quot;used&quot; generations as
                        those that have been utilized in any of our AI
                        generation services, including but not limited to text
                        generation, image creation, or any other AI tool
                        provided on nerbixa.com.
                      </p>
                    </li>
                    <li>
                      <div className="career-page-top__points-shape"></div>
                                              <p style={{ color: 'black' }}>
                        <strong>14-Day Return Period:</strong> To be eligible
                        for a return, you must request the return within 14 days
                        of the purchase date. This 14-day period begins on the
                        date you complete the purchase transaction. Requests
                        made after this period will not be considered for a
                        refund.
                      </p>
                    </li>
                    <li>
                      <div className="career-page-top__points-shape"></div>
                                              <p style={{ color: 'black' }}>
                        <strong>Proof of Purchase:</strong> You must provide
                        proof of purchase when requesting a return. This can be
                        in the form of an order confirmation email, receipt, or
                        any other documentation that verifies the purchase date
                        and details of the generation package purchased.
                      </p>
                    </li>
                  </ul>
                  <h4 className="career-page-top__title-3" style={{ color: 'black' }}>
                    How to Request a Return
                  </h4>
                  <p className="career-page-top__text-1" style={{ color: 'black' }}>
                    To initiate a return, please contact our support team
                    through our contact form on the website or by sending an
                    email to support@nerbixa.com. In your message, include the
                    following information:
                  </p>
                  <ul className="career-page-top__points-list list-unstyled pt-4">
                    <li>
                      <div className="career-page-top__points-shape"></div>
                        <p style={{ color: 'black' }}>Your full name and contact information</p>
                    </li>
                    <li>
                      <div className="career-page-top__points-shape"></div>
                        <p style={{ color: 'black' }}>Order number and date of purchase</p>
                    </li>
                    <li>
                      <div className="career-page-top__points-shape"></div>
                        <p style={{ color: 'black' }}>The reason for the return request</p>
                    </li>
                    <li>
                      <div className="career-page-top__points-shape"></div>
                                              <p style={{ color: 'black' }}>
                        Proof of purchase (e.g., order confirmation email or
                        receipt)
                      </p>
                    </li>
                  </ul>
                  <p className="career-page-top__text-1 pt-4">
                    Once we receive your return request, our support team will
                    review the information provided and process your request. If
                    your return is approved, we will issue a refund to your
                    original method of payment. Please allow up to 7 business
                    days for the refund to appear in your account, depending on
                    your payment provider.
                  </p>
                  <p className="career-page-top__text-1" style={{ color: 'black' }}>
                    If additional information is required to process your
                    return, our support team will contact you for further
                    details. We are committed to resolving return requests as
                    efficiently as possible to ensure your satisfaction.
                  </p>
                  <h4 className="career-page-top__title-3" style={{ color: 'black' }}>
                    Non-Refundable Generations
                  </h4>
                  <p className="career-page-top__text-1" style={{ color: 'black' }}>
                    Please note that any generations that have been used are
                    non-refundable. This policy is in place to maintain the
                    integrity of our service and ensure fair usage. We encourage
                    you to evaluate your needs and usage carefully before making
                    a purchase.
                  </p>
                  <h4 className="career-page-top__title-3" style={{ color: 'black' }}>Contact Us</h4>
                  <p className="career-page-top__text-1" style={{ color: 'black' }}>
                    If you have any questions or need assistance with your
                    return, please contact our support team at
                    support@nerbixa.com. Our team is available to help you with
                    any issues or concerns you may have regarding our return
                    policy or any other aspect of our services.
                  </p>
                  <p className="career-page-top__text-1 pt-4">
                    We value your feedback and are dedicated to providing you
                    with the best possible service. Your satisfaction is our
                    priority, and we are here to assist you in any way we can.
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

export default ReturnPolicy;
