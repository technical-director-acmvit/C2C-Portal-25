"use client";

import React, { useEffect, useState } from "react";
import Image from 'next/image';
import { getTracks, submitTeamSubmission, type Track } from '../../actions/submission';

interface FormProps {
  onBack?: () => void;
}

const Form = ({ onBack }: FormProps) => {
  const [formData, setFormData] = useState({
    track_id: '',
    github_url: '',
    figma_url: '',
    other: '',
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

  const valid = formData.track_id && formData.github_url && formData.figma_url && formData.other;

  const handleSubmit = async () => {
    if (!valid) return;
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await submitTeamSubmission({
        track_id: formData.track_id,
        github_url: formData.github_url,
        figma_url: formData.figma_url,
        other: formData.other,
      });
      setSuccess('Submission saved');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/portal/bg1.svg)' }}>
      {/* Logo top left */}
      <div className="absolute top-6 left-18">
        <Image src="/portal/logo.svg" alt="Logo" width={200} height={200} />
      </div>
      
      {/* Back button */}
      {onBack && (
        <div className="absolute top-6 right-6">
          <button
            className="text-white border border-white px-4 py-2 rounded bg-transparent hover:bg-white/10 transition-colors"
            onClick={onBack}
            style={{
              fontFamily: "'Pilat Extended', Arial, sans-serif",
              fontSize: '14px'
            }}
          >
            Back to Dashboard
          </button>
        </div>
      )}
      
      {/* Centered form */}
      <div className="flex flex-col items-center justify-center h-full">
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md border border-gray-600">
          <h1 
            className="text-white mb-8 text-center"
            style={{
              fontSize: '32px',
              fontFamily: "'Pilat Extended', Arial, sans-serif",
              fontWeight: '700'
            }}
          >
            Team Submission
          </h1>
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
                value={formData.track_id}
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
