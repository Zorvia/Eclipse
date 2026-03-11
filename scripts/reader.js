/*
Project: Mycelium
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
*/

/** Reader overlay — manages the modal, story rendering, and reading preferences. */
const FONT_SIZE_KEY = 'mycelium-font-size';
const REVIEW_KEY = 'mycelium-reviews';
const FONT_STEP = 0.1;
const FONT_MIN = 0.8;
const FONT_MAX = 2.0;
const DEFAULT_FONT = 1.1;

const $ = (sel) => document.querySelector(sel);

const els = {
  overlay: null,
  body: null,
  content: null,
  title: null,
  close: null,
  prev: null,
  next: null,
  fontUp: null,
  fontDown: null,
  reviewForm: null,
  reviewRating: null,
  reviewComment: null,
  reviewList: null,
  reviewSummary: null,
};

let manifest = [];
let currentIndex = -1;
let returnFocusEl = null;
let fontSize = DEFAULT_FONT;

function loadReviews() {
  const raw = localStorage.getItem(REVIEW_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed ? parsed : {};
  } catch {
    return {};
  }
}

function saveReviews(map) {
  localStorage.setItem(REVIEW_KEY, JSON.stringify(map));
}

function getStoryReviews(storyId) {
  const map = loadReviews();
  const list = map[storyId];
  return Array.isArray(list) ? list : [];
}

function setStoryReviews(storyId, reviews) {
  const map = loadReviews();
  map[storyId] = reviews;
  saveReviews(map);
}

function getAverageRating(reviews) {
  if (reviews.length === 0) return null;
  const total = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
  return (total / reviews.length).toFixed(1);
}

function renderReviews() {
  const story = manifest[currentIndex];
  if (!story) return;

  const reviews = getStoryReviews(story.id);
  els.reviewList.innerHTML = '';

  const average = getAverageRating(reviews);
  els.reviewSummary.textContent = average
    ? `${reviews.length} review(s) • Average rating ${average}/5`
    : 'No reviews yet. Be the first to rate this story.';

  reviews.forEach((review, idx) => {
    const item = document.createElement('li');
    item.className = 'review-item';

    const meta = document.createElement('div');
    meta.className = 'review-meta';

    const stars = document.createElement('span');
    stars.className = 'review-stars';
    stars.textContent = `${'★'.repeat(Number(review.rating))}${'☆'.repeat(5 - Number(review.rating))}`;

    const date = document.createElement('span');
    date.className = 'review-date';
    date.textContent = review.date || '';

    meta.appendChild(stars);
    meta.appendChild(date);

    const text = document.createElement('p');
    text.className = 'review-text';
    text.textContent = review.comment;

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'reader-btn review-delete';
    remove.textContent = 'Delete review';
    remove.setAttribute('aria-label', `Delete review ${idx + 1}`);
    remove.addEventListener('click', () => {
      const next = getStoryReviews(story.id).filter((_, i) => i !== idx);
      setStoryReviews(story.id, next);
      renderReviews();
    });

    item.appendChild(meta);
    item.appendChild(text);
    item.appendChild(remove);
    els.reviewList.appendChild(item);
  });
}

function handleReviewSubmit(event) {
  event.preventDefault();
  const story = manifest[currentIndex];
  if (!story) return;

  const rating = Number(els.reviewRating.value);
  const comment = els.reviewComment.value.trim();
  if (!rating || !comment) return;

  const reviews = getStoryReviews(story.id);
  reviews.unshift({
    rating,
    comment,
    date: new Date().toISOString().slice(0, 10),
  });

  setStoryReviews(story.id, reviews);
  els.reviewForm.reset();
  renderReviews();
}

/** Restore persisted font size */
function loadFontSize() {
  const stored = localStorage.getItem(FONT_SIZE_KEY);
  if (stored) {
    const val = parseFloat(stored);
    if (!Number.isNaN(val) && val >= FONT_MIN && val <= FONT_MAX) {
      fontSize = val;
    }
  }
  applyFontSize();
}

function applyFontSize() {
  document.documentElement.style.setProperty('--reader-font-size', `${fontSize}rem`);
}

function saveFontSize() {
  localStorage.setItem(FONT_SIZE_KEY, String(fontSize));
}

/** Focus trap — keeps Tab cycling inside the overlay */
function trapFocus(e) {
  if (e.key !== 'Tab') return;
  const focusable = els.overlay.querySelectorAll(
    'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
  );
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

/** Open reader at the given manifest index */
async function openStory(index, triggerEl) {
  if (index < 0 || index >= manifest.length) return;
  currentIndex = index;
  returnFocusEl = triggerEl || document.activeElement;
  const story = manifest[index];

  els.title.textContent = story.title;
  els.content.innerHTML = '<p>Loading…</p>';

  // Show overlay
  els.overlay.hidden = false;
  document.body.classList.add('reader-open');
  els.body.focus();

  // Load story HTML
  try {
    const resp = await fetch(story.htmlPath);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const html = await resp.text();
    els.content.innerHTML = html;
  } catch {
    els.content.innerHTML = '<p>Could not load story. Please try again.</p>';
  }

  updateNav();
  renderReviews();
  els.overlay.addEventListener('keydown', trapFocus);
  els.overlay.addEventListener('keydown', handleReaderKeys);
}

function closeReader() {
  els.overlay.hidden = true;
  document.body.classList.remove('reader-open');
  els.overlay.removeEventListener('keydown', trapFocus);
  els.overlay.removeEventListener('keydown', handleReaderKeys);
  if (returnFocusEl) returnFocusEl.focus();
}

function updateNav() {
  els.prev.disabled = currentIndex <= 0;
  els.next.disabled = currentIndex >= manifest.length - 1;
}

function handleReaderKeys(e) {
  if (e.key === 'Escape') {
    e.stopPropagation();
    closeReader();
  } else if (e.key === 'ArrowLeft' && !els.prev.disabled) {
    openStory(currentIndex - 1);
  } else if (e.key === 'ArrowRight' && !els.next.disabled) {
    openStory(currentIndex + 1);
  }
}

/** Initialise reader — called once from app.js */
export function initReader(storyManifest) {
  manifest = storyManifest;

  els.overlay = $('#reader-overlay');
  els.body = $('#reader-body');
  els.content = $('#reader-content');
  els.title = $('#reader-title');
  els.close = $('#reader-close');
  els.prev = $('#reader-prev');
  els.next = $('#reader-next');
  els.fontUp = $('#font-increase');
  els.fontDown = $('#font-decrease');
  els.reviewForm = $('#review-form');
  els.reviewRating = $('#review-rating');
  els.reviewComment = $('#review-comment');
  els.reviewList = $('#review-list');
  els.reviewSummary = $('#review-summary');

  loadFontSize();

  els.close.addEventListener('click', closeReader);
  els.prev.addEventListener('click', () => openStory(currentIndex - 1));
  els.next.addEventListener('click', () => openStory(currentIndex + 1));

  els.fontUp.addEventListener('click', () => {
    fontSize = Math.min(FONT_MAX, +(fontSize + FONT_STEP).toFixed(1));
    applyFontSize();
    saveFontSize();
  });

  els.fontDown.addEventListener('click', () => {
    fontSize = Math.max(FONT_MIN, +(fontSize - FONT_STEP).toFixed(1));
    applyFontSize();
    saveFontSize();
  });

  els.reviewForm.addEventListener('submit', handleReviewSubmit);

  // Close on backdrop click
  els.overlay.addEventListener('click', (e) => {
    if (e.target === els.overlay) closeReader();
  });
}

export { openStory };

