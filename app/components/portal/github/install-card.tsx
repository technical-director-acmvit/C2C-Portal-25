"use client";

import React from "react";
import PortalButton from "../ui/button";

export default function InstallCard({ installUrl }: { installUrl: string }) {
  return (
    <div className="w-full mx-auto border border-white/10 rounded-2xl p-6 sm:p-8 animate-pop-in">
      <h2
        className="text-2xl sm:text-3xl font-bold"
        style={{ fontFamily: "'Pilat Extended', Arial, sans-serif" }}
      >
        Link your GitHub
      </h2>
      <p className="text-gray-300 mt-3">
        Install the C2C GitHub App and grant access to selected repositories you plan to submit.
      </p>
      <div className="mt-6">
        <a href={installUrl}>
          <PortalButton>Install GitHub App</PortalButton>
        </a>
      </div>
    </div>
  );
}
