"use client";

import Landing from "./components/landing/landing";
import { signIn } from "next-auth/react";

export default function Page() {
  return (
    <>
      <Landing />
      <button
        onClick={() => signIn('google', { callbackUrl: '/portal' })}
        className="fixed bottom-6 right-6 px-4 py-2 rounded-md bg-[#48BA86] text-black font-semibold shadow-lg hover:opacity-90"
        style={{ zIndex: 50 }}
        aria-label="Apply Now"
      >
        Apply Now
      </button>
    </>
  );
}
