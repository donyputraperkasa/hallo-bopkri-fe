"use client";

import { useState } from "react";
import { CreatorLicense } from "./creator-license";
import { CreatorSignature } from "./creator-signature";

export function CreatorFooter() {
  const [isLicenseOpen, setIsLicenseOpen] = useState(false);

  return (
    <>
      <div className="border-t border-[#d9e3f2] px-5 py-6">
        <div className="mx-auto w-fit max-w-full">
          <CreatorSignature onOpenLicense={() => setIsLicenseOpen(true)} />
        </div>
      </div>
      <CreatorLicense
        open={isLicenseOpen}
        onClose={() => setIsLicenseOpen(false)}
      />
    </>
  );
}
