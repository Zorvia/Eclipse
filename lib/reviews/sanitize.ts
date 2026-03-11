/*
Project: Mycelium
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
*/

const BAD_WORDS = ["buy now", "free money", "click here", "casino", "viagra"];

export function sanitizeBody(input: string): string {
  return input.replace(/[<>]/g, "").trim();
}

export function isLikelySpam(input: string): boolean {
  const lower = input.toLowerCase();
  return BAD_WORDS.some((word) => lower.includes(word));
}

