"use client";

import Image from "next/image";
import { useId, useState } from "react";

function toDomId(value: string) {
  return value.replace(/[^A-Za-z0-9_-]/g, "_");
}

type ReturnAnnouncementProps = {
  active: boolean;
  onToggle: () => void;
};

const SECTORS = [
  {
    className: "c2c-upcoming-sector c2c-upcoming-sector--date",
    labelClassName: "c2c-upcoming-label c2c-upcoming-label--date",
    eyebrow: "Date",
    value: "September",
  },
  {
    className: "c2c-upcoming-sector c2c-upcoming-sector--venue",
    labelClassName: "c2c-upcoming-label c2c-upcoming-label--venue",
    eyebrow: "Venue",
    value: "Anna Audi",
  },
  {
    className: "c2c-upcoming-sector c2c-upcoming-sector--campus",
    labelClassName: "c2c-upcoming-label c2c-upcoming-label--campus",
    eyebrow: "Campus",
    value: "VIT Vellore",
  },
  {
    className: "c2c-upcoming-sector c2c-upcoming-sector--state",
    labelClassName: "c2c-upcoming-label c2c-upcoming-label--state",
    eyebrow: "State",
    value: "Tamil Nadu",
  },
  {
    className: "c2c-upcoming-sector c2c-upcoming-sector--cutout",
    labelClassName: "c2c-upcoming-label c2c-upcoming-label--cutout",
    eyebrow: "Coming",
    value: "September 2026",
  },
  {
    className: "c2c-upcoming-sector c2c-upcoming-sector--return",
    labelClassName: "c2c-upcoming-label c2c-upcoming-label--return",
    eyebrow: "Return",
    value: "C2C 6.0",
  },
];

function GlassDistortion({ id }: { id: string }) {
  return (
    <svg
      className="c2c-upcoming-filter"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
    >
      <defs>
        <filter id={id}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.012"
            numOctaves="2"
            seed="18"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="1.8" result="softNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softNoise"
            scale="34"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}

export default function ReturnAnnouncement({ active, onToggle }: ReturnAnnouncementProps) {
  const [hovered, setHovered] = useState(false);
  const [suppressHoverGlass, setSuppressHoverGlass] = useState(false);
  const filterId = `c2c-upcoming-glass-${toDomId(useId())}`;
  const showingGlass = hovered && !active && !suppressHoverGlass;
  const showingOverlay = showingGlass || active;

  const handleHoverStart = () => {
    if (!active && !suppressHoverGlass) {
      setHovered(true);
    }
  };

  const handleHoverEnd = () => {
    setHovered(false);
    setSuppressHoverGlass(false);
  };

  const handleClick = () => {
    setHovered(false);
    setSuppressHoverGlass(true);
    onToggle();
  };

  return (
    <div className={`c2c-upcoming ${active ? "is-active" : ""}`}>
      <GlassDistortion id={filterId} />

      <div
        className={`c2c-upcoming-overlay ${showingOverlay ? "is-visible" : ""} ${
          showingGlass ? "is-glass" : ""
        } ${
          active ? "is-active" : ""
        }`}
        aria-hidden={!active}
        style={{
          WebkitBackdropFilter: showingGlass
            ? `url(#${filterId}) blur(12px) saturate(150%)`
            : "none",
          backdropFilter: showingGlass
            ? `url(#${filterId}) blur(12px) saturate(150%)`
            : "none",
        }}
      >
        <div className="c2c-upcoming-overlay__tint" />
        <div className="c2c-upcoming-overlay__shine" />

        <div className="c2c-upcoming-stage" aria-hidden={!active}>
          <div className="c2c-upcoming-sector-layer">
            {SECTORS.map((item) => (
              <div key={item.className} className={item.className} />
            ))}
          </div>
          <div className="c2c-upcoming-logo-wrap">
            <Image
              src="/landing/C2C Logo.svg"
              alt=""
              width={265}
              height={299}
              priority
              className="c2c-upcoming-logo"
            />
          </div>
          <div className="c2c-upcoming-label-layer">
            {SECTORS.map((item) => (
              <div key={item.labelClassName} className={item.labelClassName}>
                <span>{item.eyebrow}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        className={`c2c-upcoming-button ${active ? "is-active" : ""}`}
        onMouseEnter={handleHoverStart}
        onMouseLeave={handleHoverEnd}
        onFocus={handleHoverStart}
        onBlur={handleHoverEnd}
        onClick={handleClick}
        aria-pressed={active}
        aria-label={active ? "Close upcoming announcement" : "See upcoming announcement"}
      >
        <span className="c2c-upcoming-button__effect" />
        <span className="c2c-upcoming-button__tint" />
        <span className="c2c-upcoming-button__shine" />
        <span className="c2c-upcoming-button__content">
          {active ? "Back to site" : "See upcoming"}
        </span>
      </button>
    </div>
  );
}
