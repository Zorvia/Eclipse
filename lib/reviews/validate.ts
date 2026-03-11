/*
Project: Mycelium
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
*/

import { sanitizeBody } from "@/lib/reviews/sanitize";

export type ReviewPayload = {
  storyId: string;
  rating: number;
  body: string;
  reviewerName?: string;
};

export function parseReviewPayload(input: unknown): { ok: true; value: ReviewPayload } | { ok: false } {
  const body = input as Record<string, unknown>;

  const storyId = sanitizeBody(String(body?.storyId ?? "")).trim();
  const rating = Number(body?.rating ?? 0);
  const text = sanitizeBody(String(body?.body ?? ""));
  const reviewerName = sanitizeBody(String(body?.reviewerName ?? "Anonymous")).slice(0, 40);

  if (!storyId || rating < 1 || rating > 5 || text.length < 4 || text.length > 500) {
    return { ok: false };
  }

  return {
    ok: true,
    value: {
      storyId,
      rating,
      body: text,
      reviewerName: reviewerName || "Anonymous",
    },
  };
}
