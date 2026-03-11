<!--
Project: Mycelium
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
-->

# Mycelium v1.0.0 Release Notes

**Release Date:** 2026-03-10
**All credits to the Zorvia Community**

## Highlights

- **Reader-first Next.js experience** with searchable, sortable story library and immersive reader UI.
- **Production review API** with persistence abstraction — Upstash Redis (production) and file-based fallback (development).
- **Anonymous review workflow** with anti-abuse controls: IP-based rate limiting, spam heuristics, content sanitization, and moderation flagging.
- **Accessibility-first design**: ARIA roles, keyboard navigation, focus management, `prefers-reduced-motion` support, and high-contrast light/dark themes.
- **Header validation script** and GitHub Actions CI for repository standards enforcement.
- **Optimized typography**: Inter and Source Serif 4 loaded via `next/font` for zero-layout-shift rendering.

## Features

### Library
- Searchable grid with cover art, metadata, and tag filtering.
- Sort by newest or title.
- Responsive layout with accessible card interactions.

### Reader
- Adjustable font size (A−/A+) with persistence.
- Column width control (Narrow/Wide).
- Dark/light theme toggle with persistence.
- Reading progress indicator.
- Per-story reading position saved to localStorage (per device).
- Swipe gestures on touch devices for previous/next story navigation.
- Keyboard-accessible navigation links.

### Reviews
- Anonymous star-rating (1–5) and text review submission.
- Client-side validation (4–500 character body, required rating).
- Server-side sanitization: HTML stripping, length limits, spam keyword detection.
- Rate limiting: configurable per-IP per-minute threshold (default: 6).
- Moderation: suspicious reviews are flagged and hidden from public listing.
- Admin deletion via `DELETE /api/reviews/:id` with `x-admin-token` header.
- Pagination and sort (newest / highest rated).

### Accessibility
- Semantic HTML with ARIA roles and labels.
- Focus management for interactive controls.
- `prefers-reduced-motion` disables animations and transitions.
- Minimum touch target size: 44px.
- Accessible color contrast in both dark and light themes.

### Security
- No secrets or credentials committed to the repository.
- Server-side payload validation and HTML sanitization to prevent stored XSS.
- Admin endpoints protected by environment-variable token.
- Rate limiting enforced in serverless functions.

## Licensing

- Licensed under **ZPL v2.0** (Zorvia Public License).
- `LICENSE.md` contains the full license text with the ASCII Zorvia logo preserved verbatim.
- Canonical headers in every source file reference the license.

## Verification Checklist

- [ ] `npm run validate:headers` — all source files contain canonical header.
- [ ] `npm run validate:stories` — all stories have valid frontmatter.
- [ ] `npm run lint` — ESLint passes.
- [ ] `npm run test` — Vitest unit tests pass.
- [ ] `npm run build` — Next.js production build succeeds.
- [ ] Vercel preview deployment loads homepage and story pages.
- [ ] Reviews can be posted (`POST /api/reviews`) and fetched (`GET /api/reviews?storyId=...`).
- [ ] Rate limit returns `429` when exceeded.
- [ ] `DELETE /api/reviews/:id` returns `401` without valid admin token.
- [ ] LICENSE.md text is unchanged.
- [ ] `prefers-reduced-motion` disables all animations.
- [ ] Keyboard navigation reaches all interactive elements.

## Environment Variables (Required for Production)

| Variable | Purpose |
|---|---|
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis auth token |
| `REVIEW_ADMIN_TOKEN` | Secret for admin review deletion |
| `RATE_LIMIT_PER_MINUTE` | Max POSTs per IP per minute (default: 6) |

## Known Limitations

- **Custom fonts/logo**: using defaults (Inter, Source Serif 4). Replace with custom brand assets when provided.
- **Upstash setup**: requires manual creation of Upstash Redis database and Vercel environment variable configuration.
- **Lighthouse scores**: not yet measured in CI; manual verification recommended.

## Migration Notes

This is the initial v1.0.0 release. No migration from previous versions is required.
