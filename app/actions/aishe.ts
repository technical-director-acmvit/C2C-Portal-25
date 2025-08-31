'use server';

import fs from 'fs/promises';
import path from 'path';

type Row = Record<string, string>;

const CSV_PATH = path.join(process.cwd(), 'public', 'portal', 'colleges.csv');

let _cache: { names: string[]; loadedAt: number } | null = null;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const COLLEGE_NAME_HEADER = 'College Name';

const NAME_FALLBACKS = [
  'college_name',
  'College_Name',
  'College name',
  'name_of_college',
  'Name_of_College',
  'name',
  'college',
  'collegename',
];

function cleanName(s: string): string {
  const withoutId = s.replace(/\s*\(Id:\s*[^)]+\)\s*/gi, ' ');
  return withoutId.replace(/\s+/g, ' ').trim();
}

function splitCSVRow(row: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const ch = row[i];

    if (inQuotes) {
      if (ch === '"') {
        if (row[i + 1] === '"') {
          cur += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = false; // closing quote
        }
      } else {
        cur += ch;
      }
    } else {
      if (ch === ',') {
        out.push(cur);
        cur = '';
      } else if (ch === '"') {
        inQuotes = true;
      } else {
        cur += ch;
      }
    }
  }
  out.push(cur);
  return out;
}

/** Parse CSV to array of objects keyed by the header row */
function parseCSV(text: string): Row[] {
  const lines = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .filter((l) => l.length > 0);

  if (lines.length === 0) return [];

  const headerRow = splitCSVRow(lines[0]);
  const headers = headerRow.map((h) => h.trim());

  const rows: Row[] = [];
  for (let i = 1; i < lines.length; i++) {
    const fields = splitCSVRow(lines[i]);
    if (fields.length === 1 && fields[0].trim() === '') continue; // skip blank
    const rec: Row = {};
    for (let c = 0; c < headers.length; c++) {
      const key = headers[c] ?? `col_${c}`;
      rec[key] = (fields[c] ?? '').trim();
    }
    rows.push(rec);
  }
  return rows;
}

function findNameColumn(headers: string[]): string | null {
  if (headers.includes(COLLEGE_NAME_HEADER)) return COLLEGE_NAME_HEADER;

  const lower = headers.map((h) => h.toLowerCase());
  for (const cand of NAME_FALLBACKS) {
    const i = lower.indexOf(cand.toLowerCase());
    if (i !== -1) return headers[i];
  }
  return null;
}

/** Read, clean “(Id: …)”, de-dupe and sort college names from local CSV */
export async function getAisheColleges(): Promise<string[]> {
  // Serve from memory cache if fresh
  if (_cache && Date.now() - _cache.loadedAt < CACHE_TTL_MS) {
    return _cache.names;
  }

  const start = Date.now();
  const raw = await fs.readFile(CSV_PATH, 'utf8');
  const rows = parseCSV(raw);
  if (rows.length === 0) {
    throw new Error(`colleges.csv seems empty at ${CSV_PATH}`);
  }

  const headers = Object.keys(rows[0] ?? {});
  const nameKey = findNameColumn(headers);
  if (!nameKey) {
    throw new Error(
      `Could not find a college name column. Looked for "${COLLEGE_NAME_HEADER}" or one of: ` +
        NAME_FALLBACKS.join(', ')
    );
  }

  const namesSet = new Set<string>();
  for (const r of rows) {
    const rawName = r[nameKey] ?? '';
    const cleaned = cleanName(rawName);
    if (cleaned) namesSet.add(cleaned);
  }

  const names = Array.from(namesSet).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' })
  );

  _cache = { names, loadedAt: Date.now() };

  // Optional debug
  console.info(
    '[aishe/csv] %d unique colleges from %s in %dms',
    names.length,
    path.relative(process.cwd(), CSV_PATH),
    Date.now() - start
  );

  return names;
}
