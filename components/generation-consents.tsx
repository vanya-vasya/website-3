"use client";

import Link from "next/link";

type GenerationConsentsProps = {
  serviceAccepted: boolean;
  healthAccepted: boolean;
  onServiceChange: (accepted: boolean) => void;
  onHealthChange: (accepted: boolean) => void;
  showErrors: boolean;
};

const labelClass = "text-sm text-black leading-6";

export const GenerationConsents = ({
  serviceAccepted,
  healthAccepted,
  onServiceChange,
  onHealthChange,
  showErrors,
}: GenerationConsentsProps) => {
  return (
    <div className="w-full max-w-3xl space-y-4 text-left">
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={serviceAccepted}
          onChange={(event) => onServiceChange(event.target.checked)}
          className="mt-1"
          aria-required="true"
        />
        <span className={labelClass}>
          I expressly request that the service begins before the end of any applicable 14-day
          cancellation period. I acknowledge that I will lose my statutory cancellation right for
          that service once it has been fully performed.
        </span>
      </label>
      {showErrors && !serviceAccepted && (
        <p className="text-sm text-red-600">Confirm this before the generation starts.</p>
      )}

      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={healthAccepted}
          onChange={(event) => onHealthChange(event.target.checked)}
          className="mt-1"
          aria-required="true"
        />
        <span className={labelClass}>
          I explicitly consent to QUICK FIT LTD processing the health information I choose to
          provide, such as allergy information, to personalise my requested nutrition features,
          including through the AI providers identified in the{" "}
          <Link href="/privacy-policy" className="underline" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </Link>
          . I understand that I can withdraw this consent at any time by contacting info@yum-mi.com.
        </span>
      </label>
      {showErrors && !healthAccepted && (
        <p className="text-sm text-red-600">
          This consent is separate from the Terms and is required before we process health
          information for this feature.
        </p>
      )}
    </div>
  );
};
