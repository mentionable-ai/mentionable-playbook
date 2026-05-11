# Playbook 11 — Rédaction d'article GEO-optimisé

> **Slash command** : [`/mentionable-article`](../.claude/commands/mentionable-article.md)
> **Pour qui** : SEO content, rédacteurs, coachs / consultants qui produisent leur propre contenu
> **Livrable** : `projects/<projectSlug>/articles/<slug>/` — article.md + jsonld.json + sources.json + meta.json

## Pourquoi

Rédiger un article *qui rank sur Google* ne suffit plus. Les LLMs (ChatGPT, Perplexity, Claude, Gemini) sélectionnent et citent des pages selon des critères mesurables — et ces critères ont été quantifiés par l'étude Princeton **"GEO: Generative Engine Optimization"** (Aggarwal et al., KDD 2024).

Cette commande applique systématiquement les 4 tactiques à plus fort lift :

| Tactique | Lift mesuré | Comment c'est appliqué ici |
|---|---|---|
| Cite_Sources | +30-40 % | ≥ 1 lien outbound par 300-400 mots vers des sources d'autorité |
| Quotation_Addition | +25-35 % | ≥ 2 citations directes attribuées nommément |
| Statistics_Addition | +25-30 % | ≥ 5 statistiques chiffrées sourcées |
| Fluency_Optimization | +15-25 % | Phrases courtes, voix active, vocabulaire précis |

En bonus, l'article inclut :
- **TL;DR / Key takeaway en 5 bullets** en haut (LLMs extraient souvent le 1er résumé autonome)
- **FAQ structurée** (matche People Also Ask + fan-outs LLM)
- **JSON-LD** (`Article` + `FAQPage` + `BreadcrumbList`) prêt à embarquer
- **Audit trail** des sources fetchées (`sources.json`)

## Pré-requis

1. **Lire `CLAUDE.md`** à la racine du repo. C'est le guide de style anti-détection IA (em-dashes interdits, vocabulaire banni, patterns à éviter). La commande l'impose en étape 0 et un check final BLOQUANT empêche d'écrire l'article si une règle est violée.
2. Node ≥ 18 (`node --version`).
2. **Optionnel** : un brief généré par [`/mentionable-brief`](../.claude/commands/mentionable-brief.md) ou un plan généré par [`/mentionable-pillar`](../.claude/commands/mentionable-pillar.md). Sinon la commande peut partir d'un sujet libre.
3. **Premier run** : tu seras invité à renseigner tes infos auteur (`name`, `url`, `jobTitle`, `organization`) → stockées dans `author.json` à la racine (gitignoré). Réutilisé pour tous les articles suivants.
4. Accès web pour `WebFetch` (les sources d'autorité sont fetchées en parallèle pour extraire stats/quotes réelles).

## Comment utiliser

### Depuis un brief existant

```
/mentionable-article articles/cnv/brief.md
```

### Depuis un plan pilier/satellite

```
/mentionable-article pillars/communication-non-violente
```

L'agent te demande lequel rédiger (pilier ou satellite #N).

### Depuis un sujet libre

```
/mentionable-article formation communication non violente
```

L'agent te suggère de générer un brief structuré d'abord, sinon part d'un outline minimal.

### Via Cursor / Claude Desktop / autre

Copie le prompt de [`.claude/commands/mentionable-article.md`](../.claude/commands/mentionable-article.md), remplace `$ARGUMENTS` par ton input.

## Pipeline en 8 étapes

1. **Résolution input** — détecte si `$ARGUMENTS` est un chemin .md, un dossier plan, ou un sujet libre.
2. **Auteur** — lit `author.json` ou crée le fichier interactivement.
3. **Fetch sources d'autorité** — 3 à 5 `WebFetch` en parallèle pour extraire stats / quotes / faits réels (anti-hallucination).
4. **Plan & longueur** — adapté à l'intent : pilier 3k-6k mots, satellite 1.2k-2.5k mots.
5. **Rédaction one-shot** — applique les 4 tactiques Princeton sur chaque H2.
6. **JSON-LD** — Article + FAQPage (si FAQ) + BreadcrumbList (si pilier/satellite).
7. **sources.json + meta.json** — audit trail + metadata exploitables.
8. **Résumé qualité** — comptes des outbound links, quotes, stats vs cibles Princeton.

## Output

```
projects/<projectSlug>/articles/<slug>/
├── article.md       # frontmatter YAML + corps markdown
├── jsonld.json      # @graph schema.org (Article, FAQPage, BreadcrumbList)
├── sources.json     # audit trail des URLs fetchées
└── meta.json        # title, slug, wordCount, h2Count, faqCount, etc.
```

Le `article.md` contient un **frontmatter YAML** (title, description, slug, date, author, keywords, wordCount) directement consommable par Astro, Hugo, Next.js, Gatsby, Jekyll, etc.

## Anti-hallucination

L'étude Princeton montre que le **lift de citation provient des faits réels**, pas du volume de texte. Donc :

- **Stats** : viennent de `WebFetch` ou de connaissances vérifiables (Wikipedia, sources institutionnelles).
- **Quotes** : textuelles depuis la source. Si pas d'accès au texte exact → paraphrase **sans guillemets**.
- **Si doute** : marqueur `[à vérifier]` laissé pour l'humain.

Le `sources.json` te permet de vérifier après coup quelles URLs ont été utilisées (audit éditorial).

## Chaînage workflow complet

```
/mentionable-pillar "seed keyword"
  ↓ (plan.md avec pilier + N satellites)
/mentionable-brief "<titre satellite>"
  ↓ (brief.md détaillé)
/mentionable-article projects/<projectSlug>/articles/<slug>/brief.md
  ↓ (article.md + jsonld.json + sources.json + meta.json)
/mentionable-images projects/<projectSlug>/articles/<slug>/article.md
  ↓ (images cover + social + illustrations dans projects/<projectSlug>/articles/<slug>/images/)
[publication]
```

Variante directe (sans brief intermédiaire) :

```
/mentionable-pillar "seed"
  ↓
/mentionable-article pillars/<slug>  # choix interactif pilier/satellite
  ↓
/mentionable-images projects/<projectSlug>/articles/<slug>/article.md
```

## Variantes

- **Article comparatif** : si l'intent du brief est `comparatif`, l'agent ajoute un tableau comparatif structuré (souvent fortement cité par les LLMs).
- **Article transactionnel** (page produit, page tarifs) : la grille Princeton s'applique moins ; à utiliser avec parcimonie sur ce type de contenu.
- **Rédaction multi-tour** : la commande est one-shot, mais tu peux relancer manuellement en demandant à l'agent de refondre H2 par H2 après lecture.
- **Mise à jour d'un article existant** : pour un refresh, lance la commande avec `projects/<projectSlug>/articles/<slug>/article.md` en input, l'agent te demande si tu veux écraser ou suffixer `-v2`.

## Coûts

- **Modèle Claude** : un article 3000 mots = ~50-80k tokens output, ~30-50k tokens input avec les WebFetch.
- **WebFetch** : 3-5 calls par article, inclus dans Claude Code.
- Pas de coût API tiers (pas de DataForSEO, pas de Gemini pour cette commande).

## Source académique

Aggarwal, P., Murahari, V., Rajpurohit, T., Kalyan, A., Narasimhan, K., & Deshpande, A. (2024). **GEO: Generative Engine Optimization**. *Proceedings of the 30th ACM SIGKDD Conference on Knowledge Discovery and Data Mining (KDD '24)*. [arXiv:2311.09735](https://arxiv.org/abs/2311.09735).
