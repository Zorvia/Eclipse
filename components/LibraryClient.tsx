/*
Project: Mycelium
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
*/

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Story } from "@/lib/stories";

type Props = { stories: Story[] };

export function LibraryClient({ stories }: Props) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = stories.filter((story) => {
      const hay = `${story.title} ${story.author} ${story.tags.join(" ")}`.toLowerCase();
      return q.length === 0 || hay.includes(q);
    });

    list.sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      return b.date.localeCompare(a.date);
    });

    return list;
  }, [stories, query, sort]);

  return (
    <>
      <section className="panel controls" aria-label="Library controls">
        <div className="controls-row">
          <input
            aria-label="Search stories"
            className="input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, author, tags…"
          />
          <select
            className="select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort stories"
          >
            <option value="newest">Sort: Newest</option>
            <option value="title">Sort: Title</option>
          </select>
        </div>
        <div className="notice">{filtered.length} {filtered.length === 1 ? "story" : "stories"}</div>
      </section>

      <section className="grid" aria-label="Stories grid">
        {filtered.map((story, i) => (
          <article
            key={story.id}
            className="card"
            style={{ animationDelay: `${0.06 * i}s` }}
          >
            <img className="card-cover" src={story.cover} alt={`Cover art for ${story.title}`} loading="lazy" />
            <div className="card-body">
              <div className="card-title">{story.title}</div>
              <div className="card-meta">{story.author} · {story.date}</div>
              <div>
                {story.tags.map((tag) => (
                  <span className="tag" key={`${story.id}-${tag}`}>{tag}</span>
                ))}
              </div>
              <Link className="button button-primary" href={`/story/${story.id}`}>
                Read story →
              </Link>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

