"use client";

import TeamUp from "./team-up";
import PortalButton from "./ui/button";
import { useEffect, useRef, useState, useCallback } from "react";
import { signupExternal } from "../../actions/signup";
import BackChevron from "./ui/back-chevron";
import Select from "./ui/select";
import Image from "next/image";
import { DISCORD_URL } from "@/lib/env";

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
  // Track confirmed selections to prevent arbitrary input
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null);
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);

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

  // Phone validation: must be 10 digits and start with 6-9
  const validatePhoneNumber = (val: string) => {
    const digits = val.replace(/\D/g, "");
    if (digits.length !== 10) return false;
    const first = parseInt(digits[0], 10);
    return first >= 6 && first <= 9;
  };

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

    if (name === "contactNumber") {
      // allow only digits and limit to 10 digits
      const digits = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, contactNumber: digits }));
      return;
    }

    if (name === "universityName") {
      setFormData((prev) => ({ ...prev, universityName: value, collegeName: "" }));
      setSelectedUniversity(null); // invalidate custom typing until suggestion is picked
      setSelectedCollege(null);
      setShowUniversitySuggestions(true);
      setActiveUniversityIndex(0);
      setCollegeSuggestions([]);
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCollegeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, collegeName: value }));
    setSelectedCollege(null); // require explicit selection
    setShowCollegeSuggestions(true);
    setActiveCollegeIndex(0);
  };

  const selectUniversity = (university: string) => {
    setFormData((prev) => ({ ...prev, universityName: university, collegeName: "" }));
    setSelectedUniversity(university);
    setSelectedCollege(null);
    setShowUniversitySuggestions(false);
    setActiveUniversityIndex(0);
    setCollegeSuggestions([]);
  };

  const selectCollege = (college: string) => {
    setFormData((prev) => ({ ...prev, collegeName: college }));
    setSelectedCollege(college);
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
      Boolean(selectedUniversity) &&
      Boolean(selectedCollege) &&
      formData.gender !== "" &&
      formData.contactNumber.trim() !== ""
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid()) return;
    // validate phone before submitting
    if (!validatePhoneNumber(formData.contactNumber)) {
      setError("Phone number must contain 10 digits and start with 6-9");
      return;
    }
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
          className="w-full max-w-md sm:max-w-lg p-6 sm:p-8 rounded-2xl relative animate-pop-in"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
            backdropFilter: "blur(10px) saturate(120%)",
            boxShadow:
              "0 12px 40px rgba(0,0,0,0.55), 0 6px 24px rgba(72,186,134,0.06) inset, 0 1px 0 rgba(255,255,255,0.02) inset",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <div className="mb-4 sm:mb-6 flex items-center gap-3 min-w-0">
            <BackChevron onClick={onBack} />
            <h2
              className="flex-1 min-w-0 truncate font-semibold text-white"
              style={{ fontFamily: "'Pilat Extended', 'Trap', Arial, sans-serif", fontSize: "clamp(20px, 5.5vw, 28px)" }}
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
          <div className="relative mb-2">
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
              aria-invalid={!selectedUniversity && formData.universityName.trim() !== ""}
              title={!selectedUniversity && formData.universityName.trim() !== "" ? "Please select a university from the suggestions" : undefined}
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
          {formData.universityName.trim() !== "" && !selectedUniversity && (
            <div className="mt-1 mb-2 text-xs text-yellow-300">
              Please select a university from the suggestions
            </div>
          )}

          <label className="block text-sm text-gray-300 mb-2">College Name</label>
          <div className="relative mb-2">
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
              disabled={!selectedUniversity}
              aria-invalid={!selectedCollege && formData.collegeName.trim() !== ""}
              title={!selectedCollege && formData.collegeName.trim() !== "" ? "Please select a college from the suggestions" : undefined}
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
          {formData.collegeName.trim() !== "" && !selectedCollege && (
            <div className="mt-1 mb-2 text-xs text-yellow-300">
              Please select a college from the suggestions
            </div>
          )}

          {/* Guidance: keep college name consistent and contact Discord if missing */}
          <div className="mt-2 mb-4 text-[11px] sm:text-xs md:text-sm text-gray-300 leading-relaxed">
            Please pick the same college name as your teammates. If your college name isn&apos;t there, raise a ticket on our
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-[#48BA86] underline underline-offset-2 hover:text-[#63ce9d]"
            >
              Discord server
            </a>
            .
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
            inputMode="numeric"
            pattern="\d*"
          />

          <div className="flex justify-center">
            <PortalButton
              onClick={handleSubmit}
              disabled={!isFormValid() || loading}
              className={`${
                isFormValid() ? "" : "opacity-50 cursor-not-allowed"
              }`}
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
