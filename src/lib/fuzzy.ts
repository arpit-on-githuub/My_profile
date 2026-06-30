/* Lightweight fuzzy matching for command suggestions & typo tolerance. */

/** Classic Levenshtein edit distance. */
export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const prev = new Array(n + 1);
  const curr = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= n; j++) prev[j] = curr[j];
  }
  return prev[n];
}

/** Similarity in [0,1] based on edit distance. */
export function similarity(a: string, b: string): number {
  const dist = levenshtein(a, b);
  const max = Math.max(a.length, b.length) || 1;
  return 1 - dist / max;
}

/** Subsequence test ("vp" matches "visit projects"). */
export function isSubsequence(needle: string, haystack: string): boolean {
  let i = 0;
  for (let j = 0; j < haystack.length && i < needle.length; j++) {
    if (needle[i] === haystack[j]) i++;
  }
  return i === needle.length;
}

export interface RankedMatch {
  value: string;
  score: number;
}

/** Rank candidates against a query using prefix, subsequence, and edit distance. */
export function rankMatches(query: string, candidates: string[]): RankedMatch[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return candidates
    .map((value) => {
      const c = value.toLowerCase();
      let score = 0;
      if (c === q) score = 1;
      else if (c.startsWith(q)) score = 0.9;
      else if (c.includes(q)) score = 0.75;
      else if (isSubsequence(q, c)) score = 0.6;
      else score = similarity(q, c) * 0.55;
      return { value, score };
    })
    .filter((m) => m.score > 0.34)
    .sort((a, b) => b.score - a.score);
}

/** Best fuzzy match above a threshold, or null. */
export function bestMatch(
  query: string,
  candidates: string[],
  threshold = 0.62,
): string | null {
  const ranked = rankMatches(query, candidates);
  if (ranked.length && ranked[0].score >= threshold) return ranked[0].value;
  return null;
}
