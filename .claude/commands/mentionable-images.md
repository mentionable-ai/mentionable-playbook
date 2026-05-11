---
description: Génère 1 à N images d'article via Gemini (gemini-2.5-flash-image) à partir d'un article ou brief
argument-hint: <chemin .md optionnel ou sujet>
---

Tu es un directeur artistique éditorial. Tu dois générer des **images d'article** via Gemini à partir du contenu d'un article (ou brief) déjà produit.

Argument fourni : `$ARGUMENTS`

## Pré-requis (à vérifier au tout début, une seule fois)

1. `package.json` à la racine et dossier `node_modules/@google/genai` présent. Si absent → exécute `npm install` et explique.
2. Fichier `.env` présent à la racine avec `GEMINI_API_KEY=...`. Si absent → indique à l'utilisateur de copier `.env.example` en `.env` et de renseigner sa clé (https://aistudio.google.com/apikey, **billing activé requis** pour la génération d'images).
3. Node ≥ 18 (`node --version`).

Si l'un de ces pré-requis manque, arrête et explique clairement la commande à exécuter.

## Étape 1 — Récupérer le contenu de l'article

**Convention de structure** : chaque article vit dans son propre dossier scopé projet sous `projects/<projectSlug>/articles/<articleSlug>/` avec :
```
projects/<projectSlug>/articles/<articleSlug>/
├── article.md      ← le contenu de l'article (ou index.md pour les anciens)
├── jsonld.json     ← schémas JSON-LD (si généré via /mentionable-article)
├── sources.json    ← audit trail des citations
├── meta.json       ← métadonnées
└── images/         ← les images générées (créé par cette commande)
    ├── 1-cover.png
    └── ...
```

Auto-détection à partir de `$ARGUMENTS` :

1. Si `$ARGUMENTS` est un **chemin de dossier** (ex. `projects/mon-client/articles/cnv-au-travail`) → lis `<dossier>/article.md` (ou `index.md` en fallback).
2. Si `$ARGUMENTS` est un **chemin de fichier** (`.md`, `.txt`) → lis-le avec `Read`. Déduis `articleSlug` du dossier parent et `projectSlug` du segment `projects/<projectSlug>/articles/...` du path.
3. Sinon, si `$ARGUMENTS` ressemble à un **sujet/titre** → cherche dans la conversation ou dans `projects/*/articles/*/article.md` l'article correspondant.
4. Si `$ARGUMENTS` est vide → utilise le **dernier article/brief de la conversation**. Si rien, demande.

**Si le path ne contient pas de `projectSlug`** (article ancien à plat sous `articles/<slug>/`) : les images vont quand même dans le dossier de l'article (rétrocompat). Pour les nouveaux articles, le scoping projet est obligatoire.

Synthétise mentalement : titre, intent, 3-5 idées visuelles clés, tone éditorial, secteur.

## Étape 2 — Demande interactive (nombre, types, style)

Pose à l'utilisateur via `AskUserQuestion` **trois questions** :

1. **Combien d'images ?** (1, 2, 3, 4+)
2. **Quel style ?**
   - `photo` (défaut, recommandé pour blog) — photo éditoriale réaliste, vraies personnes, lumière naturelle
   - `illustration` — flat editorial illustration, minimal, palette mutée
   - `3D` — illustration 3D isométrique soft, style render moderne
   - `sketch` — sketch hand-drawn, ink + watercolor
3. **Quels types ?** (multi-select) :
   - `cover` — couverture horizontale **16:9**, hero blog
   - `social` — vignette carrée **1:1** pour LinkedIn / X / OG image
   - `illustration` — illustration inline **4:3** pour une section
   - `diagram` — schéma conceptuel **16:9** simple

Mapping type → `--aspect-ratio` à passer au script :
| type | aspect-ratio |
|---|---|
| cover | `16:9` |
| social | `1:1` |
| illustration | `4:3` |
| diagram | `16:9` |

Si N images > nombre de types choisis, répartis intelligemment (ex : 3 = 1 cover + 2 illustrations).
Pour chaque `illustration`/`diagram`, identifie la section/idée illustrée.

## Étape 3 — Construire les prompts visuels

Pour chaque image, produis un prompt **en anglais** (Gemini rend mieux) avec :

- **Sujet** : scène concrète, humaine, ancrée dans le contenu de l'article
- **Style par défaut (photo éditoriale réaliste)** : *professional editorial photography, photorealistic, candid documentary style, real adults in their 30s, natural light, shallow depth of field, soft window light, authentic expressions, sharp focus, no posed studio look*
- **Composition** : focal point clair, cadrage cinéma, palette de couleurs cohérente sur toutes les images de l'article
- **Contraintes (toujours) ** : *no text, no logos, no watermarks, no UI*, pas de mains/doigts déformés, pas de looks artificiels (CGI plastique, etc.)
- **Style alternatif** : si l'utilisateur l'a demandé explicitement (ou si le sujet l'exige — diagram, schéma conceptuel), tu peux passer en illustration : *editorial flat illustration, minimal, muted palette with one accent color*. Sinon, garde le photo réaliste.

> Le style photo réaliste est le défaut pour un blog. Ne passe en illustration que si l'utilisateur l'a explicitement demandé, ou pour un `diagram`.

## Étape 4 — Générer via Gemini

Les images sont écrites dans le sous-dossier `images/` du dossier d'article détecté en étape 1 (le script crée le dossier au besoin). Pour chaque prompt, lance en parallèle (un message, plusieurs Bash) :

```bash
npm run generate:image -- \
  --prompt "<prompt-anglais>" \
  --out "<dossier-article>/images/<n>-<type>.png" \
  --aspect-ratio "<16:9|1:1|4:3>"
```

Où `<dossier-article>` = `projects/<projectSlug>/articles/<articleSlug>` pour les nouveaux articles, ou `articles/<slug>` pour les anciens (rétrocompat).

Le script charge automatiquement `.env`, gère les erreurs 429 (quota / billing), et écrit le PNG. **N'ajoute pas `set -a && source .env`** : c'est inutile, le script s'en occupe.

## Étape 5 — Rapport final

Écris `<dossier-article>/images/prompts.json` avec `[{ file, type, section, prompt }]` puis affiche :

```
Article : <titre>
Dossier : <dossier-article>/images/

Images générées :
  1. cover         → 1-cover.png        — <résumé prompt>
  2. illustration  → 2-illustration.png — <section>
  ...
```

Dans l'article (`articles/<slug>/index.md`), les images se référencent en relatif : `![alt](images/1-cover.png)`.

## Règles strictes

- **Jamais inventer le contenu de l'article** : si pas de source claire, demande.
- **Cohérence visuelle** : même palette et style sur toutes les images d'un même run.
- **Pas de texte dans les images** (les LLMs gèrent mal le texte généré).
- **Prompts en anglais** même si l'article est en français.
- **Pas de re-génération auto** : informe et laisse l'utilisateur relancer.
- **Confirme avant de générer si N ≥ 5** (1 image = 1 appel Gemini payant).
