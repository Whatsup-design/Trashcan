export function formatNameForPassword(fullName: string): string {
  if (!fullName) return "";

  // common honorifics/titles to remove (case-insensitive)
  const honorifics = [
    "mr",
    "mrs",
    "miss",
    "ms",
    "master",
    "dr",
    "sir",
    "lady",
    "prof",
    "professor",
    "rev",
    "fr",
  ];

  // normalize whitespace and remove surrounding punctuation
  let s = String(fullName).trim();

  // remove periods after initials/titles (e.g., "Mr.")
  s = s.replace(/\.+/g, "");

  // split into tokens and filter out honorifics
  const tokens = s
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
    .filter((t) => !honorifics.includes(t.toLowerCase()));

  // if no tokens left, return empty
  if (tokens.length === 0) return "";

  // join remaining parts without spaces and remove any non-letter/number characters
  const joined = tokens.join("");
  const cleaned = joined.replace(/[^\p{L}\p{N}]/gu, "");

  return cleaned;
}
