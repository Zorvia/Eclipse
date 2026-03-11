#!/usr/bin/env node

/*
Project: Mycelium
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
*/

/**
 * build.js — Converts stories/*.md → stories/*.html (HTML fragments)
 * and generates stories/manifest.json.
 *
 * Usage: node scripts/build.js
 * Requires: npm install (installs "marked")
 */

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const ROOT = join(__filename, '..', '..');
const STORIES_DIR = join(ROOT, 'stories');

/** Parse YAML-ish frontmatter between --- delimiters */
function parseFrontmatter(raw) {
  const match = raw.match(/^\s*(?:<!--[\s\S]*?-->\s*)?---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { meta: {}, content: raw };

  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    // Handle quoted strings
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    // Handle arrays like ["a", "b"]
    if (value.startsWith('[') && value.endsWith(']')) {
      try {
        value = JSON.parse(value);
      } catch {
        // leave as string
      }
    }
    meta[key] = value;
  }

  const content = raw.slice(match[0].length).trim();
  return { meta, content };
}

async function build() {
  console.log('Building stories…');

  const files = (await readdir(STORIES_DIR)).filter(f => extname(f) === '.md');

  if (files.length === 0) {
    console.warn('No .md files found in stories/');
    return;
  }

  const manifest = [];

  for (const file of files) {
    const raw = await readFile(join(STORIES_DIR, file), 'utf-8');
    const { meta, content } = parseFrontmatter(raw);
    const slug = basename(file, '.md');

    // Convert Markdown to HTML
    const html = marked.parse(content);

    const htmlFile = `${slug}.html`;
    await writeFile(join(STORIES_DIR, htmlFile), html, 'utf-8');
    console.log(`  ✔ ${file} → ${htmlFile}`);

    manifest.push({
      id: meta.id || slug,
      title: meta.title || slug,
      author: meta.author || 'Unknown',
      date: meta.date || '',
      cover: meta.cover || `assets/covers/${slug}.svg`,
      tags: Array.isArray(meta.tags) ? meta.tags : [],
      htmlPath: `stories/${htmlFile}`,
    });
  }

  // Sort by date descending (newest first)
  manifest.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  await writeFile(
    join(STORIES_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2),
    'utf-8'
  );

  console.log(`\nManifest written with ${manifest.length} stories.`);
  console.log('Build complete.');
}

build().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});

