/*
Project: Mycelium
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
*/

import { NextRequest, NextResponse } from "next/server";
import { getReviewStore } from "@/lib/reviews/store";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const adminToken = req.headers.get("x-admin-token") || "";
  const expected = process.env.REVIEW_ADMIN_TOKEN || "";

  if (!expected || adminToken !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = getReviewStore();
  const ok = await store.deleteReview(params.id);
  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
