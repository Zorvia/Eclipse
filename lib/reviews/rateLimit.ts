/*
Project: Mycelium
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
*/

const limits = new Map<string, { count: number; resetAt: number }>();

export function hitRateLimit(key: string, maxPerMinute = 5): boolean {
  const now = Date.now();
  const found = limits.get(key);

  if (!found || found.resetAt < now) {
    limits.set(key, { count: 1, resetAt: now + 60_000 });
    return false;
  }

  found.count += 1;
  if (found.count > maxPerMinute) {
    return true;
  }

  return false;
}

