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
 * Public Discord invite URL. Can be overridden via NEXT_PUBLIC_DISCORD_URL.
 */
export const DISCORD_URL: string =
  (process.env.NEXT_PUBLIC_DISCORD_URL || "").toString().trim() ||
  "https://discord.com/invite/CY2sygnhYk";
