/*
Project: Mycelium
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
*/

import { NextRequest, NextResponse } from "next/server";
import { hitRateLimit } from "@/lib/reviews/rateLimit";
import { isLikelySpam } from "@/lib/reviews/sanitize";
import { getReviewStore } from "@/lib/reviews/store";
import { buildStats, sortReviews } from "@/lib/reviews/stats";
import { parseReviewPayload } from "@/lib/reviews/validate";
import type { Review } from "@/lib/reviews/types";

function reviewerIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function GET(req: NextRequest) {
  const storyId = req.nextUrl.searchParams.get("storyId") ?? "";
  const sort = req.nextUrl.searchParams.get("sort") ?? "newest";

  if (!storyId) {
    return NextResponse.json({ error: "storyId is required" }, { status: 400 });
  }

  const store = getReviewStore();
  const reviews = await store.getReviews(storyId);
  const visible = reviews.filter((r) => r.moderationStatus === "visible");
  const sorted = sortReviews(visible, sort === "highest" ? "highest" : "newest");

  return NextResponse.json({
    reviews: sorted,
    stats: buildStats(visible),
  });
}

export async function POST(req: NextRequest) {
  const ip = reviewerIp(req);
  if (hitRateLimit(`post:${ip}`, Number(process.env.RATE_LIMIT_PER_MINUTE || 6))) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = parseReviewPayload(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { storyId, rating, body: reviewBody, reviewerName } = parsed.value;

  const review: Review = {
    id: crypto.randomUUID(),
    storyId,
    rating,
    body: reviewBody,
    reviewerName: reviewerName || "Anonymous",
    moderationStatus: isLikelySpam(reviewBody) ? "flagged" : "visible",
    createdAt: new Date().toISOString(),
  };

  const store = getReviewStore();
  try {
    await store.saveReview(review);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to save review";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  return NextResponse.json({ review }, { status: 201 });
}

