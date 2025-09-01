"use client";

import React, { useCallback, useRef } from "react";
import PortalButton from './ui/button';

interface LeaveTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  teamName?: string;
  isProcessing: boolean;
}

const LeaveTeamModal: React.FC<LeaveTeamModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  teamName,
  isProcessing,
}) => {
  const lastClickRef = useRef<number>(0);

  const handleConfirm = useCallback(() => {
    if (isProcessing) return;
    const now = Date.now();
    if (now - lastClickRef.current < 700) return;
    lastClickRef.current = now;
    onConfirm();
  }, [isProcessing, onConfirm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={isProcessing ? undefined : onClose}
      />
      
      {/* Centered card (match Join/Create) */}
      <div className="flex items-center justify-center h-full px-4">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg p-4 sm:p-6 md:p-8 rounded-2xl" style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))',
          backdropFilter: 'blur(10px) saturate(120%)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.55), 0 6px 24px rgba(72,186,134,0.06) inset, 0 1px 0 rgba(255,255,255,0.02) inset',
          border: '1px solid rgba(255,255,255,0.10)'
        }}>
          <h2
            className="text-white text-center mb-4 text-lg sm:text-xl"
            style={{
              fontFamily: "'Pilat Extended', Arial, sans-serif",
              fontWeight: "700",
              letterSpacing: "1px",
            }}
          >
            Leave Team
          </h2>

          <p
            className="text-gray-300 text-center mb-6 text-sm sm:text-base"
            style={{
              fontFamily: "'Pilat Extended', Arial, sans-serif",
              fontWeight: "400",
              lineHeight: "1.5",
            }}
          >
            Are you sure you want to leave {teamName && (
              <span className="text-white font-semibold">&quot;{teamName}&quot;</span>
            )}? This action cannot be undone.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <PortalButton
              onClick={onClose}
              disabled={isProcessing}
              // force smaller responsive text so PortalButton default doesn't dominate
              className={`w-full sm:w-auto px-4 py-2 !text-[15px] sm:!text-[16px] md:!text-[16px] bg-transparent border border-white/20 text-white ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Cancel
            </PortalButton>
            <PortalButton
              onClick={handleConfirm}
              disabled={isProcessing}
              className={`w-full sm:w-auto px-4 py-2 !text-[15px] sm:!text-[16px] md:!text-[16px] ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isProcessing ? 'Leaving…' : 'Leave Team'}
            </PortalButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveTeamModal;
