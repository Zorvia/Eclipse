/*
Project: Mycelium
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
*/

import { describe, expect, it } from "vitest";
import { buildStats, sortReviews } from "@/lib/reviews/stats";
import { isLikelySpam, sanitizeBody } from "@/lib/reviews/sanitize";

describe("review stats", () => {
  it("builds average and count", () => {
    const stats = buildStats([
      { id: "1", storyId: "s", rating: 5, body: "a", moderationStatus: "visible", createdAt: "2026-01-01" },
      { id: "2", storyId: "s", rating: 3, body: "b", moderationStatus: "visible", createdAt: "2026-01-02" },
    ] as never);

    expect(stats.avgRating).toBe(4);
    expect(stats.count).toBe(2);
  });

  it("sorts by highest", () => {
    const sorted = sortReviews([
      { id: "1", storyId: "s", rating: 3, body: "a", moderationStatus: "visible", createdAt: "2026-01-03" },
      { id: "2", storyId: "s", rating: 5, body: "b", moderationStatus: "visible", createdAt: "2026-01-02" },
    ] as never, "highest");

    expect(sorted[0].id).toBe("2");
  });

  it("sanitizes tags and catches spam phrase", () => {
    expect(sanitizeBody("<script>x</script>hello")).toBe("scriptx/scripthello");
    expect(isLikelySpam("You can get free money right now")).toBe(true);
  });
});

