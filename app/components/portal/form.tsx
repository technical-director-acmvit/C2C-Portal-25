"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { getTracks, submitTeamSubmission, type Track } from "../../actions/submission";
import BackChevron from "./ui/back-chevron";
import PortalButton from "./ui/button";
import { usePortalStore } from "@/app/stores/portal";

interface FormProps {
  onBack?: () => void;
  requirePPT?: boolean; // when true, ppt file is mandatory
  embedded?: boolean;
  onClose?: () => void; // optional close callback (e.g. to close embedded form)
}

const Form = ({ onBack, requirePPT = false, embedded = false, onClose }: FormProps) => {
  const [formData, setFormData] = useState({
    track_id: "",
    // github_url: "",
    // figma_url: "",
    other: "",
    // ppt_url: "",
    description: "",
    title: "",
  });
  // add file state
  const [pptFile, setPptFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const refreshDashboard = usePortalStore((s) => s.refreshDashboard);
  // const [acknowledgeLock, setAcknowledgeLock] = useState(false);
  const [showMobileHint, setShowMobileHint] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const list = await getTracks();
        if (mounted) setTracks(list);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "Failed to load tracks");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const valid = Boolean(
    formData.track_id && formData.track_id !== "" &&
    formData.title && formData.title !== "" &&
    // when PDF is required ensure a File is present
    (!requirePPT || Boolean(pptFile)),
  );

  // Add a single derived disabled flag to drive both attribute and styles
  // const isDisabled = !valid || submitting || !acknowledgeLock;
  const isDisabled = !valid || submitting;


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    setPptFile(f ?? null);
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    setPptFile(f ?? null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const removeFile = () => {
    setPptFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!valid) {
      setError("Please fill all required fields.");
      return;
    }
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const selectedTrackId = (() => {
        if (!formData.track_id) return null;
        // exact match to id first
        const byId = tracks.find((t) => t.id === formData.track_id);
        if (byId) return byId.id;
        // fallback: maybe the value is actually the title
        const byTitle = tracks.find((t) => t.title === formData.track_id);
        if (byTitle) return byTitle.id;
        // otherwise just send the raw value (best-effort)
        return formData.track_id;
      })();
      // Require a resolvable track id (must be a non-empty string)
      // if (!selectedTrackId) {
      //   throw new Error('Unable to resolve selected track. Please choose a track from the list.');
      // }

      await submitTeamSubmission({
        ppt_file: pptFile ?? undefined,
        description: formData.description || null,
        github_url: "",
        figma_url: "",
        other: "",
        track_id: selectedTrackId,
        title: formData.title,
      });
      await refreshDashboard();
      if (onClose) {
        onClose();
      } else {
        setSuccess("Submission saved");
      }
      // Optionally clear file input on success
      setPptFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  const innerForm = (
    <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 sm:p-8 w-full max-w-md border border-gray-600 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        {onBack && <BackChevron onClick={onBack} />}
        <h1
          className="text-white text-2xl sm:text-3xl"
          style={{ fontFamily: "'Pilat Extended', Arial, sans-serif", fontWeight: "700" }}
        >
          Idea  Submission
        </h1>
      </div>
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-md text-sm mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-2 rounded-md text-sm mb-4">
          {success}
        </div>
      )}

      <div className="space-y-4">
        {/* Track Dropdown */}
        <div>
          <select
            name="track_id"
            value={formData.track_id}
            onChange={handleInputChange}
            className="w-full p-3 rounded-lg bg-gray-700/80 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-[#5EBF94]"
            style={{
              fontFamily: "'Pilat Extended', Arial, sans-serif",
              fontSize: "14px",
            }}
            disabled={loading}
          >
            <option value="" className="text-gray-400">
              {loading ? "Loading tracks…" : "Select a Track"}
            </option>
            {tracks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Title"
            className="w-full p-3 rounded-lg bg-gray-700/80 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-[#5EBF94]"
            style={{ fontFamily: "'Pilat Extended', Arial, sans-serif", fontSize: "14px" }}
          />
        </div>

        {/* PDF File input (required or optional based on requirePPT) */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <label className="block text-sm text-gray-300">
              PDF Upload
            </label>
            <a
              href="/C2C_Template.pptx"
              download="Code2Create_IdeaSubmission_Template.pptx"
              onClick={(e) => {
                try {
                  const isMobile = typeof window !== 'undefined' &&
                    (window.matchMedia('(hover: none)').matches || window.matchMedia('(pointer: coarse)').matches);
                  if (isMobile) {
                    e.preventDefault();
                    setShowMobileHint(true);
                    // Show hint briefly, then trigger download
                    window.setTimeout(() => {
                      setShowMobileHint(false);
                      const link = document.createElement('a');
                      link.href = '/C2C_Template.pptx';
                      link.download = 'Code2Create_IdeaSubmission_Template.pptx';
                      document.body.appendChild(link);
                      link.click();
                      // Clean up next tick
                      window.setTimeout(() => {
                        document.body.removeChild(link);
                      }, 0);
                    }, 900);
                  }
                } catch (_) {
                  // no-op; if detection fails, let default anchor behavior proceed
                }
              }}
              className="relative inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-[#5EBF94]/40 bg-gradient-to-r from-[#5EBF94]/15 to-transparent text-xs sm:text-sm text-[#5EBF94] hover:bg-[#5EBF94]/20 hover:border-[#5EBF94]/60 hover:text-[#5EE3A9] ring-1 ring-white/5 hover:ring-[#5EBF94]/40 shadow-sm hover:shadow-[0_14px_30px_-12px_rgba(94,191,148,0.55)] transition-all duration-200 group backdrop-blur-[2px]"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 sm:h-[18px] sm:w-[18px] group-hover:scale-110 transition-transform duration-200"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-semibold tracking-wide">Download template</span>
              {/* Desktop hover tooltip */}
              <div
                className="hidden sm:block pointer-events-none absolute z-30 left-1/2 -translate-x-1/2 top-full mt-3 opacity-0 scale-[0.98] -translate-y-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-200"
                aria-hidden
              >
                <div className="relative">
                  <div className="rounded-2xl bg-gradient-to-b from-gray-900/95 to-gray-900/85 backdrop-blur-md text-gray-100 text-[13px] leading-[1.35] px-6 py-4 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.7)] border border-white/10 ring-1 ring-white/10 max-w-[32rem] min-w-[24rem] text-left">
                    <div className="flex items-center gap-2 mb-2 text-[#5EE3A9]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 100 2 1 1 0 000-2zm1 4a1 1 0 10-2 0v3a1 1 0 102 0v-3z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold tracking-wide">Before you upload</span>
                    </div>
                    <ul className="grid gap-1.5 text-gray-200">
                      <li className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#5EE3A9] mt-[1px] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 111.414-1.414L8.414 12.172l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Edit the PPT and put your idea in it.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#5EE3A9] mt-[1px] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 111.414-1.414L8.414 12.172l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Export the presentation as a PDF, then upload it here.</span>
                      </li>
                    </ul>
                  </div>
                  <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3.5 w-3.5 rotate-45 bg-gray-900/95 border border-white/10 border-b-0 border-r-0 ring-1 ring-white/10"></span>
                </div>
              </div>
            </a>
          </div>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            role="button"
            tabIndex={0}
            onClick={() => {
              if (!submitting) fileInputRef.current?.click();
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (!submitting) fileInputRef.current?.click();
              }
            }}
            className={`w-full p-4 rounded-lg border-2 ${isDragging ? "border-[#5EBF94] bg-gray-700/60" : "border-dashed border-gray-600 bg-gray-700/50"} text-white flex items-center gap-3 cursor-pointer`}
            aria-disabled={submitting}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
              disabled={submitting}
            />
            {/* Upload / Remove icon */}
            <div className={`flex-none p-2 rounded-md ${isDragging ? "bg-[#5EBF94]/20" : "bg-white/5"}`}>
              {!pptFile ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#5EBF94]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h10a4 4 0 004-4M16 7l-4-4m0 0L8 7m4-4v11" />
                </svg>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  aria-label="Remove file"
                  className="flex items-center justify-center h-8 w-8 text-red-400 hover:text-red-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>

            <div className="flex-1 text-sm">
              {!pptFile ? (
                <div className="text-gray-200">
                  <div className="font-medium">Click or drag to upload</div>
                  <div className="text-xs text-gray-400">PDF - max file size 5 MB</div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{pptFile.name}</div>
                    <div className="text-xs text-gray-400">{Math.round(pptFile.size / 1024)} KB</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description (optional) */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm text-gray-300">Description</label>
            <span className="text-xs text-gray-400">
              {formData.description.length}/1000
            </span>
          </div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Short description about your submission"
            maxLength={1000}
            className="w-full p-3 rounded-lg bg-gray-700/80 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-[#5EBF94]"
            style={{ fontFamily: "'Pilat Extended', Arial, sans-serif", fontSize: "14px" }}
            rows={3}
          />
        </div>

    </div>

      {/* Submission lock disclaimer */}
      <div className="mt-4 p-3 rounded-md bg-yellow-500/10 border border-yellow-400/30 text-yellow-200 text-xs sm:text-sm">
        <p className="mb-2">
          Once you submit, your submission and team are locked. You cannot edit the submission,
          and no one can join or leave the team after submission.
        </p>
        {/* <label className="flex items-start gap-2">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 accent-emerald-500"
            checked={acknowledgeLock}
            onChange={(e) => setAcknowledgeLock(e.target.checked)}
            disabled={submitting}
          />
          <span>I understand and want to proceed.</span>
        </label> */}
      </div>

      {/* Mobile hint toast */}
      {showMobileHint && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 sm:hidden" role="status" aria-live="polite">
          <div className="rounded-2xl bg-gray-900/95 backdrop-blur-sm text-white text-[13px] leading-relaxed px-4 py-3 shadow-2xl ring-1 ring-white/10 max-w-[22rem] text-center flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#5EBF94] flex-shrink-0 mt-[2px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
            </svg>
            <span>
              You must edit and put your idea in the presentation, export it as PDF, and upload.
            </span>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-center mt-8">
        <div className="flex gap-4">
          {onClose && (
            <PortalButton
              onClick={onClose}
              disabled={submitting}
              className={`w-full sm:w-auto px-4 py-2 !text-[15px] sm:!text-[16px] md:!text-[16px] bg-gray-600 border border-gray-400/20 text-gray-300 ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Close
            </PortalButton>
          )}
            <PortalButton
                onClick={handleSubmit}
                disabled={isDisabled}
                className={`w-full sm:w-auto ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] active:scale-95"}`}
            >
                {submitting ? "Submitting…" : "Submit"}
            </PortalButton>
        </div>
      </div>
    </div>
  );

  if (embedded) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        {innerForm}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-screen h-screen relative">
      {/* Background image via next/image */}
      <Image src="/portal/bg1.svg" alt="" aria-hidden fill className="object-cover" />
      {/* Logo top left */}
      <div className="absolute top-6 left-6 sm:left-8 z-10">
        <Image src="/portal/logo.svg" alt="Logo" width={200} height={200} />
      </div>

      {/* Centered form */}
      <div className="flex flex-col items-center justify-center h-full px-4 relative z-10">
        {innerForm}
      </div>
    </div>
  );
};

export default Form;
