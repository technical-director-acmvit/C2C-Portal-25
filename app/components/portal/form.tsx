"use client";

import React, { useEffect, useState } from "react";
import Image from 'next/image';
import { getTracks, submitTeamSubmission, type Track } from '../../actions/submission';
import BackChevron from './ui/back-chevron';

interface FormProps {
  onBack?: () => void;
  requirePPT?: boolean; // when true, ppt_url is mandatory
}

const Form = ({ onBack, requirePPT = false }: FormProps) => {
  const [formData, setFormData] = useState({
    track_id: '',
    github_url: '',
    figma_url: '',
    other: '',
    ppt_url: '',
    description: '',
  });
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
        if (mounted) setError(err instanceof Error ? err.message : 'Failed to load tracks');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // PPT can be required by the backend for certain rounds; frontend can opt-in via prop
  const valid = Boolean(
    formData.track_id &&
      formData.github_url &&
      formData.figma_url &&
      formData.other &&
      (!requirePPT || Boolean(formData.ppt_url))
  );

  const handleSubmit = async () => {
    if (!valid) {
      setError('Please fill all required fields.');
      return;
    }
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      // Defensive: ensure we send the track's ID. Some older flows may set the select's value to title.
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
        // `ppt_url` is optional (string). Pass undefined when empty to match the action types.
        ppt_url: formData.ppt_url || undefined,
        description: formData.description || null,
        github_url: formData.github_url || null,
        figma_url: formData.figma_url || null,
        other: formData.other || null,
        track_id: selectedTrackId,
      });
      setSuccess('Submission saved');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

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
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 sm:p-8 w-full max-w-md border border-gray-600">
          <div className="flex items-center gap-3 mb-6">
            {onBack && <BackChevron onClick={onBack} />}
            <h1 
              className="text-white text-2xl sm:text-3xl"
              style={{ fontFamily: "'Pilat Extended', Arial, sans-serif", fontWeight: '700' }}
            >
              Team Submission
            </h1>
          </div>
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-md text-sm mb-4">{error}</div>
          )}
          {success && (
            <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-2 rounded-md text-sm mb-4">{success}</div>
          )}
          
          <div className="space-y-4">
            {/* Track Dropdown */}
            <div>
              <select
                name="track_id"
                value="18218b70-3f83-4743-8a29-a77b4c7ccc39"
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-gray-700/80 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-[#5EBF94]"
                style={{
                  fontFamily: "'Pilat Extended', Arial, sans-serif",
                  fontSize: '14px'
                }}
                disabled={loading}
              >
                <option value="" className="text-gray-400">{loading ? 'Loading tracks…' : 'Select a Track'}</option>
                {tracks.map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>

            {/* Figma Link */}
            <div>
              <input
                type="url"
                name="figma_url"
                value={formData.figma_url}
                onChange={handleInputChange}
                placeholder="Figma Link"
                className="w-full p-3 rounded-lg bg-gray-700/80 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-[#5EBF94]"
                style={{
                  fontFamily: "'Pilat Extended', Arial, sans-serif",
                  fontSize: '14px'
                }}
              />
            </div>

            {/* PPT Link (may be required) */}
            <div>
              <input
                type="url"
                name="ppt_url"
                value={formData.ppt_url}
                onChange={handleInputChange}
                placeholder={requirePPT ? "PPT Link (required)" : "PPT Link (optional)"}
                className="w-full p-3 rounded-lg bg-gray-700/80 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-[#5EBF94]"
                style={{ fontFamily: "'Pilat Extended', Arial, sans-serif", fontSize: '14px' }}
              />
            </div>

            {/* Description (optional) */}
            <div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Short description about your submission (optional)"
                className="w-full p-3 rounded-lg bg-gray-700/80 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-[#5EBF94]"
                style={{ fontFamily: "'Pilat Extended', Arial, sans-serif", fontSize: '14px' }}
                rows={3}
              />
            </div>

            {/* Other/Drive/Demo Link */}
            <div>
              <input
                type="url"
                name="other"
                value={formData.other}
                onChange={handleInputChange}
                placeholder="Other Link (demo, drive, etc.)"
                className="w-full p-3 rounded-lg bg-gray-700/80 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-[#5EBF94]"
                style={{
                  fontFamily: "'Pilat Extended', Arial, sans-serif",
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Github Link */}
            <div>
              <input
                type="url"
                name="github_url"
                value={formData.github_url}
                onChange={handleInputChange}
                placeholder="GitHub Link"
                className="w-full p-3 rounded-lg bg-gray-700/80 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-[#5EBF94]"
                style={{
                  fontFamily: "'Pilat Extended', Arial, sans-serif",
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <button 
              className="px-12 py-3 rounded-lg text-white cursor-pointer transition-all duration-200 hover:bg-[#4da577] active:scale-95" 
              style={{ 
                backgroundColor: '#5EBF94',
                fontSize: '18px',
                fontFamily: "'Pilat Extended', Arial, sans-serif",
                fontWeight: '400'
              }}
              onClick={handleSubmit}
              disabled={!valid || submitting}
            >
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
