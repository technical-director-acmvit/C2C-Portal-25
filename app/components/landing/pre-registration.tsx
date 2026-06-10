"use client";

import { type CSSProperties, FormEvent, useEffect, useState } from "react";

type PreRegistrationProps = {
  active: boolean;
  onClose: () => void;
};

// Colours pulled from the green sectors of the C2C logo. The black cutout is
// intentionally excluded because the registration strips should read as logo
// facets, not gaps.
const TRIANGLE_COLORS = [
  "#48BA86",
  "#D3EBE0",
  "#5EBF94",
  "#86CCAC",
  "#ADDBC8",
];

const STRIP_TILE_COUNT = 60; // one seamless loop period

type Strip = {
  key: "tl" | "br";
  className: string;
  durationMs: number;
};

const STRIPS: Strip[] = [
  // Two strips, each at a distinct incident angle so they don't read as the
  // same band rotated. The strips are absolutely positioned and clipped via
  // CSS — see globals.css for the geometry.
  { key: "tl", className: "c2c-prereg-strip c2c-prereg-strip--tl", durationMs: 18000 },
  { key: "br", className: "c2c-prereg-strip c2c-prereg-strip--br", durationMs: 22000 },
];

function tileColors(index: number, stripIndex: number) {
  const offset = stripIndex * 2;
  return {
    a: TRIANGLE_COLORS[(index * 2 + offset) % TRIANGLE_COLORS.length],
    b: TRIANGLE_COLORS[(index * 2 + offset + 1) % TRIANGLE_COLORS.length],
  };
}

function StripTiles({ stripIndex }: { stripIndex: number }) {
  const tiles = Array.from({ length: STRIP_TILE_COUNT }, (_, idx) => ({
    idx,
    ...tileColors(idx, stripIndex),
  }));

  return (
    <div className="c2c-prereg-strip__track">
      {[0, 1].map((copy) =>
        tiles.map(({ idx, a, b }) => (
          <span
            key={`${copy}-${idx}`}
            className="c2c-prereg-tile"
            style={{ "--tri-a": a, "--tri-b": b } as CSSProperties}
            aria-hidden="true"
          />
        )),
      )}
    </div>
  );
}

export default function PreRegistration({ active, onClose }: PreRegistrationProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // When the panel closes externally, drop the in-flight submitting flag so a
  // re-open starts fresh.
  useEffect(() => {
    if (!active) {
      setSubmitting(false);
    }
  }, [active]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    // No backend yet — just play the reverse animation by closing.
    setSubmitting(true);
    window.setTimeout(() => {
      onClose();
    }, 220);
  };

  return (
    <div
      className={`c2c-prereg ${active ? "is-active" : ""}`}
      aria-hidden={!active}
    >
      {STRIPS.map((strip, i) => (
        <div
          key={strip.key}
          className={strip.className}
          style={{ ["--c2c-prereg-strip-duration" as string]: `${strip.durationMs}ms` }}
        >
          <StripTiles stripIndex={i} />
        </div>
      ))}

      <div className="c2c-prereg-corner c2c-prereg-corner--tl" aria-hidden={!active}>
        Pre-registration
      </div>
      <div className="c2c-prereg-corner c2c-prereg-corner--br" aria-hidden={!active}>
        C2C 7.0
      </div>

      <form className="c2c-prereg-form" onSubmit={handleSubmit}>
        <header className="c2c-prereg-form__head">
          <p className="c2c-prereg-form__eyebrow">Join the list</p>
          <h2 className="c2c-prereg-form__title">Be first in line for C2C 7.0</h2>
          <p className="c2c-prereg-form__sub">
            Drop your details — we&apos;ll ping you the moment registrations open.
          </p>
        </header>
        <label className="c2c-prereg-field">
          <span>Name</span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
            disabled={!active}
          />
        </label>
        <label className="c2c-prereg-field">
          <span>Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            disabled={!active}
          />
        </label>
        <div className="c2c-prereg-form__actions">
          <button
            type="button"
            className="c2c-prereg-button c2c-prereg-button--ghost"
            onClick={onClose}
            disabled={!active}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="c2c-prereg-button c2c-prereg-button--primary"
            disabled={!active || submitting}
          >
            {submitting ? "Saved" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
