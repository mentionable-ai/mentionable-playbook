# Setup — Génération d'images (`/mentionable-images`)

La commande `/mentionable-images` génère des images d'article (cover, social, illustrations) via l'API **Google Gemini** (`gemini-2.5-flash-image`). Elle est optionnelle — toutes les autres commandes du playbook fonctionnent sans.

## Pré-requis

- **Node.js ≥ 18** (`node --version`)
- **npm** (livré avec Node)
- **Clé API Google Gemini** avec billing activé sur le projet

### Pas encore Node.js ?

Vérifie d'abord dans un terminal :

```bash
node --version
```

Si ça affiche `v18.x.x` ou plus, tu es bon. Sinon :

- **macOS** :
  - Le plus simple : télécharge l'installeur sur https://nodejs.org (choisis "LTS")
  - Ou via Homebrew : `brew install node`
- **Windows** :
  - Télécharge l'installeur sur https://nodejs.org (choisis "LTS")
  - Ou via winget : `winget install OpenJS.NodeJS.LTS`
- **Linux (Ubuntu/Debian)** :
  - `sudo apt install nodejs npm` (vérifie la version, parfois il faut [NodeSource](https://github.com/nodesource/distributions))

Tu n'as **pas besoin** de connaître JavaScript ni de comprendre Node pour utiliser la commande. C'est juste le runtime qui exécute le script de génération d'images en arrière-plan.

## Installation

```bash
# Depuis la racine du repo
npm install
```

Cela installe `@google/genai` localement dans `node_modules/`.

## Configuration de la clé Gemini

> 📘 **Walkthrough complet pas-à-pas** : voir [gemini-api-key.md](gemini-api-key.md) (méthode AI Studio + méthode GCP Console + troubleshooting).

Résumé express :

1. Va sur https://aistudio.google.com/api-keys
2. Crée (ou sélectionne) un projet et génère une clé
3. **Active le billing** sur le projet — le free tier ne permet pas la génération d'images (`limit: 0`)
4. Copie le fichier d'exemple :

```bash
cp .env.example .env
```

5. Ouvre `.env` et colle ta clé :

```
GEMINI_API_KEY=AIza...
```

> `.env` est ignoré par git — ta clé reste locale.

## Vérification

```bash
npm run generate:image -- \
  --prompt "Editorial flat illustration, minimal, two colleagues talking calmly in a bright office, muted palette." \
  --out articles/test/images/cover.png
```

Tu dois voir `✓ articles/test/images/cover.png`. Sinon :

- `Erreur: GEMINI_API_KEY manquante` → vérifie `.env`
- `429 — quota dépassé` → active le billing sur ton projet Google AI Studio
- `Cannot find module '@google/genai'` → lance `npm install`

## Convention de structure des articles

Chaque article vit dans son propre dossier sous `articles/` :

```
articles/
└── mon-article/
    ├── index.md        ← contenu de l'article
    └── images/         ← images générées (créées par la commande)
        ├── 1-cover.png
        ├── 2-illustration.png
        └── prompts.json
```

Dans le markdown, référence les images en relatif : `![alt](images/1-cover.png)`.

## Utilisation depuis Claude Code

```text
/mentionable-images articles/mon-article
```

ou en passant directement le fichier markdown :

```text
/mentionable-images articles/mon-article/index.md
```

Claude lit l'article, demande combien d'images, quel style et quels types (cover / social / illustration / diagram), construit les prompts, et appelle le script en parallèle. Les images sont écrites dans `articles/<slug>/images/`.

## Coût

Chaque image = 1 appel Gemini. Tarif à jour : https://ai.google.dev/gemini-api/docs/pricing

## Utilisation hors Claude (CLI directe)

Le script est utilisable seul :

```bash
npm run generate:image -- \
  --prompt "<prompt en anglais>" \
  --out articles/mon-article/images/cover.png \
  --aspect-ratio 16:9 \
  --model gemini-2.5-flash-image
```

Args :
- `--prompt` (requis) — description de l'image en anglais
- `--out` (requis) — chemin de sortie `.png`
- `--aspect-ratio` (optionnel) — défaut `16:9`. Valeurs : `1:1`, `16:9`, `9:16`, `4:3`, `3:4`, `3:2`, `2:3`, `21:9`, `5:4`, `4:5`
- `--model` (optionnel) — défaut `gemini-2.5-flash-image`
