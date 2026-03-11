/*
Project: Mycelium
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
*/

import { describe, expect, it } from "vitest";
import { parseReviewPayload } from "@/lib/reviews/validate";

describe("review payload parsing", () => {
  it("accepts valid payload", () => {
    const result = parseReviewPayload({ storyId: "the-open-door", rating: 5, body: "Great read!" });
    expect(result.ok).toBe(true);
  });

  it("rejects invalid rating", () => {
    const result = parseReviewPayload({ storyId: "x", rating: 9, body: "Invalid" });
    expect(result.ok).toBe(false);
  });

  it("strips html brackets", () => {
    const result = parseReviewPayload({ storyId: "x", rating: 4, body: "<b>hello</b> world" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.body.includes("<")).toBe(false);
      expect(result.value.body.includes(">" )).toBe(false);
    }
  });
});
