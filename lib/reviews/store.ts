/*
Project: Mycelium
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
*/

import fs from "node:fs/promises";
import path from "node:path";
import type { Review, ReviewStore } from "@/lib/reviews/types";

const FILE_PATH = path.join(process.cwd(), "data", "reviews.json");

class FileReviewStore implements ReviewStore {
  async readAll(): Promise<Review[]> {
    try {
      const raw = await fs.readFile(FILE_PATH, "utf8");
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  async writeAll(reviews: Review[]): Promise<void> {
    try {
      await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
      await fs.writeFile(FILE_PATH, JSON.stringify(reviews, null, 2), "utf8");
    } catch {
      throw new Error("Cannot write reviews. Configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN for persistent storage.");
    }
  }

  async saveReview(review: Review): Promise<void> {
    const all = await this.readAll();
    all.unshift(review);
    await this.writeAll(all);
  }

  async getReviews(storyId: string): Promise<Review[]> {
    const all = await this.readAll();
    return all.filter((r) => r.storyId === storyId);
  }

  async deleteReview(id: string): Promise<boolean> {
    const all = await this.readAll();
    const before = all.length;
    const next = all.filter((r) => r.id !== id);
    if (next.length === before) return false;
    await this.writeAll(next);
    return true;
  }
}

let singleton: ReviewStore | null = null;

export function getReviewStore(): ReviewStore {
  if (singleton) return singleton;
  singleton = new FileReviewStore();
  return singleton;
}

