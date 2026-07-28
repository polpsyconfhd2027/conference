# Copilot Instructions

This is a static, no-build conference website (plain HTML/CSS/vanilla JS) for the
"24 Hours of Political Psychology" conference, intended for GitHub Pages hosting.
There is no package.json, build tool, bundler, linter, or test suite.

## Local preview

Serve the folder and open in a browser — no build step is needed:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Architecture

- Each top-level page (`index.html`, `about.html`, `submission.html`,
  `registration.html`, `program.html`, `travel.html`) is a standalone HTML file
  sharing the same header/nav/footer markup and `assets/styles.css`.
- `<body data-page="...">` on each page identifies the current page (e.g.
  `data-page="home"`, `data-page="program"`). `assets/site.js` reads this
  attribute to highlight the matching link in `.site-nav` and to wire up the
  `.nav-toggle` mobile menu button. When adding a new page, set a unique
  `data-page` value and ensure the nav link's `href` contains a matching
  substring.
- `assets/site-config.js` centralizes the two external links used site-wide
  (registration form and submission survey). Elements marked
  `[data-registration-link]` / `[data-submission-link]` get their `href` and
  label text populated from this file at runtime by `site.js` — update the
  config file rather than hardcoding URLs in HTML. Links are left as `#`
  (inert, with a placeholder label) until a real URL is set.
- `program.html` renders its schedule dynamically: `assets/program-data.js`
  defines `window.programData` (an `overview` object plus a `days` array of
  `{ title, date, sessions: [{ time, title, meta, description, tags }] }`),
  and `assets/program.js` reads it to build the `#program-days` DOM via string
  templates. To edit the schedule, only edit `program-data.js` — never hand-edit
  generated markup in `program.html`. Script load order matters:
  `program-data.js` must load before `program.js`.
- The "Export Program As PDF" button (`#print-program`) just calls
  `window.print()`; PDF export relies on the browser's print dialog, not a
  server-side renderer.

## Conventions

- Keep pages self-contained static HTML; don't introduce a build step or
  framework without discussion.
- Reuse the existing header/nav/footer structure verbatim when creating or
  editing pages so `site.js` nav-highlighting keeps working.
- Put site-wide editable content (external links, program schedule) in the
  relevant `assets/*.js` data file instead of inlining it in HTML, matching
  the existing `site-config.js` / `program-data.js` pattern.
