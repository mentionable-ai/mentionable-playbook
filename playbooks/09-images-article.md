# Playbook 09 — Images d'article via Gemini

> Tu as rédigé un article (ou un brief). Cette commande te génère **les visuels associés** — cover hero, vignette sociale, illustrations inline — via l'API Google Gemini, sans quitter Claude Code.

## Objectif

Produire en une commande **1 à N images cohérentes** pour accompagner un article :
- Cover horizontale 16:9 (hero en haut de page)
- Vignette carrée 1:1 (LinkedIn, X, OG image)
- Illustrations inline pour appuyer des sections clés
- Schémas conceptuels simples (frameworks, comparaisons)

Toutes les images d'un même run partagent **une palette et un style** pour rester cohérentes éditorialement.

## Pour qui

- **Rédacteurs / content marketers** qui livrent l'article + ses visuels
- **SEO content** qui veut un visuel d'article rapidement, sans Midjourney ni Canva
- **Agences** qui industrialisent la production éditoriale GEO

## Pré-requis

- **Node.js ≥ 18** + **npm** (install : https://nodejs.org → "LTS" si tu ne l'as pas — pas besoin de connaître JS)
- **Clé API Google Gemini avec billing activé** (Tier 1) — voir [docs/gemini-api-key.md](../docs/gemini-api-key.md)
- L'article ou brief source : fichier `.md` local **ou** présent dans la conversation Claude en cours

## Setup (une seule fois)

```bash
# Depuis la racine du repo
npm install
cp .env.example .env
# édite .env, colle ta GEMINI_API_KEY
```

Voir [docs/images-setup.md](../docs/images-setup.md) pour le détail.

## Tools utilisés

- **Aucun MCP** — cette commande n'utilise pas Mentionable
- Script local : `scripts/generate-image.mjs` (wrapper sur `@google/genai`)
- Modèle : `gemini-2.5-flash-image` (alias "nano banana")

## Convention de structure

Chaque article vit dans son dossier sous `articles/` :

```
articles/cnv-au-travail/
├── index.md           ← contenu de l'article
└── images/            ← images générées
    ├── 1-cover.png
    └── ...
```

Dans le markdown, référence les images en relatif : `![alt](images/1-cover.png)`.

## Sur Claude Code

```
/mentionable-images articles/cnv-au-travail
```

```
/mentionable-images articles/cnv-au-travail/index.md
```

```
/mentionable-images           # utilise l'article du chat en cours
```

```
/mentionable-images "La CNV au travail"   # cherche un article matchant
```

Claude te demande :
1. **Combien d'images ?** (1, 2, 3, 4+)
2. **Quel style ?** (photo / illustration / 3D / sketch)
3. **Quels types ?** (cover / social / illustration / diagram, multi-select)

Puis il construit les prompts visuels (en anglais, palette cohérente), lance le script en parallèle, et écrit les fichiers dans `articles/<slug>/images/`.

## Sur Cursor / Claude Desktop / autre client

Si tu n'as pas Claude Code, copie-colle ce prompt dans ton client :

```text
Tu es un directeur artistique éditorial. À partir de l'article suivant, génère N images d'illustration via le script `scripts/generate-image.mjs`.

Article : <colle ici le contenu ou le chemin .md>
Nombre d'images : <N>
Types : <cover | social | illustration | diagram, liste>

Étapes :
1. Synthétise : titre, intent, 3-5 idées visuelles clés, tone, slug en kebab-case (max 40 char)
2. Pour chaque image, construis un prompt en anglais :
   - Sujet concret (objet, scène, métaphore)
   - Style : editorial flat illustration, minimal, professional, muted palette with one accent color
   - Ratio : 16:9 cover / 1:1 social / 4:3 illustration
   - Palette commune à toutes les images du run
   - Contraintes : pas de texte, pas de logo, pas d'UI
3. Pour chaque prompt, exécute en parallèle :
   npm run generate:image -- --prompt "<prompt>" --out "articles/<slug>/images/<n>-<type>.png" --aspect-ratio <16:9|1:1|4:3>
4. Écris articles/<slug>/images/prompts.json avec [{ file, type, section, prompt }]
5. Rends un récap (titre, dossier, liste des fichiers générés)

Règles : prompts en anglais, palette cohérente, jamais de texte dans l'image, ne ré-invente pas le contenu de l'article.
```

## Exemple de livrable

Pour l'article `articles/cnv-au-travail/index.md` avec 3 images (1 cover + 2 illustrations) :

```
articles/cnv-au-travail/
├── index.md
└── images/
    ├── 1-cover.png          # Cover 16:9 — deux collègues en dialogue apaisé
    ├── 2-illustration.png   # Section "désaccord avec un manager"
    ├── 3-illustration.png   # Section "poser ses limites"
    └── prompts.json         # Réutilisable pour itérer
```

Extrait de `prompts.json` :

```json
[
  {
    "file": "1-cover.png",
    "type": "cover",
    "section": "hero",
    "prompt": "Editorial flat illustration, 16:9 hero, two professional colleagues seated across a table in a light-filled office, having an empathetic conversation. Geometric simplified figures, no faces. Muted cream/sage/terracotta palette, single warm gold accent. No text, no logos."
  },
  {
    "file": "2-illustration.png",
    "type": "illustration",
    "section": "Le désaccord avec un manager",
    "prompt": "Editorial flat illustration, 4:3, a person calmly raising a hand to express disagreement in a meeting, the manager listens attentively. Same muted palette as cover. No text."
  }
]
```

## Utilisation CLI (sans Claude)

Le script est utilisable seul, sans passer par une commande slash :

```bash
npm run generate:image -- \
  --prompt "Professional editorial photography, 16:9, calm conversation at work, natural light." \
  --out articles/mon-article/images/1-cover.png \
  --aspect-ratio 16:9
```

Args :
- `--prompt` (requis) — description en anglais
- `--out` (requis) — chemin de sortie `.png`
- `--aspect-ratio` (optionnel) — défaut `16:9`. Valeurs : `1:1`, `16:9`, `9:16`, `4:3`, `3:4`, `3:2`, `2:3`, `21:9`, `5:4`, `4:5`
- `--model` (optionnel) — défaut `gemini-2.5-flash-image`

## Coût

1 image = 1 appel Gemini facturé. Tarifs : https://ai.google.dev/gemini-api/docs/pricing
Pour 3 images par article, compte quelques centimes.

## Variantes

- **Style photo réaliste** : remplace "editorial flat illustration" par "professional editorial photography, natural light, shallow depth of field"
- **Style isométrique** : "isometric illustration, 3/4 perspective, soft shadows, vector style"
- **Style sketch** : "hand-drawn sketch, ink lines, watercolor accents, journal aesthetic"
- **Cohérence sur N articles d'une même série** : fige la palette dans le prompt template ("always use palette: #F4EFE6 cream, #8A9A7B sage, #C97B4D terracotta")
- **Re-générer 1 image seule** : relance `npm run generate:image` avec le prompt depuis `prompts.json` et un autre `--out` (ex. `1-cover-v2.png`) pour itérer sans tout refaire

## Troubleshooting

| Erreur | Solution |
|---|---|
| `Cannot find module '@google/genai'` | `npm install` |
| `GEMINI_API_KEY manquante` | Crée `.env` depuis `.env.example` et renseigne ta clé |
| `429 free_tier_requests, limit: 0` | Active le billing — voir [docs/gemini-api-key.md](../docs/gemini-api-key.md) |
| Image avec du texte illisible | Reformule le prompt : ajoute "absolutely no text, no logos, no watermarks, no UI" |
| Style incohérent entre 2 images | Fige la palette HEX dans le template de prompt |

## Aller plus loin

- [Brief d'article complet](05-brief-article.md) — produit le brief en amont
- [Content gap](04-fan-outs-pour-briefs-articles.md) — choisis le prochain sujet
- [docs/gemini-api-key.md](../docs/gemini-api-key.md) — créer une clé Gemini avec billing
- [docs/images-setup.md](../docs/images-setup.md) — setup technique détaillé
