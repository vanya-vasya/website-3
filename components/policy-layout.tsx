import { POLICIES_UPDATED } from "@/lib/company";
import { ReactNode } from "react";

const titleStyles = `
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
`;

const fontFamily =
  'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

type PolicyLayoutProps = {
  title: string;
  lede: string;
  children: ReactNode;
};

export const PolicyLayout = ({ title, lede, children }: PolicyLayoutProps) => {
  return (
    <div
      style={{
        fontFamily,
        backgroundColor: "white",
        color: "black",
        minHeight: "100vh",
      }}
    >
      <section className="page-title" style={{ backgroundColor: "white", position: "relative" }}>
        <style dangerouslySetInnerHTML={{ __html: titleStyles }} />
        <div className="container">
          <div className="page-title__inner" style={{ padding: "60px 0 40px" }}>
            <div className="page-title__title-box">
              <h1
                className="page-title__title"
                style={{ color: "black", fontSize: "32px", marginBottom: "20px" }}
              >
                {title}
              </h1>
            </div>
            <p className="page-title__text" style={{ color: "black" }}>
              Last updated: {POLICIES_UPDATED}
            </p>
            <p className="page-title__text" style={{ color: "black", marginTop: "12px" }}>
              {lede}
            </p>
          </div>
        </div>
      </section>
      <section className="career-page-top" style={{ backgroundColor: "white" }}>
        <div className="container">
          <div className="career-page-top__inner">
            <div className="career-page-top__single">
              <div
                className="career-page-top__content-box"
                style={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  maxHeight: "70vh",
                  overflowY: "auto",
                  padding: "30px",
                }}
              >
                <div className="career-page-top__content-box-two space-y-4">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export const PolicyHeading = ({ children }: { children: ReactNode }) => {
  return (
    <h2 className="career-page-top__title-3" style={{ color: "black" }}>
      {children}
    </h2>
  );
};

export const PolicyText = ({ children }: { children: ReactNode }) => {
  return (
    <p className="career-page-top__text-1" style={{ color: "black" }}>
      {children}
    </p>
  );
};
