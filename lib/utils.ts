// Shared helpers for both server and client components

export function stripHtml(input: string) {
  // Remove scripts/styles first
  const noScripts = input
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "");
  // Remove tags
  const noTags = noScripts.replace(/<\/?[^>]+(>|$)/g, " ");
  // Collapse whitespace
  return noTags.replace(/\s+/g, " ").trim();
}

/**
 * Format an RSS pubDate/ISO string to NL date.
 * Safe to use in client components.
 */
export function formatDate(input: string) {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;
  return d.toLocaleDateString("nl-NL", { year: "numeric", month: "long", day: "numeric" });
}

/**
 * Convert an iTunes duration string to rounded minutes.
 * Accepts "HH:MM:SS", "MM:SS", or seconds ("1234").
 */
export function minutesFromDuration(duration: string) {
  const s = duration.trim();

  // plain seconds
  if (/^\d+$/.test(s)) {
    const secs = Number(s);
    return Math.max(1, Math.round(secs / 60));
  }

  // HH:MM:SS or MM:SS
  const parts = s.split(":").map((p) => p.trim());
  if (parts.some((p) => p === "" || Number.isNaN(Number(p)))) return null;

  let secs = 0;
  if (parts.length === 3) {
    const [h, m, sec] = parts.map(Number);
    secs = h * 3600 + m * 60 + sec;
  } else if (parts.length === 2) {
    const [m, sec] = parts.map(Number);
    secs = m * 60 + sec;
  } else {
    return null;
  }

  return Math.max(1, Math.round(secs / 60));
}
