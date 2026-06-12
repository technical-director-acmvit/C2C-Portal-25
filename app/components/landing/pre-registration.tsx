"use client";

import { type CSSProperties, FormEvent, useEffect, useState } from "react";

type PreRegistrationProps = {
  active: boolean;
  onClose: () => void;
  // Fired only once the backend confirms the registration was saved. The
  // parent hands off to the success animation from here.
  onSuccess: () => void;
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALREADY_REGISTERED_MESSAGE = "You're already on the list — we'll be in touch.";

type Status =
  | { tone: "idle"; message: "" }
  | { tone: "info"; message: string }
  | { tone: "error"; message: string }
  | { tone: "success"; message: string };

export default function PreRegistration({ active, onClose, onSuccess }: PreRegistrationProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [status, setStatus] = useState<Status>({ tone: "idle", message: "" });

  // When the panel closes externally, drop the in-flight submitting flag so a
  // re-open starts fresh.
  useEffect(() => {
    if (!active) {
      setSubmitting(false);
      setShaking(false);
      setStatus({ tone: "idle", message: "" });
    }
  }, [active]);

  // Any unsuccessful submission: surface the reason, shake the card and flash
  // it red (cleared again in onAnimationEnd), and unlock the submit button.
  const failSubmission = (message: string) => {
    setStatus({ tone: "error", message });
    setShaking(true);
    setSubmitting(false);
  };

  const infoSubmission = (message: string) => {
    setStatus({ tone: "info", message });
    setShaking(false);
    setSubmitting(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName) {
      failSubmission("Please tell us your name.");
      return;
    }
    if (!EMAIL_RE.test(trimmedEmail)) {
      failSubmission("That email doesn't look right.");
      return;
    }

    setSubmitting(true);
    setStatus({ tone: "info", message: "Saving you to the list…" });
    try {
      const res = await fetch("/api/preregister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, email: trimmedEmail }),
      });
      const data: { success?: boolean; error?: string; alreadyRegistered?: boolean } = await res
        .json()
        .catch(() => ({}));

      // The confirmation animation only plays for an actual saved registration.
      if (res.ok && data?.success) {
        setStatus({
          tone: "success",
          message: "You're in. We'll ping you the moment C2C 7.0 opens.",
        });
        // Keep `submitting` locked so the button can't fire again during the
        // handoff; the close/reset effect above clears it.
        window.setTimeout(() => onSuccess(), 350);
        return;
      }

      if (res.status === 409 || data?.alreadyRegistered) {
        infoSubmission(ALREADY_REGISTERED_MESSAGE);
        return;
      }

      failSubmission(data?.error || "Couldn't save that. Try again in a moment.");
    } catch (err) {
      console.error("preregister save failed:", err);
      failSubmission("Network hiccup. Please try again.");
    }
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

      <form
        className={`c2c-prereg-form ${shaking ? "is-error-shake" : ""}`}
        onSubmit={handleSubmit}
        onAnimationEnd={(e) => {
          // c2c-prereg-form-flash is the reduced-motion variant of the shake.
          if (
            e.animationName === "c2c-prereg-form-shake" ||
            e.animationName === "c2c-prereg-form-flash"
          ) {
            setShaking(false);
          }
        }}
      >
        <header className="c2c-prereg-form__head">
          <p className="c2c-prereg-form__eyebrow">Join the list</p>
          <h2 className="c2c-prereg-form__title">Be first in line for C2C 7.0</h2>
          <p className="c2c-prereg-form__sub">
            Drop your details — we&apos;ll ping you the moment registrations open.
          </p>
        </header>
        {status.tone !== "idle" && (
          <p
            className="c2c-prereg-form__status"
            data-tone={status.tone}
            role={status.tone === "error" ? "alert" : "status"}
            aria-live="polite"
          >
            {status.message}
          </p>
        )}
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
            {submitting ? "Saving…" : status.tone === "success" ? "Saved" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
