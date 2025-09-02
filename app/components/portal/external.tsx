"use client";

import TeamUp from "./team-up";
import PortalButton from "./ui/button";
import { useEffect, useMemo, useRef, useState } from "react";
import { signupExternal } from "../../actions/signup";
import BackChevron from "./ui/back-chevron";
import Select from "./ui/select";
import Image from "next/image";

type College = { id?: string | number; name: string; state?: string };
type CollegeJSON = string | { name?: unknown; state?: unknown } | null;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function isCollegeJSONObject(v: unknown): v is { name: string; state?: string } {
  if (!isRecord(v)) return false;
  const name = v["name"];
  if (typeof name !== "string") return false;
  const state = v["state"];
  return state === undefined || typeof state === "string";
}

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
        v0[j] + cost, // substitution
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

  ranked.sort(
    (a, b) => a.scoreBand - b.scoreBand || a.score - b.score || a.name.localeCompare(b.name),
  );
  return ranked.slice(0, limit);
}
// -----------------------------------

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

  const [unis, setUnis] = useState<College[]>([]);
  const [loadingUnis, setLoadingUnis] = useState(false);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loadingColleges, setLoadingColleges] = useState(false);

  // suggestion UI state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const hideTimer = useRef<number | null>(null);

  // NEW: college suggestion UI state & refs
  const [showCollegeSuggestions, setShowCollegeSuggestions] = useState(false);
  const [activeCollegeIndex, setActiveCollegeIndex] = useState(0);
  const collegeInputRef = useRef<HTMLInputElement | null>(null);
  const collegeListRef = useRef<HTMLUListElement | null>(null);
  const hideCollegeTimer = useRef<number | null>(null);

  const GENDER_OPTIONS = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ] as const;
  // using shared <Select /> for gender for consistency & accessibility

  // bump cache key since source changed from portal/unis.json to backend route
  const COLLEGE_CACHE_KEY = "c2c_unis_v1";

  useEffect(() => {
    if (!SUGGESTIONS_ENABLED) return;

    try {
      const raw = localStorage.getItem(COLLEGE_CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const expires = parsed.expires as number;
        const list = parsed.list as unknown;
        if (expires && Date.now() < expires && Array.isArray(list)) {
          const rawList = list as CollegeJSON[];
          const items: College[] = [];
          rawList.forEach((it, i) => {
            if (typeof it === "string") {
              items.push({ name: it, id: i });
            } else if (isCollegeJSONObject(it)) {
              items.push({ name: it.name, state: it.state, id: i });
            }
          });
          if (items.length) {
            setUnis(items);
            return;
          }
        }
      }
    } catch {}

    (async () => {
      setLoadingUnis(true);
      try {
        // call the backend route that serves the university list
        const res = await fetch(getApiUrl("uni_list"), { cache: "force-cache" });
        console.log(res);
        if (!res.ok) throw new Error(`Failed to load universities: ${res.status}`);
        const data: unknown = await res.json();
        const items: College[] = [];

        // Handle the actual API response format: {"universities": ["name1", "name2", ...]}
        if (data && typeof data === "object" && "universities" in data) {
          const universities = (data as { universities: unknown }).universities;
          if (Array.isArray(universities)) {
            universities.forEach((u, i) => {
              if (typeof u === "string") {
                items.push({ name: u, id: i });
              } else if (u && typeof u === "object" && "name" in u && typeof u.name === "string") {
                items.push({
                  name: u.name,
                  state: "state" in u && typeof u.state === "string" ? u.state : undefined,
                  id: i,
                });
              }
            });
          }
        }

        if (items.length) {
          setUnis(items);
          try {
            // cache minimal shape to save space
            const cacheList = items.map(({ name, state }) => ({ name, state }));
            localStorage.setItem(
              COLLEGE_CACHE_KEY,
              JSON.stringify({
                expires: Date.now() + 1000 * 60 * 60 * 24, // 24h
                list: cacheList,
              }),
            );
          } catch {
            // ignore
          }
        }
      } catch {
        // silently fail; user can still type custom value
      } finally {
        setLoadingUnis(false);
      }
    })();
  }, []);

  // Build display names, appending state for duplicates of the same name
  const { displayNames, displayToBase } = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of unis) counts.set(c.name, (counts.get(c.name) || 0) + 1);
    const map = new Map<string, string>();
    const names: string[] = [];
    for (const c of unis) {
      const isDup = (counts.get(c.name) || 0) > 1;
      const display = isDup && c.state ? `${c.name} - ${c.state}` : c.name;
      names.push(display);
      if (!map.has(display)) map.set(display, c.name);
    }
    return { displayNames: names, displayToBase: map };
  }, [unis]);

  const suggestions = useMemo(() => {
    return rankNames(formData.universityName, displayNames, 15);
  }, [formData.universityName, displayNames]);

  // NEW: college names & suggestions using same ranker (deduplicated by name)
  const collegeNames = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const c of colleges) {
      const k = (c.name || "").toLowerCase();
      if (!k) continue;
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(c.name);
    }
    return out;
  }, [colleges]);
  const collegeSuggestions = useMemo(() => {
    return rankNames(formData.collegeName, collegeNames, 15);
  }, [formData.collegeName, collegeNames]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "universityName") {
      // user is editing university -> show suggestions and clear previously loaded colleges
      setShowSuggestions(true);
      setActiveIndex(0);
      setColleges([]);
      setFormData((prev) => ({ ...prev, collegeName: "" }));
    }
  };

  // NEW: handle college input changes
  const handleCollegeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, collegeName: value }));
    setShowCollegeSuggestions(true);
    setActiveCollegeIndex(0);
  };

  const pickSuggestion = (value: string) => {
    const base = displayToBase.get(value) || value;
    setFormData((prev) => ({ ...prev, universityName: base, collegeName: "" }));
    setShowSuggestions(false);
    setActiveIndex(0);

    (async () => {
      setLoadingColleges(true);
      setColleges([]);
      try {
        const res = await fetch(getApiUrl(`college/${encodeURIComponent(base)}`), {
          cache: "force-cache",
        });
        if (!res.ok) throw new Error(`Failed to load colleges: ${res.status}`);
        const data: unknown = await res.json();
        const items: College[] = [];

        // Handle the actual API response format: {"colleges": ["name1", "name2", ...]}
        if (data && typeof data === "object" && "colleges" in data) {
          const colleges = (data as { colleges: unknown }).colleges;
          if (Array.isArray(colleges)) {
            colleges.forEach((c, i) => {
              if (typeof c === "string") {
                items.push({ name: c, id: i });
              } else if (c && typeof c === "object" && "name" in c && typeof c.name === "string") {
                items.push({
                  name: c.name,
                  state: "state" in c && typeof c.state === "string" ? c.state : undefined,
                  id: i,
                });
              }
            });
          }
        }
        // Deduplicate colleges by name (case-insensitive) to avoid duplicate keys and confusion
        const seen = new Set<string>();
        const deduped: College[] = [];
        for (const it of items) {
          const k = (it.name || "").toLowerCase();
          if (!k) continue;
          if (seen.has(k)) continue;
          seen.add(k);
          deduped.push(it);
        }
        setColleges(deduped);
      } catch {
        // ignore — user won't be able to select a college if fetch fails
        setColleges([]);
      } finally {
        setLoadingColleges(false);
      }
    })();
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

  // NEW: college input keyboard handling
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
      setFormData((prev) => ({
        ...prev,
        collegeName: collegeSuggestions[activeCollegeIndex].name,
      }));
      setShowCollegeSuggestions(false);
    } else if (e.key === "Escape") {
      setShowCollegeSuggestions(false);
    }
  };

  const scheduleHide = () => {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setShowSuggestions(false), 120);
  };

  const cancelHide = () => {
    if (hideTimer.current) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  // NEW: schedule hide for college suggestions
  const scheduleHideCollege = () => {
    if (hideCollegeTimer.current) window.clearTimeout(hideCollegeTimer.current);
    hideCollegeTimer.current = window.setTimeout(() => setShowCollegeSuggestions(false), 120);
  };

  const cancelHideCollege = () => {
    if (hideCollegeTimer.current) {
      window.clearTimeout(hideCollegeTimer.current);
      hideCollegeTimer.current = null;
    }
  };

  // no-op

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
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          <label className="text-sm text-gray-300 mb-2">University Name</label>
          <div className="relative">
            <input
              ref={inputRef}
              className="w-full bg-[#111213]/60 border border-white/10 rounded-full px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#48BA86]/40"
              type="text"
              name="universityName"
              value={formData.universityName}
              onChange={handleInputChange}
              onKeyDown={onKeyDown}
              onFocus={() => setShowSuggestions(true)}
              onBlur={scheduleHide}
              placeholder={loadingUnis ? "Loading universities…" : "University Name"}
              aria-autocomplete="list"
              aria-controls="uni-suggestions"
            />

            {showSuggestions && suggestions.length > 0 && (
              <ul
                id="uni-suggestions"
                ref={listRef}
                className="absolute z-20 mt-2 w-full max-h-64 overflow-auto rounded-xl border border-white/10 bg-[#0f1111]/95 backdrop-blur p-1 shadow-lg portal-scrollbar"
                role="listbox"
                onMouseEnter={cancelHide}
                onMouseLeave={scheduleHide}
              >
                {suggestions.map((s, idx) => (
                  <li
                    key={s.name}
                    role="option"
                    aria-selected={idx === activeIndex}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setActiveIndex(idx)}
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

          <label className="text-sm text-gray-300 mt-3 mb-2">College Name</label>
          <div className="relative">
            {/* Replaced Select with fuzzy-searchable input + dropdown for colleges */}
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
              placeholder={loadingColleges ? "Loading colleges…" : "College Name"}
              aria-autocomplete="list"
              aria-controls="college-suggestions"
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
                {collegeSuggestions.map((s, idx) => (
                  <li
                    key={`${s.name}-${idx}`}
                    role="option"
                    aria-selected={idx === activeCollegeIndex}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setActiveCollegeIndex(idx)}
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, collegeName: s.name }));
                      setShowCollegeSuggestions(false);
                    }}
                    className={`px-3 py-2 cursor-pointer rounded-lg ${
                      idx === activeCollegeIndex ? "bg-white/10" : "hover:bg-white/5"
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
          <Select
            id="gender"
            value={formData.gender}
            onChange={(val: string) => setFormData((prev) => ({ ...prev, gender: val }))}
            options={GENDER_OPTIONS as unknown as { label: string; value: string }[]}
            placeholder="Gender"
          />

          <label className="text-sm text-gray-300 mt-3 mb-2">Contact Number</label>
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
              } px-6 py-2 text-base sm:text-[20px]`}
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

// Helper to construct API URL with a safe same-origin fallback
function getApiUrl(path: string) {
  const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
  // If a public API URL is configured, use it; otherwise use a same-origin path under /api
  if (base) return `${base}/${path.replace(/^\/+/, "")}`;
  // fallback to same-origin API endpoint
  return `/_next/data/${path}`; // minimal safe default (replace if your API route is different)
}
