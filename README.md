# 24 Hours of Political Psychology

This repository contains the website for the 24 Hours of Political Psychology conference.

## Local preview

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Architecture

- Each top-level page (`index.html`, `about.html`, `submission.html`,
  `registration.html`, `program.html`, `travel.html`) is a standalone HTML file
  sharing the same header/nav/footer markup and `assets/styles.css`.
- `<body data-page="...">` identifies the current page; `assets/site.js` uses it
  for nav highlighting and wires up `.nav-toggle` (mobile menu) and
  `.theme-toggle` (light/dark mode).
- Theme variables live at the top of `assets/styles.css`. Dark mode is the
  default when the visitor's browser/OS requests it (`prefers-color-scheme`);
  a manual toggle choice is stored in `localStorage`.
- `assets/site-config.js` centralizes external links. Elements marked
  `[data-registration-link]` / `[data-submission-link]` are populated at
  runtime — update the config file rather than hardcoding URLs in HTML.
- `program.html` renders its schedule from `assets/program-data.js`
  (`window.programData`) via `assets/program.js`. Edit only `program-data.js`;
  never hand-edit the generated markup. `program-data.js` must load before
  `program.js`.
- The "Export Program As PDF" button (`#print-program`) just calls
  `window.print()`.

## Full program (Excel / OnlyOffice workflow)

The "Full Program & Abstracts" section at the bottom of `program.html` is
rendered by `assets/full-program.js` from `window.fullProgramData`. It
currently ships **unpublished** (notice + placeholder download button).

To publish the full program later:

1. Open `assets/program-template.csv` in Excel or OnlyOffice Spreadsheets
   (UTF-8, comma separated). Columns:
   `type, day, date, time, title, room_or_format, authors, abstract, tags`
   - `type`: `block` (session block, keynote, break) or `talk` (individual
     presentation with authors/abstract)
   - lists inside a cell (authors, tags) are separated by `;`
2. Save as CSV (UTF-8) and replace `assets/program-template.csv`.
3. Regenerate the data file:

   ```bash
   node scripts/generate-full-program.js
   ```

4. Commit and push; the section renders automatically.
5. Optional: host the program as a downloadable file (e.g.
   `assets/full-program.pdf`) and set `fullProgramUrl` /
   `fullProgramLabel` in `assets/site-config.js` to replace the placeholder
   download button.
