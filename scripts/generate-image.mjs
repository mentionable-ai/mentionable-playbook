#!/usr/bin/env node
/**
 * Génère une image via Gemini (gemini-2.5-flash-image) à partir d'un prompt.
 *
 * Usage:
 *   node scripts/generate-image.mjs --prompt "<prompt>" --out "<chemin/file.png>" \
 *     [--aspect-ratio 16:9|1:1|4:3|3:4|9:16|3:2|2:3] [--model <model>]
 *   npm run generate:image -- --prompt "..." --out images/foo.png --aspect-ratio 16:9
 *
 * Variables d'environnement (auto-chargées depuis .env à la racine du repo):
 *   GEMINI_API_KEY (requis) — obtenue sur https://aistudio.google.com/apikey
 *                            billing activé requis pour la génération d'images.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI } from "@google/genai";

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
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        out[key] = next;
        i++;
      } else {
        out[key] = true;
      }
    }
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));
const prompt = args.prompt || process.env.GEMINI_PROMPT;
const outPath = args.out || process.env.GEMINI_OUT;
const model = args.model || "gemini-2.5-flash-image";
const aspectRatio = args["aspect-ratio"] || process.env.GEMINI_ASPECT_RATIO || "16:9";

const ALLOWED_RATIOS = new Set(["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "21:9", "5:4", "4:5"]);
if (!ALLOWED_RATIOS.has(aspectRatio)) {
  console.error(`Erreur: aspect-ratio invalide "${aspectRatio}". Valeurs: ${[...ALLOWED_RATIOS].join(", ")}`);
  process.exit(2);
}

if (!prompt || !outPath) {
  console.error("Usage: node scripts/generate-image.mjs --prompt \"<prompt>\" --out <path.png> [--aspect-ratio 16:9]");
  process.exit(2);
}
if (!process.env.GEMINI_API_KEY) {
  console.error("Erreur: GEMINI_API_KEY manquante. Copie .env.example en .env et renseigne ta clé.");
  console.error("→ https://aistudio.google.com/apikey");
  process.exit(2);
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

try {
  const res = await ai.models.generateContent({
    model,
    contents: prompt,
    config: { imageConfig: { aspectRatio } },
  });
  const parts = res.candidates?.[0]?.content?.parts || [];
  const img = parts.find((p) => p.inlineData)?.inlineData;
  if (!img) {
    console.error("Aucune image retournée. Réponse brute :");
    console.error(JSON.stringify(res).slice(0, 800));
    process.exit(1);
  }
  fs.writeFileSync(outPath, Buffer.from(img.data, "base64"));
  console.log(`✓ ${outPath}`);
} catch (err) {
  if (err?.status === 429) {
    console.error("Erreur 429 — quota dépassé.");
    console.error("La génération d'images Gemini nécessite un projet Google AI Studio avec billing activé.");
    console.error("→ https://aistudio.google.com/apikey  (sélectionne ton projet → Set up Billing)");
    process.exit(3);
  }
  console.error("Erreur Gemini:", err?.message || err);
  process.exit(1);
}
