"use client";

import TeamUp from "./team-up";
import PortalButton from "./ui/button";
import { useEffect, useMemo, useRef, useState } from "react";
import { signupExternal } from "../../actions/signup";
import { getAisheColleges } from "../../actions/aishe";
import BackChevron from './ui/back-chevron';

type College = { id?: string | number; name: string };

// Toggle suggestions: 0 = plain/custom input, 1 = suggestions + fuzzy matching
const SUGGESTIONS_ENABLED = 1;

// ---------- fuzzy helpers ----------
function normalize(s: string) {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

// Levenshtein distance (iterative DP)
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const v0 = new Array(b.length + 1);
  const v1 = new Array(b.length + 1);
  for (let i = 0; i < v0.length; i++) v0[i] = i;

  for (let i = 0; i < a.length; i++) {
    v1[0] = i + 1;
    for (let j = 0; j < b.length; j++) {
      const cost = a[i] === b[j] ? 0 : 1;
      v1[j + 1] = Math.min(
        v1[j] + 1, // insertion
        v0[j + 1] + 1, // deletion
        v0[j] + cost // substitution
      );
    }
    for (let j = 0; j < v0.length; j++) v0[j] = v1[j];
  }
  return v1[b.length];
}

type Ranked = { name: string; scoreBand: number; score: number };

// ranker: lower score is better; scoreBand groups by exact/startsWith/contains/fuzzy
function rankNames(query: string, names: string[], limit = 15): Ranked[] {
  const q = normalize(query);
  if (!q) return names.slice(0, limit).map((name) => ({ name, scoreBand: 99, score: 999 }));

  const ranked: Ranked[] = [];
  for (const name of names) {
    const n = normalize(name);
    if (!n) continue;

    if (n === q) {
      ranked.push({ name, scoreBand: 0, score: 0 });
      continue;
    }
    if (n.startsWith(q)) {
      // tighter is better -> shorter extra tail wins
      ranked.push({ name, scoreBand: 1, score: n.length - q.length });
      continue;
    }
    if (n.includes(q)) {
      // prefer earlier occurrence and shorter string
      ranked.push({ name, scoreBand: 2, score: n.indexOf(q) + n.length * 0.001 });
      continue;
    }
    // fuzzy: normalized distance (distance / maxLen) to keep scale ~0..1
    const dist = levenshtein(n, q);
    const norm = dist / Math.max(n.length, q.length);
    // cutoff to avoid wild results; tweak 0.5 if you want looser
    if (norm <= 0.5) {
      ranked.push({ name, scoreBand: 3, score: norm });
    }
  }

  ranked.sort((a, b) => (a.scoreBand - b.scoreBand) || (a.score - b.score) || a.name.localeCompare(b.name));
  return ranked.slice(0, limit);
}
// -----------------------------------

interface Props { onBack?: () => void }
const External = ({ onBack }: Props) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    collegeName: "",
    gender: "",
    contactNumber: "",
  });

  const [colleges, setColleges] = useState<College[]>([]);
  const [loadingColleges, setLoadingColleges] = useState(false);

  // suggestion UI state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const hideTimer = useRef<number | null>(null);

  const COLLEGE_CACHE_KEY = "c2c_colleges_v1";

  useEffect(() => {
    if (!SUGGESTIONS_ENABLED) return; // skip fetching/caching when suggestions are off

    // try cache first
    try {
      const raw = localStorage.getItem(COLLEGE_CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const expires = parsed.expires as number;
        if (expires && Date.now() < expires && Array.isArray(parsed.list)) {
          setColleges(parsed.list.map((n: string, i: number) => ({ name: n, id: i })));
          return;
        }
      }
    } catch {
      // ignore
    }

    // server action
    (async () => {
      setLoadingColleges(true);
      try {
        const names = await getAisheColleges();
        if (Array.isArray(names) && names.length) {
          const list = names.map((name, i) => ({ name, id: i }));
          setColleges(list);
          try {
            localStorage.setItem(
              COLLEGE_CACHE_KEY,
              JSON.stringify({
                expires: Date.now() + 1000 * 60 * 60 * 24, // 24h
                list: names,
              })
            );
          } catch {
            // ignore
          }
        }
      } finally {
        setLoadingColleges(false);
      }
    })();
  }, []);

  const collegeNames = useMemo(() => colleges.map((c) => c.name), [colleges]);

  const suggestions = useMemo(() => {
    return rankNames(formData.collegeName, collegeNames, 15);
  }, [formData.collegeName, collegeNames]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "collegeName") {
      setShowSuggestions(true);
      setActiveIndex(0);
    }
  };

  const pickSuggestion = (value: string) => {
    setFormData((prev) => ({ ...prev, collegeName: value }));
    setShowSuggestions(false);
    setActiveIndex(0);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      pickSuggestion(suggestions[activeIndex].name);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  // blur handling so clicks can register before hiding
  const scheduleHide = () => {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setShowSuggestions(false), 120);
  };

  const isFormValid = () => {
    return (
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
    <div
      className="fixed inset-0 w-screen h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url(/portal/bg1.svg)" }}
    >

      {/* Centered card */}
      <div className="flex items-center justify-center h-full">
        <div
          className="w-full max-w-lg p-8 rounded-2xl relative"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
            backdropFilter: "blur(10px) saturate(120%)",
            boxShadow:
              "0 12px 40px rgba(0,0,0,0.55), 0 6px 24px rgba(72,186,134,0.06) inset, 0 1px 0 rgba(255,255,255,0.02) inset",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <div className="mb-4">
            <BackChevron onClick={onBack} />
          </div>
          <h2
            className="text-3xl font-semibold text-white mb-6"
            style={{ fontFamily: "'Pilat Extended', 'Trap', Arial, sans-serif" }}
          >
            External Participant
          </h2>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          <label className="text-sm text-gray-300 mb-2">College Name</label>
          <div className="relative">
            <input
              ref={inputRef}
              className="w-full bg-[#111213]/60 border border-white/10 rounded-full px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#48BA86]/40"
              type="text"
              name="collegeName"
              value={formData.collegeName}
              onChange={handleInputChange}
              onKeyDown={onKeyDown}
              onFocus={() => setShowSuggestions(true)}
              onBlur={scheduleHide}
              placeholder={loadingColleges ? "Loading colleges…" : "College's Name"}
              aria-autocomplete="list"
              aria-expanded={showSuggestions}
              aria-controls="college-suggestions"
            />

            {showSuggestions && suggestions.length > 0 && (
              <ul
                id="college-suggestions"
                ref={listRef}
                className="absolute z-20 mt-2 w-full max-h-64 overflow-auto rounded-xl border border-white/10 bg-[#0f1111]/95 backdrop-blur p-1 shadow-lg"
                role="listbox"
              >
                {suggestions.map((s, idx) => (
                  <li
                    key={s.name}
                    role="option"
                    aria-selected={idx === activeIndex}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => pickSuggestion(s.name)}
                    className={`px-3 py-2 cursor-pointer rounded-lg ${
                      idx === activeIndex ? "bg-white/10" : "hover:bg-white/5"
                    }`}
                    title={
                      s.scoreBand === 0
                        ? "exact match"
                        : s.scoreBand === 1
                        ? "starts with"
                        : s.scoreBand === 2
                        ? "contains"
                        : "fuzzy match"
                    }
                  >
                    {s.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <label className="text-sm text-gray-300 mt-3 mb-2">Gender</label>
          <select
            className="w-full bg-[#111213]/60 border border-white/10 rounded-full px-4 py-3 text-white placeholder-gray-400 focus:outline-none"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
          >
            <option value="" disabled>
              Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <label className="text-sm text-gray-300 mt-3 mb-2">
            Contact Number
          </label>
          <input
            className="w-full bg-[#111213]/60 border border-white/10 rounded-full px-4 py-3 text-white placeholder-gray-400 focus:outline-none"
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            placeholder="Contact Number"
          />

          <div className="flex justify-center mt-6">
            <PortalButton
              onClick={handleSubmit}
              disabled={!isFormValid() || loading}
              className={`${
                isFormValid() ? "" : "opacity-50 cursor-not-allowed"
              } px-6 py-2 text-[20px]`}
            >
              {loading ? "Submitting…" : "Proceed"}
            </PortalButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default External;
