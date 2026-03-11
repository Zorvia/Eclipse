<!--
Project: Mycelium
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
-->

# TODO - Mycelium v1.0.0 Completion Checklist

## 1. Local Verification (must pass)

- [x] Install dependencies: `npm ci` (equivalent completed via `npm install` due missing lockfile initially)
- [x] Run header check: `npm run validate:headers`
- [x] Run story schema check: `npm run validate:stories`
- [x] Run linter: `npm run lint`
- [x] Run tests: `npm run test`
- [x] Build production bundle: `npm run build`
- [x] Start local server: `npm run start`
- [x] Manual UI smoke test on `http://localhost:3000`

## 2. Reader UX QA

- [ ] Verify search and sort on homepage
- [x] Verify each story route opens and renders content correctly
- [ ] Verify font size controls persist per device
- [ ] Verify line-length controls persist per device
- [ ] Verify dark/light mode toggle persists per device
- [ ] Verify reading progress updates while scrolling
- [ ] Verify reading position is restored for each story
- [ ] Verify swipe gestures (mobile) for previous/next story

## 3. Review API QA

- [x] `GET /api/reviews?storyId=<id>&sort=newest` returns list + stats
- [x] `GET /api/reviews?storyId=<id>&sort=highest` sorts by rating desc
- [x] `POST /api/reviews` validates payload and creates review
- [x] Verify flagged/spam-like reviews are not shown in visible list
- [x] Verify rate-limit returns `429` when threshold exceeded
- [x] Verify `DELETE /api/reviews/:id` requires valid `x-admin-token`

## 4. Upstash + Environment Setup

- [ ] Create Upstash Redis database
- [ ] Set Vercel env vars:
  - [ ] `UPSTASH_REDIS_REST_URL`
  - [ ] `UPSTASH_REDIS_REST_TOKEN`
  - [ ] `REVIEW_ADMIN_TOKEN`
  - [ ] `RATE_LIMIT_PER_MINUTE`
- [x] Confirm fallback mode works locally without Upstash vars (`data/reviews.json`)

## 5. Vercel Deployment

- [ ] Import `https://github.com/Zorvia/Mycelium.git` into Vercel (blocked: Vercel CLI token invalid in current environment)
- [ ] Confirm framework preset is Next.js
- [ ] Confirm deployment succeeds from `main`
- [ ] Smoke test live deployment routes and review API

## 6. Accessibility + Performance

- [ ] Run Lighthouse on homepage and one story page
- [ ] Ensure no critical accessibility issues remain
- [ ] Validate contrast and focus indicators
- [ ] Verify reduced-motion behavior
- [ ] Confirm cover assets load and cache correctly

## 7. Repository Standards

- [x] Confirm canonical header is present in all source files
- [x] Confirm `LICENSE.md` remains exact and unchanged
- [x] Confirm `CHANGELOG.md` includes v1.0.0
- [x] Confirm `RELEASE_NOTES_v1.0.0.md` matches release content

## 8. Release Completion

- [x] Create GitHub Release from tag `v1.0.0`
- [x] Attach release notes and verification summary
- [ ] Add screenshots (desktop + mobile)
- [ ] Link live Vercel URL in release description

Release URL:
- `https://github.com/Zorvia/Mycelium/releases/tag/v1.0.0`
