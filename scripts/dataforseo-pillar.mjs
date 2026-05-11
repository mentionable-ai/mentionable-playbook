#!/usr/bin/env node
/**
 * Pipeline DataForSEO pilier + satellites à partir d'un seed keyword.
 *
 *   1. Récupère related keywords + keyword suggestions (DataForSEO Labs)
 *   2. Sélectionne le mot-clé pilier (volume / KD favorable)
 *   3. Analyse la SERP top 10 du pilier (longueur, headings, termes partagés)
 *   4. Cluster les autres mots-clés en satellites groupés par intent / theme
 *   5. Écrit ./pillars/<slug>/brief.json
 *
 * Usage:
 *   node scripts/dataforseo-pillar.mjs "<seed keyword>" [--location 2250] [--language fr] [--project-slug <slug>]
 *   npm run pillar -- "cours de guitare"
 *   npm run pillar -- "cours de guitare" --project-slug mon-client
 *
 * Variables d'environnement (auto-chargées depuis .env à la racine):
 *   DATAFORSEO_LOGIN     (requis)
 *   DATAFORSEO_PASSWORD  (requis)
 *   LOCATION_CODE        (optionnel, défaut 2250 = France)
 *   LANGUAGE_CODE        (optionnel, défaut fr)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

function loadDotEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}
loadDotEnv(path.join(repoRoot, ".env"));

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    } else {
      positional.push(a);
    }
  }
  return { positional, flags };
}

const { positional, flags } = parseArgs(process.argv.slice(2));
const SEED = positional.join(" ").trim();
const LOGIN = process.env.DATAFORSEO_LOGIN;
const PASSWORD = process.env.DATAFORSEO_PASSWORD;
const LOCATION_CODE = Number(flags.location || process.env.LOCATION_CODE || 2250);
const LANGUAGE_CODE = flags.language || process.env.LANGUAGE_CODE || "fr";
const PROJECT_SLUG = flags["project-slug"] || null;

if (!SEED) {
  console.error('Usage: npm run pillar -- "<seed keyword>"');
  process.exit(2);
}
if (!LOGIN || !PASSWORD) {
  console.error("Erreur: DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD manquants dans .env.");
  console.error("→ Crée un compte sur https://dataforseo.com et copie tes credentials API.");
  process.exit(2);
}

const AUTH = "Basic " + Buffer.from(`${LOGIN}:${PASSWORD}`).toString("base64");

async function api(pathname, body) {
  const res = await fetch(`https://api.dataforseo.com${pathname}`, {
    method: "POST",
    headers: { Authorization: AUTH, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (json.status_code !== 20000) {
    throw new Error(`${pathname} → ${json.status_message} (code ${json.status_code})`);
  }
  return json.tasks?.[0]?.result?.[0]?.items ?? [];
}

// --- 1. Mots-clés ---------------------------------------------------------
async function gatherKeywords(seed) {
  const [related, suggestions] = await Promise.all([
    api("/v3/dataforseo_labs/google/related_keywords/live", [{
      keyword: seed, location_code: LOCATION_CODE, language_code: LANGUAGE_CODE,
      depth: 2, include_seed_keyword: true, limit: 200,
    }]),
    api("/v3/dataforseo_labs/google/keyword_suggestions/live", [{
      keyword: seed, location_code: LOCATION_CODE, language_code: LANGUAGE_CODE,
      include_seed_keyword: true, limit: 300,
    }]),
  ]);

  const norm = (i, src) => {
    const data = src === "related" ? i.keyword_data : i;
    return {
      keyword: data?.keyword,
      volume: data?.keyword_info?.search_volume ?? 0,
      cpc: data?.keyword_info?.cpc ?? 0,
      competition: data?.keyword_info?.competition_level,
      difficulty: data?.keyword_properties?.keyword_difficulty ?? null,
      intent: data?.search_intent_info?.main_intent ?? "unknown",
      source: src,
    };
  };

  const map = new Map();
  for (const i of related) {
    const k = norm(i, "related");
    if (k.keyword) map.set(k.keyword, k);
  }
  for (const i of suggestions) {
    const k = norm(i, "suggestion");
    if (k.keyword && !map.has(k.keyword)) map.set(k.keyword, k);
  }
  return [...map.values()];
}

const opportunityScore = (k) => {
  if (!k.volume) return 0;
  const kd = k.difficulty ?? 60;
  return Math.round((k.volume * (100 - kd)) / 100);
};

// --- 2. Sélection de la cible pilier --------------------------------------
function pickPillarTarget(keywords, seed) {
  const candidates = keywords
    .filter((k) => k.volume >= 100)
    .map((k) => ({ ...k, score: opportunityScore(k) }))
    .sort((a, b) => b.score - a.score);

  const easy = candidates.find((k) => (k.difficulty ?? 100) <= 50);
  return easy || candidates[0] || { keyword: seed, volume: 0, difficulty: null, intent: "unknown" };
}

// --- 3. Analyse SERP -----------------------------------------------------
const STOP = new Set(
  "le la les un une des de du au aux et ou mais donc or ni car à en y est sont être avoir pour par sur sous dans avec sans ce cet cette ces son sa ses leur leurs qui que quoi dont où pas plus très bien tout the of and to in is for on with as by be at this that"
    .split(" ")
);
const strip = (h) =>
  h
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const extractHeadings = (h) => {
  const o = { h1: [], h2: [], h3: [] };
  for (const t of ["h1", "h2", "h3"]) {
    const re = new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`, "gi");
    let m;
    while ((m = re.exec(h))) o[t].push(strip(m[1]));
  }
  return o;
};
const topTerms = (txt) => {
  const w = txt.toLowerCase().match(/[a-zàâäéèêëïîôöùûüÿñç]{4,}/g) || [];
  const c = new Map();
  for (const x of w) if (!STOP.has(x)) c.set(x, (c.get(x) || 0) + 1);
  return [...c.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25);
};

async function analyzeSerp(keyword) {
  const items = await api("/v3/serp/google/organic/live/advanced", [{
    keyword, location_code: LOCATION_CODE, language_code: LANGUAGE_CODE,
    depth: 10, device: "desktop",
  }]);
  const organic = items.filter((i) => i.type === "organic").slice(0, 10);

  const pages = await Promise.all(
    organic.map(async (r, i) => {
      try {
        const res = await fetch(r.url, {
          signal: AbortSignal.timeout(15000),
          headers: { "User-Agent": "Mozilla/5.0 (compatible; SEO-Bot/1.0)" },
        });
        const html = await res.text();
        const text = strip(html);
        return {
          rank: i + 1, url: r.url, title: r.title, description: r.description,
          wordCount: (text.match(/\S+/g) || []).length,
          headings: extractHeadings(html), topTerms: topTerms(text), ok: true,
        };
      } catch (e) {
        return { rank: i + 1, url: r.url, title: r.title, ok: false, error: e.message };
      }
    })
  );

  const ok = pages.filter((p) => p.ok);
  const avgWords = Math.round(ok.reduce((s, p) => s + p.wordCount, 0) / (ok.length || 1));
  const shared = new Map();
  for (const p of ok) for (const [w, c] of p.topTerms) shared.set(w, (shared.get(w) || 0) + c);
  return {
    keyword,
    avgWordCount: avgWords,
    targetWordCount: Math.round(avgWords * 1.2),
    sharedTerms: [...shared.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30),
    pages,
  };
}

// --- 4. Clustering des satellites -----------------------------------------
function clusterSatellites(keywords, pillarKw) {
  const byIntent = {};
  for (const k of keywords) {
    if (k.keyword === pillarKw) continue;
    if (!k.volume) continue;
    (byIntent[k.intent] ||= []).push(k);
  }
  const SKIP = new Set(
    "le la les un une des de du au aux et ou pour par avec sans dans en the of and to in for on with".split(" ")
  );
  const clusters = [];
  for (const [intent, list] of Object.entries(byIntent)) {
    const buckets = new Map();
    for (const k of list) {
      const tokens = k.keyword.toLowerCase().split(/\s+/).filter((t) => t.length > 3 && !SKIP.has(t));
      const key = tokens[0] || "misc";
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(k);
    }
    for (const [theme, items] of buckets) {
      if (items.length < 2) continue;
      items.sort((a, b) => b.volume - a.volume);
      clusters.push({
        intent,
        theme,
        totalVolume: items.reduce((s, k) => s + k.volume, 0),
        keywords: items.slice(0, 8),
      });
    }
  }
  return clusters.sort((a, b) => b.totalVolume - a.totalVolume).slice(0, 10);
}

// --- 5. Brief final --------------------------------------------------------
function buildBrief(seed, pillarTarget, serp, clusters, allKeywords) {
  return {
    seed,
    locationCode: LOCATION_CODE,
    languageCode: LANGUAGE_CODE,
    generatedAt: new Date().toISOString(),
    pillar: {
      targetKeyword: pillarTarget.keyword,
      volume: pillarTarget.volume,
      difficulty: pillarTarget.difficulty,
      intent: pillarTarget.intent,
      opportunityScore: pillarTarget.score ?? null,
      recommendedWordCount: serp.targetWordCount,
      competitorAvgWordCount: serp.avgWordCount,
      semanticTermsToCover: serp.sharedTerms.slice(0, 20).map(([w]) => w),
      top10Serp: serp.pages.map((p) => ({
        rank: p.rank,
        url: p.url,
        domain: (() => { try { return new URL(p.url).hostname.replace(/^www\./, ""); } catch { return null; } })(),
        title: p.title,
        wordCount: p.wordCount ?? null,
        ok: p.ok,
      })),
      competitorHeadingsSample: serp.pages
        .filter((p) => p.ok)
        .slice(0, 5)
        .map((p) => ({ url: p.url, h1: p.headings.h1, h2: p.headings.h2.slice(0, 8) })),
    },
    satellites: clusters.map((c) => ({
      theme: c.theme,
      intent: c.intent,
      totalVolume: c.totalVolume,
      articleIdeas: c.keywords.map((k) => ({
        title: k.keyword,
        volume: k.volume,
        difficulty: k.difficulty,
        intent: k.intent,
      })),
      internalLinkTo: pillarTarget.keyword,
    })),
    stats: {
      totalKeywordsAnalyzed: allKeywords.length,
      totalSatelliteClusters: clusters.length,
      totalSatelliteKeywords: clusters.reduce((s, c) => s + c.keywords.length, 0),
    },
  };
}

function slugify(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

// --- Pipeline -------------------------------------------------------------
(async () => {
  console.log(`[1/4] Mots-clés autour de "${SEED}" (loc=${LOCATION_CODE}, lang=${LANGUAGE_CODE})…`);
  const keywords = await gatherKeywords(SEED);
  console.log(`      ${keywords.length} mots-clés uniques.`);

  console.log(`[2/4] Sélection de la cible pilier…`);
  const pillar = pickPillarTarget(keywords, SEED);
  console.log(`      Cible : "${pillar.keyword}" (vol=${pillar.volume}, KD=${pillar.difficulty ?? "?"})`);

  console.log(`[3/4] Analyse SERP de "${pillar.keyword}"…`);
  const serp = await analyzeSerp(pillar.keyword);
  console.log(`      Longueur moyenne : ${serp.avgWordCount} mots → cible : ${serp.targetWordCount}`);

  console.log(`[4/4] Clustering des satellites…`);
  const clusters = clusterSatellites(keywords, pillar.keyword);
  console.log(`      ${clusters.length} clusters de satellites.`);

  const brief = buildBrief(SEED, pillar, serp, clusters, keywords);
  const slug = slugify(SEED);
  const dir = PROJECT_SLUG
    ? path.join(repoRoot, "projects", PROJECT_SLUG, "pillars", slug)
    : path.join(repoRoot, "pillars", slug);
  fs.mkdirSync(dir, { recursive: true });
  const out = path.join(dir, "brief.json");
  fs.writeFileSync(out, JSON.stringify(brief, null, 2));
  console.log(`\n✅ Brief écrit : ${path.relative(repoRoot, out)}`);
  console.log(`   slug=${slug}${PROJECT_SLUG ? `\n   project-slug=${PROJECT_SLUG}` : ""}`);
})().catch((e) => {
  console.error(`\n❌ ${e.message}`);
  process.exit(1);
});
