/*
Project: Mycelium
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
*/

import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

export type Story = {
  id: string;
  title: string;
  author: string;
  date: string;
  cover: string;
  description: string;
  tags: string[];
  html: string;
};

const STORIES_DIR = path.join(process.cwd(), "stories");

export async function getAllStories(): Promise<Story[]> {
  const entries = await fs.readdir(STORIES_DIR);
  const mdFiles = entries.filter((f) => f.endsWith(".md"));

  const stories = await Promise.all(
    mdFiles.map(async (file) => {
      const raw = await fs.readFile(path.join(STORIES_DIR, file), "utf8");
      const cleaned = raw.replace(/^<!--[\s\S]*?-->\s*/, "");
      const { data, content } = matter(cleaned);
      return {
        id: String(data.id ?? file.replace(/\.md$/, "")),
        title: String(data.title ?? "Untitled"),
        author: String(data.author ?? "Zorvia"),
        date: String(data.date ?? ""),
        cover: normalizeCoverPath(String(data.cover ?? "/covers/sample-cover.svg")),
        description: String(data.description ?? ""),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        html: marked.parse(content),
      } as Story;
    })
  );

  stories.sort((a, b) => b.date.localeCompare(a.date));
  return stories;
}

function normalizeCoverPath(cover: string): string {
  if (cover.startsWith("http://") || cover.startsWith("https://")) return cover;
  if (cover.startsWith("/")) return cover;
  return `/${cover}`;
}

export async function getStoryById(id: string): Promise<Story | null> {
  const stories = await getAllStories();
  return stories.find((s) => s.id === id) ?? null;
}

