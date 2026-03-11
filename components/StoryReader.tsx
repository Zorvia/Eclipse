/*
Project: Mycelium
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
*/

"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useCallback, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Story } from "@/lib/stories";

type Review = {
  id: string;
  storyId: string;
  rating: number;
  body: string;
  reviewerName?: string;
  createdAt: string;
};

function loadLocalReviews(storyId: string): Review[] {
  try {
    const all: Review[] = JSON.parse(localStorage.getItem("mycelium:reviews") || "[]");
    return all.filter((r) => r.storyId === storyId);
  } catch {
    return [];
  }
}

function saveLocalReview(review: Review) {
  try {
    const all: Review[] = JSON.parse(localStorage.getItem("mycelium:reviews") || "[]");
    all.unshift(review);
    localStorage.setItem("mycelium:reviews", JSON.stringify(all));
  } catch { /* ignore quota errors */ }
}

type Props = {
  story: Story;
  prevId: string | null;
  nextId: string | null;
};

export function StoryReader({ story, prevId, nextId }: Props) {
  const router = useRouter();
  const [fontSize, setFontSize] = useState(1.1);
  const [measure, setMeasure] = useState(72);
  const [progress, setProgress] = useState(0);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avg, setAvg] = useState(0);
  const [count, setCount] = useState(0);
  const [sortReviews, setSortReviews] = useState("newest");
  const [message, setMessage] = useState("");
  const readerRef = useRef<HTMLElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  const readerSize = useMemo(() => `${fontSize}rem`, [fontSize]);

  useEffect(() => {
    const size = Number(localStorage.getItem("reader-size") || 1.1);
    const meas = Number(localStorage.getItem("reader-measure") || 72);
    const mode = localStorage.getItem("reader-theme");
    setFontSize(Math.min(1.6, Math.max(0.9, size)));
    setMeasure(Math.min(82, Math.max(55, meas)));
    if (mode === "light") {
      setTheme("light");
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      setTheme("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    }

    const savedPos = Number(localStorage.getItem(`read-pos:${story.id}`) || 0);
    requestAnimationFrame(() => window.scrollTo({ top: savedPos }));
  }, [story.id]);

  useEffect(() => {
    localStorage.setItem("reader-size", String(fontSize));
    localStorage.setItem("reader-measure", String(measure));
  }, [fontSize, measure]);

  useEffect(() => {
    localStorage.setItem("reader-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => {
      const top = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.round((top / max) * 100) : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
      localStorage.setItem(`read-pos:${story.id}`, String(top));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [story.id]);

  const loadReviews = useCallback(() => {
    const all = loadLocalReviews(story.id);
    const sorted = sortReviews === "highest"
      ? [...all].sort((a, b) => b.rating !== a.rating ? b.rating - a.rating : b.createdAt.localeCompare(a.createdAt))
      : [...all].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    setReviews(sorted);
    if (all.length > 0) {
      const total = all.reduce((s, r) => s + r.rating, 0);
      setAvg(Math.round((total / all.length) * 10) / 10);
    } else {
      setAvg(0);
    }
    setCount(all.length);
  }, [story.id, sortReviews]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const formData = new FormData(event.currentTarget);
    const rating = Number(formData.get("rating") || 0);
    const body = String(formData.get("body") || "").replace(/[<>]/g, "").trim();
    const reviewerName = String(formData.get("reviewerName") || "Anonymous").replace(/[<>]/g, "").trim().slice(0, 40) || "Anonymous";

    if (rating < 1 || rating > 5 || body.length < 4 || body.length > 500) {
      setMessage("Invalid review. Rating 1-5, body 4-500 chars.");
      return;
    }

    const review: Review = {
      id: crypto.randomUUID(),
      storyId: story.id,
      rating,
      body,
      reviewerName,
      createdAt: new Date().toISOString(),
    };

    saveLocalReview(review);
    setMessage("Review posted.");
    loadReviews();
    event.currentTarget.reset();
  }

  function onTouchStart(e: React.TouchEvent<HTMLElement>) {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null;
  }

  function onTouchEnd(e: React.TouchEvent<HTMLElement>) {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(delta) < 60) return;
    if (delta < 0 && nextId) router.push(`/story/${nextId}`);
    if (delta > 0 && prevId) router.push(`/story/${prevId}`);
  }

  return (
    <>
      {/* Fixed progress bar at top */}
      <div className="progress-bar" style={{ width: `${progress}%` }} />

      <article className="panel reader" ref={readerRef as never} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <h1>{story.title}</h1>
        <div className="reader-meta">
          {story.author} · {story.date} · {story.description}
        </div>

        <div className="reader-tools">
          <button className="button" onClick={() => setFontSize((n) => Math.max(0.9, +(n - 0.1).toFixed(1)))} aria-label="Decrease font size">
            A−
          </button>
          <button className="button" onClick={() => setFontSize((n) => Math.min(1.6, +(n + 0.1).toFixed(1)))} aria-label="Increase font size">
            A+
          </button>
          <button className="button" onClick={() => setMeasure((n) => Math.max(55, n - 4))}>Narrow</button>
          <button className="button" onClick={() => setMeasure((n) => Math.min(82, n + 4))}>Wide</button>
          <button className="button" onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}>
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
          {prevId ? (
            <Link className="button" href={`/story/${prevId}`}>← Previous</Link>
          ) : null}
          {nextId ? (
            <Link className="button" href={`/story/${nextId}`}>Next →</Link>
          ) : null}
        </div>

        <section
          className="reader-body"
          style={{ ["--reader-size" as string]: readerSize, ["--measure" as string]: `${measure}ch` }}
          dangerouslySetInnerHTML={{ __html: story.html }}
        />

        <hr className="reader-divider" />

        <section aria-label="Reviews">
          <h2 style={{ marginTop: 0 }}>Reviews</h2>
          <p className="notice" style={{ marginBottom: "1rem" }}>
            {count > 0 ? (
              <>
                <span className="review-stars">{"★".repeat(Math.round(avg))}</span>{" "}
                {avg.toFixed(1)} / 5 · {count} {count === 1 ? "review" : "reviews"}
              </>
            ) : (
              "No reviews yet — be the first!"
            )}
          </p>

          <form className="review-form" onSubmit={handleSubmit}>
            <div className="controls-row">
              <input className="input" name="reviewerName" placeholder="Your name (optional)" maxLength={40} />
              <select className="select" name="rating" required>
                <option value="">★ Rating</option>
                <option value="5">★★★★★ (5)</option>
                <option value="4">★★★★☆ (4)</option>
                <option value="3">★★★☆☆ (3)</option>
                <option value="2">★★☆☆☆ (2)</option>
                <option value="1">★☆☆☆☆ (1)</option>
              </select>
              <select className="select" value={sortReviews} onChange={(e) => setSortReviews(e.target.value)}>
                <option value="newest">Newest first</option>
                <option value="highest">Highest rated</option>
              </select>
            </div>
            <textarea className="textarea" name="body" rows={3} minLength={4} maxLength={500} required placeholder="Write your review…" />
            <button className="button button-primary" type="submit">Post review</button>
            {message ? <div className={message.includes("posted") ? "success" : "error"}>{message}</div> : null}
          </form>

          <ul className="review-list">
            {reviews.map((r, i) => (
              <li className="review-item" key={r.id} style={{ animationDelay: `${0.05 * i}s` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>
                    <span className="review-stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>{" "}
                    <strong>{r.reviewerName || "Anonymous"}</strong>
                  </span>
                  <span className="notice">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="review-body">{r.body}</div>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </>
  );
}

