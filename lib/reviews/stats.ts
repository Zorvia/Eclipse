/*
Project: Mycelium
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
*/

import type { Review, ReviewStats } from "@/lib/reviews/types";

export function buildStats(reviews: Review[]): ReviewStats {
  if (reviews.length === 0) {
    return { avgRating: 0, count: 0 };
  }

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return {
    avgRating: Math.round((total / reviews.length) * 10) / 10,
    count: reviews.length,
  };
}

export function sortReviews(reviews: Review[], mode: "newest" | "highest") {
  const output = [...reviews];
  if (mode === "highest") {
    output.sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.createdAt.localeCompare(a.createdAt);
    });
  } else {
    output.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  return output;
}

