/*
Project: Mycelium
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
*/

export type Review = {
  id: string;
  storyId: string;
  rating: number;
  body: string;
  reviewerName?: string;
  moderationStatus: "visible" | "flagged";
  createdAt: string;
};

export type ReviewStats = {
  avgRating: number;
  count: number;
};

export type ReviewStore = {
  saveReview(review: Review): Promise<void>;
  getReviews(storyId: string): Promise<Review[]>;
  deleteReview(id: string): Promise<boolean>;
};

