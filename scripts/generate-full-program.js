#!/usr/bin/env node
// Generates assets/full-program.js from assets/program-template.csv.
//
// Workflow for editing the full program with Excel / OnlyOffice spreadsheets:
//   1. Edit assets/program-template.csv (UTF-8, comma separated).
//      Columns:
//        type          - "block" (session block/keynote/break) or "talk" (individual presentation)
//        day           - group label, e.g. "Day 1"
//        date          - e.g. "Thursday February 11 2027"
//        time          - e.g. "13:00-14:15"
//        title         - session or presentation title
//        room_or_format- room name or presentation format
//        authors       - speaker names, separated by ";"
//        abstract      - abstract text (leave empty for blocks without one)
//        tags          - tags separated by ";"
//   2. Run: node scripts/generate-full-program.js
//   3. Commit the regenerated assets/full-program.js.
//
// No external dependencies; handles quoted CSV fields (commas, semicolons,
// quotes and line breaks inside abstracts are fine).

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const csvPath = path.join(root, "assets", "program-template.csv");
const outPath = path.join(root, "assets", "full-program.js");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") {
        i++;
      }
      row.push(field);
      field = "";
      if (row.some((value) => value.trim() !== "")) {
        rows.push(row);
      }
      row = [];
    } else {
      field += char;
    }
  }
  row.push(field);
  if (row.some((value) => value.trim() !== "")) {
    rows.push(row);
  }
  return rows;
}

function splitList(value) {
  return value
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);
}

const raw = fs.readFileSync(csvPath, "utf8");
const rows = parseCsv(raw.replace(/^\uFEFF/, ""));

if (rows.length === 0) {
  console.error("CSV file is empty: " + csvPath);
  process.exit(1);
}

const header = rows[0].map((column) => column.trim());
const requiredColumns = ["type", "day", "date", "time", "title"];
const missing = requiredColumns.filter((name) => !header.includes(name));
if (missing.length > 0) {
  console.error("CSV is missing required column(s): " + missing.join(", "));
  process.exit(1);
}

const column = (name) => header.indexOf(name);

const days = [];
const dayIndex = new Map();

for (const row of rows.slice(1)) {
  const entry = {
    type: (row[column("type")] || "block").trim(),
    day: (row[column("day")] || "").trim(),
    date: (row[column("date")] || "").trim(),
    time: (row[column("time")] || "").trim(),
    title: (row[column("title")] || "").trim(),
    roomOrFormat: (row[column("room_or_format")] || "").trim(),
    authors: splitList(row[column("authors")] || ""),
    abstract: (row[column("abstract")] || "").trim(),
    tags: splitList(row[column("tags")] || "")
  };

  if (!entry.day || !entry.title) {
    continue;
  }

  if (!dayIndex.has(entry.day)) {
    dayIndex.set(entry.day, days.length);
    days.push({
      title: entry.day,
      date: entry.date,
      blocks: [],
      talks: []
    });
  }

  const day = days[dayIndex.get(entry.day)];
  if (entry.type === "talk") {
    day.talks.push(entry);
  } else {
    day.blocks.push(entry);
  }
}

const output = `// GENERATED FILE - do not edit by hand.
// Edit assets/program-template.csv instead, then run:
//   node scripts/generate-full-program.js

window.fullProgramData = {
  published: true,
  note: "",
  days: ${JSON.stringify(days, null, 2)}
};
`;

fs.writeFileSync(outPath, output, "utf8");
console.log(
  `Wrote ${outPath} (${days.length} day(s), ${days.reduce((sum, day) => sum + day.blocks.length, 0)} block(s), ${days.reduce(
    (sum, day) => sum + day.talks.length,
    0
  )} talk(s))`
);
