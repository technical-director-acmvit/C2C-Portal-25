// Centralized environment flag handling for public runtime config
// NEXT_PUBLIC_* vars are replaced at build-time by Next.js

/**
 * Whether registrations are open.
 * Accepts: "true"/"1" (case-insensitive) as true, everything else false.
 */
export const REGISTRATIONS_OPEN: boolean = (() => {
  const v = (process.env.NEXT_PUBLIC_REGISTRATIONS_OPEN ?? "").toString().trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes" || v === "on";
})();

/**
 * Whether signups are over (blocks proceeding past the welcome screen).
 * Primary flag: NEXT_PUBLIC_SIGNUPS_OVER.
 * If not set, falls back to the inverse of REGISTRATIONS_OPEN.
 */
export const SIGNUPS_OVER: boolean = (() => {
  const v = (process.env.NEXT_PUBLIC_SIGNUPS_OVER ?? "").toString().trim().toLowerCase();
  if (v === "true" || v === "1" || v === "yes" || v === "on") return true;
  if (v === "false" || v === "0" || v === "no" || v === "off") return false;
  return !REGISTRATIONS_OPEN;
})();

/**
 * Whether the portal is enabled (shows auth + portal screens) or in Coming Soon mode.
 * Accepts: "true"/"1"/"yes"/"on" (case-insensitive) as true, everything else false.
 * When false, the /portal route shows a Coming Soon page without any auth gating.
 */
export const PORTAL_ENABLED: boolean = (() => {
  const v = (process.env.NEXT_PUBLIC_PORTAL_ENABLED ?? "").toString().trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes" || v === "on";
})();

/**
 * Whether whitelist enforcement is enabled for the portal.
 * Accepts: "true"/"1"/"yes"/"on" (case-insensitive) as true, everything else false.
 */
export const WHITELIST_ENABLED: boolean = (() => {
  const v = (process.env.NEXT_PUBLIC_WHITELIST_ENABLED ?? "").toString().trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes" || v === "on";
})();

/**
 * Whether the HKBox component should be displayed in the profile.
 * Accepts: "true"/"1"/"yes"/"on" (case-insensitive) as true, everything else false.
 */
export const HK_ENABLED: boolean = (() => {
  const v = (process.env.NEXT_PUBLIC_HK_ENABLED ?? "").toString().trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes" || v === "on";
})();

/**
 * Public Discord invite URL. Can be overridden via NEXT_PUBLIC_DISCORD_URL.
 */
export const DISCORD_URL: string =
  (process.env.NEXT_PUBLIC_DISCORD_URL || "").toString().trim() ||
  "https://discord.com/invite/CY2sygnhYk";

export const PROMOTIONS_LIVE: boolean = (() => {
  const v = (process.env.NEXT_PUBLIC_PROMOTIONS_LIVE ?? "").toString().trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes" || v === "on";
})();
