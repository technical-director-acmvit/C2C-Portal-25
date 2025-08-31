"use client";

/**
 * cleanName
 * Removes trailing VIT registration numbers from a person's name string.
 * Examples:
 *  - "Ishaan Deepak Samdani 23BME0453" -> "Ishaan Deepak Samdani"
 *  - "Ishaan Samdani 23BME0453" -> "Ishaan Samdani"
 *  - "Alice Bob" -> "Alice Bob"
 *
 * Heuristics:
 *  - Trim whitespace and split on spaces.
 *  - Remove the last token if it looks like a registration number:
 *    - Common VIT pattern: 2 digits + 2-4 letters + 3-4 digits (e.g. 23BME0453)
 *    - Or a short alphanumeric token (6-12 chars) that contains at least one digit.
 */
export function cleanName(input?: string | null): string {
  if (!input) return "";
  const trimmed = String(input).trim();
  if (!trimmed) return "";

  const parts = trimmed.split(/\s+/);
  if (parts.length === 0) return trimmed;

  // sanitize trailing punctuation commonly used
  let last = parts[parts.length - 1].replace(/[.,;:]$/g, "");

  const vitPattern = /^[0-9]{2}[A-Za-z]{2,4}[0-9]{3,4}$/; // e.g. 23BME0453
  const shortAlnum = /^[A-Za-z0-9]{6,12}$/; // fallback: short alnum token

  if (vitPattern.test(last) || (shortAlnum.test(last) && /[0-9]/.test(last))) {
    parts.pop();
  }

  return parts.join(" ");
}

export default cleanName;
