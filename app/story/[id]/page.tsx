/*
Project: Mycelium
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
*/

import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllStories, getStoryById } from "@/lib/stories";
import { StoryReader } from "@/components/StoryReader";

export async function generateStaticParams() {
  const stories = await getAllStories();
  return stories.map((story) => ({ id: story.id }));
}

export default async function StoryPage({ params }: { params: { id: string } }) {
  const found = await getStoryById(params.id);
  if (!found) notFound();
  const story = found;

  const all = await getAllStories();
  const idx = all.findIndex((s) => s.id === story.id);
  const prevId = idx > 0 ? all[idx - 1].id : null;
  const nextId = idx >= 0 && idx < all.length - 1 ? all[idx + 1].id : null;

  return (
    <main className="shell">
      <header className="topbar">
        <Link className="button" href="/">
          ← Library
        </Link>
        <div className="notice">{story.author}</div>
      </header>

      <StoryReader story={story} prevId={prevId} nextId={nextId} />

      <footer className="footer">
        Mycelium · Licensed under ZPL v2.0
      </footer>
    </main>
  );
}
