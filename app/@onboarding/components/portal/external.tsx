"use client";

import TeamUp from "./team-up";
import PortalButton from "./ui/button";
import { useEffect, useRef, useState, useCallback } from "react";
import { signupExternal } from "../../../actions/signup";
import BackChevron from "./ui/back-chevron";
import Select from "./ui/select";
import Image from "next/image";

// Debounce hook for search optimization
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface Props {
  onBack?: () => void;
}

const External = ({ onBack }: Props) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    universityName: "",
    collegeName: "",
    gender: "",
    contactNumber: "",
  });

  // University suggestions state
  const [universitySuggestions, setUniversitySuggestions] = useState<string[]>([]);
  const [showUniversitySuggestions, setShowUniversitySuggestions] = useState(false);
  const [activeUniversityIndex, setActiveUniversityIndex] = useState(0);
  const [loadingUniversities, setLoadingUniversities] = useState(false);
  const universityInputRef = useRef<HTMLInputElement>(null);
  const universityListRef = useRef<HTMLUListElement>(null);
  const hideUniversityTimer = useRef<NodeJS.Timeout | null>(null);

  // College suggestions state
  const [collegeSuggestions, setCollegeSuggestions] = useState<string[]>([]);
  const [showCollegeSuggestions, setShowCollegeSuggestions] = useState(false);
  const [activeCollegeIndex, setActiveCollegeIndex] = useState(0);
  const [loadingColleges, setLoadingColleges] = useState(false);
  const collegeInputRef = useRef<HTMLInputElement>(null);
  const collegeListRef = useRef<HTMLUListElement>(null);
  const hideCollegeTimer = useRef<NodeJS.Timeout | null>(null);

  // Debounced search terms
  const debouncedUniversityQuery = useDebounce(formData.universityName, 300);
  const debouncedCollegeQuery = useDebounce(formData.collegeName, 300);

  const GENDER_OPTIONS = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ] as const;

  // Search universities
  const searchUniversities = useCallback(async (query: string) => {
    if (!query.trim()) {
      setUniversitySuggestions([]);
      return;
    }

    setLoadingUniversities(true);
    try {
      const response = await fetch(`/api/colleges?type=universities&q=${encodeURIComponent(query)}&limit=15`);
      if (response.ok) {
        const data = await response.json();
        setUniversitySuggestions(data.universities || []);
      } else {
        setUniversitySuggestions([]);
      }
    } catch (error) {
      console.error('Error searching universities:', error);
      setUniversitySuggestions([]);
    } finally {
      setLoadingUniversities(false);
    }
  }, []);

  // Search colleges
  const searchColleges = useCallback(async (query: string, university: string) => {
    if (!query.trim() || !university.trim()) {
      setCollegeSuggestions([]);
      return;
    }

    setLoadingColleges(true);
    try {
      const response = await fetch(`/api/colleges?type=colleges&q=${encodeURIComponent(query)}&university=${encodeURIComponent(university)}&limit=15`);
      if (response.ok) {
        const data = await response.json();
        setCollegeSuggestions(data.colleges || []);
      } else {
        setCollegeSuggestions([]);
      }
    } catch (error) {
      console.error('Error searching colleges:', error);
      setCollegeSuggestions([]);
    } finally {
      setLoadingColleges(false);
    }
  }, []);

  // Effect for university search
  useEffect(() => {
    if (debouncedUniversityQuery) {
      searchUniversities(debouncedUniversityQuery);
    } else {
      setUniversitySuggestions([]);
    }
  }, [debouncedUniversityQuery, searchUniversities]);

  // Effect for college search
  useEffect(() => {
    if (debouncedCollegeQuery && formData.universityName) {
      searchColleges(debouncedCollegeQuery, formData.universityName);
    } else {
      setCollegeSuggestions([]);
    }
  }, [debouncedCollegeQuery, formData.universityName, searchColleges]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === "universityName") {
      setShowUniversitySuggestions(true);
      setActiveUniversityIndex(0);
      // Clear college when university changes
      setFormData((prev) => ({ ...prev, collegeName: "" }));
      setCollegeSuggestions([]);
    }
  };

  const handleCollegeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, collegeName: value }));
    setShowCollegeSuggestions(true);
    setActiveCollegeIndex(0);
  };

  const selectUniversity = (university: string) => {
    setFormData((prev) => ({ ...prev, universityName: university, collegeName: "" }));
    setShowUniversitySuggestions(false);
    setActiveUniversityIndex(0);
    setCollegeSuggestions([]);
  };

  const selectCollege = (college: string) => {
    setFormData((prev) => ({ ...prev, collegeName: college }));
    setShowCollegeSuggestions(false);
    setActiveCollegeIndex(0);
  };

  // University keyboard navigation
  const onUniversityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showUniversitySuggestions || universitySuggestions.length === 0) return;
    
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveUniversityIndex((i) => Math.min(i + 1, universitySuggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveUniversityIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      selectUniversity(universitySuggestions[activeUniversityIndex]);
    } else if (e.key === "Escape") {
      setShowUniversitySuggestions(false);
    }
  };

  // College keyboard navigation
  const onCollegeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showCollegeSuggestions || collegeSuggestions.length === 0) return;
    
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveCollegeIndex((i) => Math.min(i + 1, collegeSuggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveCollegeIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      selectCollege(collegeSuggestions[activeCollegeIndex]);
    } else if (e.key === "Escape") {
      setShowCollegeSuggestions(false);
    }
  };

  // Hide suggestion handlers
  const scheduleHideUniversity = () => {
    if (hideUniversityTimer.current) clearTimeout(hideUniversityTimer.current);
    hideUniversityTimer.current = setTimeout(() => setShowUniversitySuggestions(false), 120);
  };

  const cancelHideUniversity = () => {
    if (hideUniversityTimer.current) {
      clearTimeout(hideUniversityTimer.current);
      hideUniversityTimer.current = null;
    }
  };

  const scheduleHideCollege = () => {
    if (hideCollegeTimer.current) clearTimeout(hideCollegeTimer.current);
    hideCollegeTimer.current = setTimeout(() => setShowCollegeSuggestions(false), 120);
  };

  const cancelHideCollege = () => {
    if (hideCollegeTimer.current) {
      clearTimeout(hideCollegeTimer.current);
      hideCollegeTimer.current = null;
    }
  };

  const isFormValid = () => {
    return (
      formData.universityName.trim() !== "" &&
      formData.collegeName.trim() !== "" &&
      formData.gender !== "" &&
      formData.contactNumber.trim() !== ""
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid()) return;
    setLoading(true);
    setError(null);
    try {
      await signupExternal({
        contact_number: formData.contactNumber,
        gender: formData.gender,
        college_name: formData.collegeName,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return <TeamUp />;

  return (
    <div className="fixed inset-0 w-screen h-screen relative overflow-y-auto">
      {/* Background image via next/image */}
      <Image src="/portal/bg1.svg" alt="" aria-hidden fill className="object-cover" />

      <div className="flex items-center justify-center h-full px-4 py-6 sm:py-8 relative z-10">
        <div
          className="w-full max-w-md sm:max-w-lg p-6 sm:p-8 rounded-2xl relative"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
            backdropFilter: "blur(10px) saturate(120%)",
            boxShadow:
              "0 12px 40px rgba(0,0,0,0.55), 0 6px 24px rgba(72,186,134,0.06) inset, 0 1px 0 rgba(255,255,255,0.02) inset",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <div className="mb-6 flex items-center gap-3 min-w-0">
            <BackChevron onClick={onBack} />
            <h2
              className="flex-1 truncate text-xl sm:text-2xl md:text-3xl font-semibold text-white"
              style={{ fontFamily: "'Pilat Extended', 'Trap', Arial, sans-serif" }}
            >
              External Participant
            </h2>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-md text-sm mb-4">
              {error}
            </div>
          )}

          <label className="block text-sm text-gray-300 mb-2">University Name</label>
          <div className="relative mb-4">
            <input
              ref={universityInputRef}
              className="w-full bg-[#111213]/60 border border-white/10 rounded-full px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#48BA86]/40"
              type="text"
              name="universityName"
              value={formData.universityName}
              onChange={handleInputChange}
              onKeyDown={onUniversityKeyDown}
              onFocus={() => setShowUniversitySuggestions(true)}
              onBlur={scheduleHideUniversity}
              placeholder={loadingUniversities ? "Searching universities..." : "University Name"}
              aria-autocomplete="list"
              aria-controls="university-suggestions"
            />

            {showUniversitySuggestions && universitySuggestions.length > 0 && (
              <ul
                id="university-suggestions"
                ref={universityListRef}
                className="absolute z-20 mt-2 w-full max-h-64 overflow-auto rounded-xl border border-white/10 bg-[#0f1111]/95 backdrop-blur p-1 shadow-lg portal-scrollbar"
                role="listbox"
                onMouseEnter={cancelHideUniversity}
                onMouseLeave={scheduleHideUniversity}
              >
                {universitySuggestions.map((university, idx) => (
                  <li
                    key={`${university}-${idx}`}
                    role="option"
                    aria-selected={idx === activeUniversityIndex}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setActiveUniversityIndex(idx)}
                    onClick={() => selectUniversity(university)}
                    className={`px-3 py-2 cursor-pointer rounded-lg ${
                      idx === activeUniversityIndex ? "bg-white/10" : "hover:bg-white/5"
                    }`}
                  >
                    {university}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <label className="block text-sm text-gray-300 mb-2">College Name</label>
          <div className="relative mb-4">
            <input
              ref={collegeInputRef}
              className="w-full bg-[#111213]/60 border border-white/10 rounded-full px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#48BA86]/40"
              type="text"
              name="collegeName"
              value={formData.collegeName}
              onChange={handleCollegeInputChange}
              onKeyDown={onCollegeKeyDown}
              onFocus={() => setShowCollegeSuggestions(true)}
              onBlur={scheduleHideCollege}
              placeholder={loadingColleges ? "Searching colleges..." : "College Name"}
              aria-autocomplete="list"
              aria-controls="college-suggestions"
              disabled={!formData.universityName.trim()}
            />

            {showCollegeSuggestions && collegeSuggestions.length > 0 && (
              <ul
                id="college-suggestions"
                ref={collegeListRef}
                className="absolute z-20 mt-2 w-full max-h-56 overflow-auto rounded-xl border border-white/10 bg-[#0f1111]/95 backdrop-blur p-1 shadow-lg portal-scrollbar"
                role="listbox"
                onMouseEnter={cancelHideCollege}
                onMouseLeave={scheduleHideCollege}
              >
                {collegeSuggestions.map((college, idx) => (
                  <li
                    key={`${college}-${idx}`}
                    role="option"
                    aria-selected={idx === activeCollegeIndex}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setActiveCollegeIndex(idx)}
                    onClick={() => selectCollege(college)}
                    className={`px-3 py-2 cursor-pointer rounded-lg ${
                      idx === activeCollegeIndex ? "bg-white/10" : "hover:bg-white/5"
                    }`}
                  >
                    {college}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <label className="block text-sm text-gray-300 mb-2">Gender</label>
          <div className="mb-4">
            <Select
              id="gender"
              value={formData.gender}
              onChange={(val: string) => setFormData((prev) => ({ ...prev, gender: val }))}
              options={GENDER_OPTIONS as unknown as { label: string; value: string }[]}
              placeholder="Gender"
            />
          </div>

          <label className="block text-sm text-gray-300 mb-2">Contact Number</label>
          <input
            className="w-full bg-[#111213]/60 border border-white/10 rounded-full px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#48BA86]/40 mb-6"
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            placeholder="Contact Number"
          />

          <div className="flex justify-center">
            <PortalButton
              onClick={handleSubmit}
              disabled={!isFormValid() || loading}
              className={`${
                isFormValid() ? "" : "opacity-50 cursor-not-allowed"
              } px-6 py-2 text-base sm:text-[20px]`}
            >
              {loading ? "Submitting..." : "Proceed"}
            </PortalButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default External;