"use client";

import { useState, useEffect } from "react";
import { updateRoomDetails } from "@/app/actions/detail";
import PortalButton from "./ui/button";
import Select from "./ui/select";
import Image from "next/image";

interface BlockRoomModalProps {
  isOpen: boolean;
  onSuccess: () => void;
}

const BlockRoomModal = ({ isOpen, onSuccess }: BlockRoomModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    block: "",
    roomNumber: "",
  });

  // field-level validation messages
  const [fieldErrors, setFieldErrors] = useState({
    roomNumber: "",
  });

  // blocks list fetched from API
  const [blocks, setBlocks] = useState<{ label: string; value: string }[]>([]);
  const [blocksLoading, setBlocksLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchBlocks = async () => {
        setBlocksLoading(true);
        try {
          const res = await fetch("/api/blocks");
          if (!res.ok) throw new Error("Failed to load blocks");
          const response = await res.json();
          const data = response.data;
          // handle object structure like {"MH-A": "MH-A", "MH-B": "MH-B"}
          const opts = typeof data === "object" && !Array.isArray(data)
            ? Object.entries(data).map(([key, value]) => ({
                label: value as string,
                value: key,
              }))
            : Array.isArray(data)
            ? data.map((b: { label?: string; name?: string; value?: string } | string) =>
                typeof b === "string"
                  ? { label: b, value: b }
                  : { label: b.label ?? b.name ?? b.value ?? "", value: b.value ?? b.name ?? b.label ?? "" }
              )
            : [];
          setBlocks(opts);
        } catch (e) {
          console.error("Error loading blocks", e);
          setBlocks([]);
        } finally {
          setBlocksLoading(false);
        }
      };
      fetchBlocks();
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: rawValue } = e.target;

    if (name === "roomNumber") {
      const cleaned = rawValue.replace(/[^A-Za-z0-9\s]/g, "").slice(0, 8);
      setFormData((prev) => ({ ...prev, roomNumber: cleaned }));
      if (fieldErrors.roomNumber) {
        setFieldErrors((prev) => ({ ...prev, roomNumber: "" }));
      }
      return;
    }

    // fallback for other inputs
    setFormData((prev) => ({ ...prev, [name]: rawValue }));
  };

  const isFormValid = () => {
    return (
      formData.block !== "" &&
      formData.roomNumber.trim() !== ""
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await updateRoomDetails({
        room_number: formData.roomNumber,
        block: formData.block,
      });

      if (!result.ok) {
        setError(result.error || "Failed to update room details");
        return;
      }

      // Success - call onSuccess to refresh dashboard and close modal
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // Prevent closing if not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 w-screen h-screen z-50 flex items-center justify-center">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      {/* Background image */}
      <Image src="/portal/bg1.svg" alt="" aria-hidden fill className="object-cover opacity-30" />
      
      {/* Modal content */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div
          className="w-full p-6 sm:p-8 rounded-2xl animate-pop-in"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
            backdropFilter: "blur(10px) saturate(120%)",
            boxShadow:
              "0 12px 40px rgba(0,0,0,0.55), 0 6px 24px rgba(72,186,134,0.06) inset, 0 1px 0 rgba(255,255,255,0.02) inset",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <div className="mb-6">
            <h2
              className="text-center font-semibold text-white"
              style={{ 
                fontFamily: "'Pilat Extended', 'Trap', Arial, sans-serif", 
                fontSize: "clamp(20px, 5.5vw, 28px)" 
              }}
            >
              Update Room Details
            </h2>
            <p className="text-center text-gray-300 text-sm mt-2">
              Please provide your block and room number to continue
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-md text-sm mb-4">
              {error}
            </div>
          )}

          {/* Block selector */}
          <label className="block text-sm text-gray-300 mb-2">Block</label>
          <Select
            id="block"
            value={formData.block}
            onChange={(val: string) => setFormData((prev) => ({ ...prev, block: val }))}
            options={blocks}
            placeholder={blocksLoading ? "Loading blocks…" : "Select block"}
            className="mb-4"
          />
          {blocks.length === 0 && !blocksLoading && (
            <div className="text-yellow-300 text-sm mb-4">No blocks available</div>
          )}

          {/* Room number input */}
          <label className="block text-sm text-gray-300 mb-2">Room Number</label>
          <input
            className="w-full bg-[#111213]/60 border border-white/10 rounded-full px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#48BA86]/40 mb-2"
            type="text"
            name="roomNumber"
            value={formData.roomNumber}
            onChange={handleInputChange}
            placeholder="Room Number"
            maxLength={8}
            inputMode="text"
            pattern="[A-Za-z0-9\s]*"
          />
          {fieldErrors.roomNumber && (
            <div className="text-red-300 text-sm mb-4">{fieldErrors.roomNumber}</div>
          )}

          <div className="flex justify-center mt-6">
            <PortalButton
              onClick={handleSubmit}
              disabled={!isFormValid() || loading}
              className={`${isFormValid() && !loading ? "" : "opacity-50 cursor-not-allowed"}`}
            >
              {loading ? "Updating…" : "Update Details"}
            </PortalButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockRoomModal;
