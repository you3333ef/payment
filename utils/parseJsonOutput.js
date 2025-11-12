/**
 * Safe JSON parsing utility to handle single object, array, or NDJSON inputs
 * Prevents "Cannot coerce the result to a single JSON object" errors
 *
 * @param {string} raw - Raw JSON string to parse
 * @returns {object} - Parsed object with consistent structure
 */
function parseJsonOutput(raw) {
  if (!raw) return { items: [] };

  // Try direct JSON.parse
  try {
    const v = JSON.parse(raw);
    if (Array.isArray(v)) return { items: v };
    if (typeof v === 'object') return v;
  } catch (e) {
    // try NDJSON (one JSON object per line)
    const lines = raw.trim().split(/\r?\n/).filter(Boolean);
    if (lines.length > 0) {
      try {
        const parsed = lines.map(l => JSON.parse(l));
        return { items: parsed };
      } catch (ee) {
        // fallback: return raw as string
        return { raw: raw };
      }
    }
  }
  return { raw: raw };
}

module.exports = { parseJsonOutput };
