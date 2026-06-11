"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";

function toDomId(value: string) {
	return value.replace(/[^A-Za-z0-9_-]/g, "_");
}

type ReturnAnnouncementProps = {
	active: boolean;
	onToggle: () => void;
};

// Logo C2C Logo.svg (no rotation) has 6 hexagon sectors with these colors,
// indexed by their centre compass angle (CW from north):
//   30°  (NE, TopCenter↔UpperRight): #86CCAC
//   90°  (E,  UpperRight↔LowerRight): cutout — #2C2C2C
//   150° (SE, LowerRight↔BottomCenter): #5EBF94
//   210° (SW, BottomCenter↔LowerLeft): #ADDBC8
//   270° (W,  LowerLeft↔UpperLeft): #48BA86
//   330° (NW, UpperLeft↔TopCenter): #D3EBE0
// At the end of the takeover animation the logo is rotated 90° clockwise,
// so each logo sector maps to a screen direction 90° further around.
type Sector = {
	key: string;
	centerDeg: number;
	color: string;
	delay: string;
	eyebrow: string;
	value: string;
};

const SECTORS: Sector[] = [
	{ key: "venue", centerDeg: 0, color: "rgba(72, 186, 134, 0.84)", delay: "460ms", eyebrow: "Venue", value: "Anna Audi" },
	{ key: "campus", centerDeg: 60, color: "rgba(211, 235, 224, 0.84)", delay: "510ms", eyebrow: "Return", value: "C2C 7.0" },
	{ key: "state", centerDeg: 120, color: "rgba(134, 204, 172, 0.84)", delay: "560ms", eyebrow: "State", value: "Tamil Nadu, India" },
	{ key: "cutout", centerDeg: 180, color: "rgba(44, 44, 44, 0.84)", delay: "610ms", eyebrow: "Coming", value: "September 2026" },
	{ key: "date", centerDeg: 240, color: "rgba(94, 191, 148, 0.84)", delay: "660ms", eyebrow: "Campus", value: "VIT Vellore" },
	{ key: "return", centerDeg: 300, color: "rgba(173, 219, 200, 0.84)", delay: "710ms", eyebrow: "Flagship Event", value: "ACM-VIT" },
];

type SectorGeometry = {
	clipPath: string;
	labelX: number;
	labelY: number;
};

const TWO_PI = Math.PI * 2;
const HALF_SECTOR = Math.PI / 6; // 30°

function rayToEdge(
	angleRad: number,
	cx: number,
	cy: number,
	width: number,
	height: number,
): [number, number] {
	const sx = Math.sin(angleRad);
	const sy = -Math.cos(angleRad);
	let t = Infinity;
	const eps = 1e-9;
	if (sx > eps) t = Math.min(t, (width - cx) / sx);
	if (sx < -eps) t = Math.min(t, -cx / sx);
	if (sy > eps) t = Math.min(t, (height - cy) / sy);
	if (sy < -eps) t = Math.min(t, -cy / sy);
	return [cx + t * sx, cy + t * sy];
}

function angleFromCenter(px: number, py: number, cx: number, cy: number): number {
	let a = Math.atan2(px - cx, cy - py);
	if (a < 0) a += TWO_PI;
	return a;
}

function computeGeometry(width: number, height: number): SectorGeometry[] {
	const cx = width / 2;
	const cy = height / 2;
	const corners = [
		{ x: width, y: 0 },
		{ x: width, y: height },
		{ x: 0, y: height },
		{ x: 0, y: 0 },
	].map((c) => ({ ...c, angle: angleFromCenter(c.x, c.y, cx, cy) }));

	// Reserve padding so labels do not run off-screen or collide with the
	// bottom button. Cutout (south wedge) gets extra bottom reserve.
	const minDim = Math.min(width, height);
	const estimatedLabelHalf = Math.min(width * 0.2, Math.max(72, minDim * 0.18));
	const padX = Math.max(estimatedLabelHalf + 12, width * 0.055);
	const padY = Math.max(68, height * 0.06);
	const buttonReserve = Math.max(170, Math.min(260, height * 0.22));

	return SECTORS.map((sector) => {
		const centerAngle = (sector.centerDeg * Math.PI) / 180;
		const startAngle = centerAngle - HALF_SECTOR;
		const endAngle = centerAngle + HALF_SECTOR;
		const startPt = rayToEdge(startAngle, cx, cy, width, height);
		const endPt = rayToEdge(endAngle, cx, cy, width, height);

		const s = ((startAngle % TWO_PI) + TWO_PI) % TWO_PI;
		let e = ((endAngle % TWO_PI) + TWO_PI) % TWO_PI;
		if (e <= s) e += TWO_PI;

		const cornersInRange = corners
			.map((corner) => {
				let ca = corner.angle;
				if (ca < s) ca += TWO_PI;
				return { x: corner.x, y: corner.y, sortAngle: ca };
			})
			.filter((c) => c.sortAngle > s + 1e-6 && c.sortAngle < e - 1e-6)
			.sort((a, b) => a.sortAngle - b.sortAngle);

		const points: [number, number][] = [[cx, cy], startPt];
		cornersInRange.forEach((c) => points.push([c.x, c.y]));
		points.push(endPt);

		const clipPath = `polygon(${points
			.map(([x, y]) => `${x.toFixed(2)}px ${y.toFixed(2)}px`)
			.join(", ")})`;

		// Position the label along the wedge's angular bisector at a fraction of
		// the bisector ray's length. Doing this (rather than using the polygon
		// centroid) keeps the label on the wedge's axis of symmetry, so it does
		// not lean toward a corner and spill into the neighbouring wedge on
		// narrow viewports (e.g. Galaxy Z Fold 5 outer screen).
		const bisectorExit = rayToEdge(centerAngle, cx, cy, width, height);
		const fractionBySector: Record<string, number> = {
			venue: minDim < 480 ? 0.58 : 0.64,
			campus: minDim < 480 ? 0.58 : 0.64,
			state: minDim < 480 ? 0.56 : 0.62,
			cutout: minDim < 480 ? 0.43 : 0.5,
			date: minDim < 480 ? 0.56 : 0.62,
			return: minDim < 480 ? 0.58 : 0.64,
		};
		const fraction = fractionBySector[sector.key] ?? (minDim < 480 ? 0.58 : 0.64);
		let labelX = cx + fraction * (bisectorExit[0] - cx);
		let labelY = cy + fraction * (bisectorExit[1] - cy);

		labelX = Math.max(padX, Math.min(width - padX, labelX));
		const bottomReserve = sector.key === "cutout" ? Math.max(padY, buttonReserve) : padY;
		labelY = Math.max(padY, Math.min(height - bottomReserve, labelY));

		return { clipPath, labelX, labelY };
	});
}

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
	const [geometry, setGeometry] = useState<SectorGeometry[]>([]);
	const filterId = `c2c-upcoming-glass-${toDomId(useId())}`;
	const showingGlass = hovered && !active && !suppressHoverGlass;
	const showingOverlay = showingGlass || active;

	useEffect(() => {
		if (typeof window === "undefined") return;
		const update = () =>
			setGeometry(computeGeometry(window.innerWidth, window.innerHeight));
		update();
		window.addEventListener("resize", update);
		return () => window.removeEventListener("resize", update);
	}, []);

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
				className={`c2c-upcoming-overlay ${showingOverlay ? "is-visible" : ""} ${showingGlass ? "is-glass" : ""
					} ${active ? "is-active" : ""}`}
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
						{SECTORS.map((sector, i) => {
							const geo = geometry[i];
							return (
								<div
									key={sector.key}
									className={`c2c-upcoming-sector c2c-upcoming-sector--${sector.key}`}
									style={{
										background: sector.color,
										clipPath: geo?.clipPath,
										WebkitClipPath: geo?.clipPath,
										transitionDelay: `${sector.delay}, ${sector.delay}`,
									}}
								/>
							);
						})}
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
						{SECTORS.map((sector, i) => {
							const geo = geometry[i];
							return (
								<div
									key={sector.key}
									className={`c2c-upcoming-label c2c-upcoming-label--${sector.key}`}
									style={{
										left: geo ? `${geo.labelX}px` : "50%",
										top: geo ? `${geo.labelY}px` : "50%",
									}}
								>
									<span>{sector.eyebrow}</span>
									<strong>{sector.value}</strong>
								</div>
							);
						})}
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
					{active ? "Back to site" : "See upcoming Edition"}
				</span>
			</button>
		</div>
	);
}
