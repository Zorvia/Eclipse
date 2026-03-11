<!--
Project: Mycelium
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
-->

## Description

<!-- Brief description of changes -->

## Type of Change

- [ ] New story added
- [ ] Bug fix
- [ ] Feature / enhancement
- [ ] Documentation update
- [ ] Build / tooling change

## Verification Checklist

### Functionality
- [ ] Grid loads with cover images and metadata
- [ ] Tap/click a cover → reader overlay opens
- [ ] Focus moves into modal on open
- [ ] Story content renders and is legible
- [ ] Esc key and close button close the modal
- [ ] Focus returns to the originating card on close
- [ ] Previous / Next buttons navigate between stories
- [ ] Font size controls adjust text and persist in localStorage
- [ ] Dark mode toggle works and persists

### Keyboard & Accessibility
- [ ] Tab order covers all interactive elements
- [ ] Enter / Space triggers card open
- [ ] Arrow keys navigate stories inside the reader
- [ ] Skip-to-content link works
- [ ] Screen reader announces modal role and story title
- [ ] Touch targets are ≥ 44px on mobile

### Content Integrity
- [ ] `npm run validate` exits with code 0
- [ ] All stories in `stories/` have required frontmatter keys
- [ ] `npm run build` completes successfully
- [ ] `manifest.json` is up to date

### Accessibility & Performance (manual)
- [ ] Lighthouse accessibility score ≥ 90
- [ ] No critical contrast-ratio failures
- [ ] `prefers-reduced-motion` disables animations

### Deployment
- [ ] Site loads correctly on GitHub Pages
- [ ] No console errors in production

### Screenshots

<!-- Attach mobile and desktop screenshots -->

### Deploy Link

<!-- https://<username>.github.io/mycelium/ -->

