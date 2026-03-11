<!--
Project: Mycelium
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
-->

# Contributing

All credits to the **Zorvia Community**. Contributions are welcome under the terms of ZPL v2.0.

## Required Source Header

Every source file must start with this exact canonical header (language-appropriate comment syntax):

```text
Project: Mycelium
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
```

### Comment Syntax by File Type

| Extension | Wrapper |
|---|---|
| `.ts`, `.tsx`, `.js`, `.jsx`, `.css` | `/* ... */` |
| `.md`, `.html`, `.svg` | `<!-- ... -->` |
| `.yml`, `.yaml`, `.env` | `# ...` (one `#` per line) |

### Rules

- Keep wording exact — do not rephrase or abbreviate.
- The header must be the **first content** in the file.
- Maximum header length: **10 lines** (including comment delimiters).
- Do not include the full license text in headers — reference `LICENSE.md` only.
- Always attribute to the **Zorvia Community**, never to individuals.

## PR Checklist

- [ ] `npm run validate:headers` passes.
- [ ] `npm run validate:stories` passes (if stories were changed).
- [ ] `npm run lint` passes.
- [ ] `npm run test` passes.
- [ ] `npm run build` succeeds.
- [ ] No secrets, API keys, or credentials committed.
- [ ] Changes preserve Zorvia Community attribution and ZPL v2.0 obligations.
- [ ] `LICENSE.md` has not been modified.
- [ ] Accessibility: new interactive elements are keyboard-reachable and have ARIA labels.
- [ ] Performance: images are lazy-loaded, no unnecessary client-side JS added.

## License

By contributing, you agree that your contributions are licensed under ZPL v2.0. See [LICENSE.md](LICENSE.md).

