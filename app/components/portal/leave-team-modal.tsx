"use client";

import React from "react";

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-lg p-8 max-w-md mx-4">
        <h2
          className="text-white text-center mb-6"
          style={{
            fontSize: "24px",
            fontFamily: "'Pilat Extended', Arial, sans-serif",
            fontWeight: "700",
            letterSpacing: "1px",
          }}
        >
          Leave Team
        </h2>
        
        <p
          className="text-gray-300 text-center mb-8"
          style={{
            fontSize: "16px",
            fontFamily: "'Pilat Extended', Arial, sans-serif",
            fontWeight: "400",
            lineHeight: "1.5",
          }}
        >
          Are you sure you want to leave{" "}
          {teamName && (
            <span className="text-white font-semibold">&quot;{teamName}&quot;</span>
          )}? This action cannot be undone.
        </p>
        
        <div className="flex gap-4 justify-center">
          <button
            className="px-6 py-3 rounded-lg text-white cursor-pointer border-2 border-white/30 bg-transparent hover:bg-white/10 transition-colors"
            style={{
              fontSize: "16px",
              fontFamily: "'Pilat Extended', Arial, sans-serif",
              fontWeight: "400",
            }}
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </button>
          
          <button
            className="px-6 py-3 rounded-lg text-white cursor-pointer"
            style={{
              backgroundColor: "#ef4444",
              fontSize: "16px",
              fontFamily: "'Pilat Extended', Arial, sans-serif",
              fontWeight: "400",
            }}
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? "Leaving…" : "Leave Team"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveTeamModal;
