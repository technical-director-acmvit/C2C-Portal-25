"use client";

import React from "react";

export default function LanguageBar({ languages }: { languages: Record<string, number> | null }) {
  if (!languages || Object.keys(languages).length === 0) return null;
  const total = Object.values(languages).reduce((a, b) => a + b, 0);
  const entries = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  return (
    <div>
      <div className="flex h-3 rounded overflow-hidden border border-white/10">
        {entries.map(([lang, bytes]) => (
          <div
            key={lang}
            className="h-full"
            style={{ width: `${(bytes / total) * 100}%`, backgroundColor: colorFor(lang) }}
          />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-300">
        {entries.map(([lang]) => (
          <span key={lang} className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: colorFor(lang) }} />
            {lang}
          </span>
        ))}
      </div>
    </div>
  );
}

function colorFor(lang: string): string {
  // basic palette; extend if needed
  const map: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Go: "#00ADD8",
    Python: "#3572A5",
    Rust: "#dea584",
    Java: "#b07219",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Shell: "#89e051",
  };
  return map[lang] ?? "#48BA86";
}
