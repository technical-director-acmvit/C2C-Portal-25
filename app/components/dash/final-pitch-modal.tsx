"use client";

import React from "react";

interface FinalPitchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FinalPitchModal: React.FC<FinalPitchModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Card */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div
          className="w-full max-w-sm sm:max-w-md md:max-w-lg p-6 sm:p-8 rounded-2xl animate-pop-in"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
            backdropFilter: "blur(10px) saturate(120%)",
            boxShadow:
              "0 12px 40px rgba(0,0,0,0.55), 0 6px 24px rgba(72,186,134,0.06) inset, 0 1px 0 rgba(255,255,255,0.02) inset",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <h2
            className="text-white text-center mb-3"
            style={{
              fontFamily: "'Pilat Extended', Arial, sans-serif",
              fontWeight: 700,
              letterSpacing: "0.5px",
              fontSize: "clamp(18px, 5vw, 24px)",
            }}
          >
            Final Pitches
          </h2>

          <p
            className="text-gray-200 text-center mb-6 text-sm sm:text-base"
            style={{
              fontFamily: "'Pilat Extended', Arial, sans-serif",
              fontWeight: 500,
              lineHeight: 1.6,
            }}
          >
            Please come to Ambedkar Auditorium at 10:30 PM sharp for your final pitches.
          </p>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-transparent border border-white/20 text-white hover:bg-white/10 transition-colors"
              style={{ fontFamily: "'Pilat Extended', Arial, sans-serif" }}
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalPitchModal;

