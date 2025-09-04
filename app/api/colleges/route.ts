import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface CollegeData {
  universities: string[];
  colleges: Record<string, string[]>;
  metadata: {
    extractedAt: string;
    totalUniversities: number;
    totalCollegeEntries: number;
    totalColleges: number;
  };
}

let cachedData: CollegeData | null = null;

function loadCollegeData(): CollegeData {
  if (cachedData) return cachedData;
  
  const filePath = path.join(process.cwd(), 'public', 'portal', 'unis.json');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  cachedData = JSON.parse(fileContent);
  return cachedData!;
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, ' ').trim();
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const v0 = new Array(b.length + 1);
  const v1 = new Array(b.length + 1);
  for (let i = 0; i < v0.length; i++) v0[i] = i;

  for (let i = 0; i < a.length; i++) {
    v1[0] = i + 1;
    for (let j = 0; j < b.length; j++) {
      const cost = a[i] === b[j] ? 0 : 1;
      v1[j + 1] = Math.min(
        v1[j] + 1,
        v0[j + 1] + 1,
        v0[j] + cost,
      );
    }
    for (let j = 0; j < v0.length; j++) v0[j] = v1[j];
  }
  return v1[b.length];
}

interface RankedItem {
  name: string;
  scoreBand: number;
  score: number;
}

function rankNames(query: string, names: string[], limit = 15): RankedItem[] {
  const q = normalize(query);
  if (!q) return names.slice(0, limit).map((name) => ({ name, scoreBand: 99, score: 999 }));

  const ranked: RankedItem[] = [];
  for (const name of names) {
    const n = normalize(name);
    if (!n) continue;

    if (n === q) {
      ranked.push({ name, scoreBand: 0, score: 0 });
      continue;
    }
    if (n.startsWith(q)) {
      ranked.push({ name, scoreBand: 1, score: n.length - q.length });
      continue;
    }
    if (n.includes(q)) {
      ranked.push({ name, scoreBand: 2, score: n.indexOf(q) + n.length * 0.001 });
      continue;
    }
    
    const dist = levenshtein(n, q);
    const norm = dist / Math.max(n.length, q.length);
    if (norm <= 0.5) {
      ranked.push({ name, scoreBand: 3, score: norm });
    }
  }

  ranked.sort(
    (a, b) => a.scoreBand - b.scoreBand || a.score - b.score || a.name.localeCompare(b.name),
  );
  return ranked.slice(0, limit);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'universities' or 'colleges'
    const query = searchParams.get('q') || '';
    const university = searchParams.get('university');
    const limit = parseInt(searchParams.get('limit') || '15');

    const data = loadCollegeData();

    if (type === 'universities') {
      const results = rankNames(query, data.universities, limit);
      return NextResponse.json({ universities: results.map(r => r.name) });
    }

    if (type === 'colleges' && university) {
      const colleges = data.colleges[university] || [];
      const results = rankNames(query, colleges, limit);
      return NextResponse.json({ colleges: results.map(r => r.name) });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('Error in colleges API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}