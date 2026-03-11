/*
Project: Mycelium
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
*/

/** app.js — Main entry point for Mycelium library. */
import { initReader, openStory } from './reader.js';

const THEME_KEY = 'mycelium-theme';
const MANIFEST_PATH = 'stories/manifest.json';

const state = {
  stories: [],
  filtered: [],
  query: '',
  tag: 'all',
  sort: 'newest',
};

/** Apply saved theme or respect system preference */
function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');

  // Dark-first experience unless user explicitly saved light mode.
  if (saved === 'light') {
    root.setAttribute('data-theme', 'light');
  } else {
    root.setAttribute('data-theme', 'dark');
  }

  const updateToggleCopy = () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    toggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    toggle.setAttribute('title', isLight ? 'Switch to dark mode' : 'Switch to light mode');
  };
  updateToggleCopy();

  toggle.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    if (isLight) {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
      localStorage.setItem(THEME_KEY, 'light');
    }
    updateToggleCopy();
  });
}

/** Create a card element for a story */
function createCard(story) {
  const li = document.createElement('li');

  const card = document.createElement('article');
  card.className = 'card';
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `Read "${story.title}" by ${story.author}`);

  const img = document.createElement('img');
  img.className = 'card__cover';
  img.src = story.cover;
  img.alt = `Cover art for "${story.title}"`;
  img.loading = 'lazy';
  img.width = 300;
  img.height = 400;
  card.appendChild(img);

  const info = document.createElement('div');
  info.className = 'card__info';

  const title = document.createElement('h2');
  title.className = 'card__title';
  title.textContent = story.title;
  info.appendChild(title);

  const author = document.createElement('p');
  author.className = 'card__author';
  author.textContent = story.author;
  info.appendChild(author);

  const date = document.createElement('p');
  date.className = 'card__date';
  date.textContent = story.date || '';
  info.appendChild(date);

  if (story.tags && story.tags.length) {
    const tags = document.createElement('div');
    tags.className = 'card__tags';
    tags.setAttribute('aria-label', 'Tags');
    for (const tag of story.tags) {
      const span = document.createElement('span');
      span.className = 'card__tag';
      span.textContent = tag;
      tags.appendChild(span);
    }
    info.appendChild(tags);
  }

  card.appendChild(info);

  // Interaction handlers
  const activate = () => openStory(story._index, card);
  card.addEventListener('click', activate);
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      activate();
    }
  });

  li.appendChild(card);
  return li;
}

function sortStories(stories) {
  const output = [...stories];
  switch (state.sort) {
    case 'oldest':
      output.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
      break;
    case 'title-asc':
      output.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      break;
    case 'title-desc':
      output.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
      break;
    default:
      output.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      break;
  }
  return output;
}

function applyFilters() {
  const q = state.query.trim().toLowerCase();
  const filtered = state.stories.filter((story) => {
    const haystack = [
      story.title || '',
      story.author || '',
      ...(Array.isArray(story.tags) ? story.tags : []),
    ].join(' ').toLowerCase();
    const queryMatch = q.length === 0 || haystack.includes(q);
    const tagMatch = state.tag === 'all' || (story.tags || []).includes(state.tag);
    return queryMatch && tagMatch;
  });
  state.filtered = sortStories(filtered);
}

function updateResultsCount() {
  const el = document.getElementById('result-count');
  const total = state.stories.length;
  const shown = state.filtered.length;
  el.textContent = `${shown} of ${total} stories shown`;
}

function renderGrid() {
  const grid = document.getElementById('library-grid');
  const emptyMsg = document.getElementById('library-empty');

  grid.innerHTML = '';
  if (state.filtered.length === 0) {
    emptyMsg.hidden = false;
  } else {
    emptyMsg.hidden = true;
    const fragment = document.createDocumentFragment();
    state.filtered.forEach((story) => fragment.appendChild(createCard(story)));
    grid.appendChild(fragment);
  }

  updateResultsCount();
}

function renderTagFilters() {
  const wrap = document.getElementById('tag-filters');
  const tags = new Set();
  state.stories.forEach((story) => (story.tags || []).forEach((tag) => tags.add(tag)));

  const allTags = ['all', ...Array.from(tags).sort((a, b) => a.localeCompare(b))];
  wrap.innerHTML = '';

  for (const tag of allTags) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip-btn';
    btn.textContent = tag;
    btn.setAttribute('aria-pressed', String(state.tag === tag));
    btn.addEventListener('click', () => {
      state.tag = tag;
      renderTagFilters();
      applyFilters();
      renderGrid();
    });
    wrap.appendChild(btn);
  }
}

function initDiscoveryControls() {
  const search = document.getElementById('library-search');
  const clear = document.getElementById('search-clear');
  const sort = document.getElementById('sort-select');

  search.addEventListener('input', (e) => {
    state.query = e.target.value || '';
    applyFilters();
    renderGrid();
  });

  clear.addEventListener('click', () => {
    search.value = '';
    state.query = '';
    applyFilters();
    renderGrid();
    search.focus();
  });

  sort.addEventListener('change', (e) => {
    state.sort = e.target.value || 'newest';
    applyFilters();
    renderGrid();
  });
}

/** Load manifest and render the grid */
async function loadLibrary() {
  const emptyMsg = document.getElementById('library-empty');

  try {
    const resp = await fetch(MANIFEST_PATH);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const stories = await resp.json();

    if (!Array.isArray(stories) || stories.length === 0) {
      emptyMsg.hidden = false;
      return;
    }

    state.stories = stories.map((story, i) => ({ ...story, _index: i }));
    initReader(state.stories);
    initDiscoveryControls();
    renderTagFilters();
    applyFilters();
    renderGrid();
  } catch {
    emptyMsg.hidden = false;
  }
}

/** Boot */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadLibrary();
});

