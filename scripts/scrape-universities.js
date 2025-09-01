#!/usr/bin/env node
/**
 * Scrapes https://linkingsky.com/career-news/universities-list.html
 * and outputs institutes (universities + colleges) to JSON.
 *
 * Defaults:
 * - Only categories likely to list universities/colleges:
 *   Central Government, State Government, Deemed (Government), Deemed (Private), Private
 * - Name filter matches: University / Vishwavidyalaya / Vidyapeeth / College / Mahavidyalaya
 * - Use --all to include every link in those categories (even if the name doesn't match)
 *
 * Usage:
 *   node scrape-institutes.js
 *   node scrape-institutes.js --all
 *   node scrape-institutes.js --out data.json
 */

const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const PAGE_URL = "https://linkingsky.com/career-news/universities-list.html";
const DEFAULT_OUT = process.argv.includes("--out")
  ? process.argv[process.argv.indexOf("--out") + 1] || "institutes.json"
  : "institutes.json";
const INCLUDE_ALL = process.argv.includes("--all");

const NAME_REGEX =
  /(university|vishwavidyalaya|vidyapeeth|college|mahavidyalaya)/i;

function norm(s) {
  return s.replace(/\s+/g, " ").trim();
}

const ALLOWED_CATEGORIES = new Set([
  "Central Government",
  "State Government",
  "Deemed (Government)",
  "Deemed (Private)",
  "Private",
]);

function looksLikeUniversityOrCollege(name) {
  return NAME_REGEX.test(name);
}

(async () => {
  try {
    const { data: html } = await axios.get(PAGE_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari",
        Accept: "text/html,application/xhtml+xml",
      },
      timeout: 30000,
    });

    const $ = cheerio.load(html);
    const BASE = new URL(PAGE_URL);

    const results = [];
    const seen = new Set();

    $("#page_cont .career_info_div").each((_, section) => {
      const $section = $(section);

      const stateRaw = $section.find("> p.cont_para").first().text().trim();
      const state = stateRaw ? norm(stateRaw.replace(/\(\d+\)\s*$/, "")) : "Unknown";

      let currentCategory = null;

      $section.children().each((__, child) => {
        const tag = child.tagName ? child.tagName.toLowerCase() : "";

        if (tag === "h4") {
          currentCategory = norm($(child).text());
          return;
        }

        if (tag === "ul" && currentCategory) {
          const catNorm = norm(currentCategory);
          if (!ALLOWED_CATEGORIES.has(catNorm)) return;

          $(child)
            .find("li > a[href]")
            .each((___, a) => {
              const name = norm($(a).text());
              const href = $(a).attr("href");
              if (!href) return;

              const url = new URL(href, BASE).href;

              if (!INCLUDE_ALL && !looksLikeUniversityOrCollege(name)) return;

              const key = `${state}|${catNorm}|${name}|${url}`;
              if (seen.has(key)) return;
              seen.add(key);

              results.push({
                state,
                category: catNorm,
                name,
              });
            });
        }
      });
    });

    const deduped = [];
    const seenByStateName = new Set();
    for (const row of results) {
      const k = `${row.state}|${row.name}`.toLowerCase();
      if (seenByStateName.has(k)) continue;
      seenByStateName.add(k);
      deduped.push(row);
    }

    deduped.sort(
      (a, b) => a.state.localeCompare(b.state) || a.name.localeCompare(b.name)
    );

    const outPath = path.resolve(process.cwd(), DEFAULT_OUT);
    fs.writeFileSync(outPath, JSON.stringify(deduped, null, 2), "utf8");

    const byState = deduped.reduce((acc, r) => {
      acc[r.state] = (acc[r.state] || 0) + 1;
      return acc;
    }, {});
    const total = deduped.length;

    console.log(`Saved ${total} institutes to ${outPath}`);
    console.log("Top states (by count):");
    Object.entries(byState)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([st, n]) => console.log(`  ${st}: ${n}`));
  } catch (err) {
    console.error("Scrape failed:", err?.message || err);
    process.exit(1);
  }
})();
