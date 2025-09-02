"use client";

import { useEffect, useRef, useState } from "react";

export type Option = { label: string; value: string };

interface SelectProps {
  value: string;
  onChange?: unknown;
  options: Option[];
  placeholder?: string;
  className?: string;
  listMaxHeightClass?: string;
  id?: string;
}

export default function Select({
  value,
  onChange,
  options,
  placeholder = "Select",
  className = "",
  listMaxHeightClass = "max-h-64",
  id,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const hideTimer = useRef<number | null>(null);

  const scheduleHide = () => {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => {
    if (!open) return;
    const idx = Math.max(
      0,
      options.findIndex((o) => o.value === value),
    );
    setActiveIndex(idx === -1 ? 0 : idx);
  }, [open, options, value]);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        id={id}
        className={`w-full bg-[#111213]/60 border border-white/10 rounded-full px-4 py-3 text-left text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#48BA86]/40 ${className}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id ?? "select"}-options`}
        onClick={() => setOpen((s) => !s)}
        onFocus={() => setOpen(true)}
        onBlur={scheduleHide}
        onKeyDown={(e) => {
          if (!open) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, options.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
          } else if (e.key === "Enter") {
            e.preventDefault();
            const opt = options[activeIndex];
            if (opt) {
              if (typeof onChange === "function") {
                (onChange as (value: string) => void)(opt.value);
              }
              setOpen(false);
            }
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
      >
        {value ? (
          (options.find((o) => o.value === value)?.label ?? placeholder)
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
      </button>

      {open && (
        <ul
          id={`${id ?? "select"}-options`}
          ref={listRef}
          className={`absolute z-20 mt-2 w-full ${listMaxHeightClass} overflow-auto rounded-xl border border-white/10 bg-[#0f1111]/95 backdrop-blur p-1 shadow-lg portal-scrollbar`}
          role="listbox"
        >
          {options.map((opt, idx) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={idx === activeIndex}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                if (typeof onChange === "function") {
                  (onChange as (value: string) => void)(opt.value);
                }
                setOpen(false);
              }}
              className={`px-3 py-2 cursor-pointer rounded-lg ${
                idx === activeIndex ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
