# Mentionable Playbook

> Le playbook open-source pour faire du **GEO actionnable** depuis Claude Code, Cursor ou Claude Desktop. Du signal brut LLM jusqu'à l'article publié, en 5 commandes chaînables.

[Mentionable](https://mentionable.ai) est une plateforme de **GEO (Generative Engine Optimization)** : tracking, mesure et acquisition de visibilité dans les LLMs (ChatGPT, Perplexity, Gemini, Claude, Google AIO/AI Mode, Copilot, Grok).

Le **MCP Mentionable** expose ces données à un agent IA. Ce repo contient **12 slash commands** prêtes à l'emploi et leurs playbooks détaillés. Tout est scopé par projet client, persistant sur disque, et conçu pour s'enchaîner naturellement.

## Pour qui ?

- **Consultant SEO freelance** — auditer un nouveau client en 2 minutes, livrer un reporting hebdo automatisé, produire des piliers prêts à publier.
- **SEO in-house** — monitorer la visibilité GEO de son entreprise, prioriser le contenu et les backlinks à partir du signal LLM réel.
- **Agence SEO** — industrialiser le diagnostic et la production sur N clients, chacun rangé dans son dossier projet.
- **Agence web** — proposer une offre GEO crédible sans construire l'outillage.

## Use cases pratiques

### 1. Tu prends en charge un nouveau client SEO (3 jours)

```
Jour 1 — Diagnostic
  /mentionable-audit                        → audit GEO exec-ready
  /mentionable-sov                          → Share of Voice par LLM
  /mentionable-reverse <concurrent>         → reverse engineering d'un dominant

Jour 2 — Stratégie contenu
  /mentionable-clusters                     → clusters thématiques des fan-outs
  /mentionable-pillar "<seed top cluster>"  → plan pilier+satellites (DataForSEO + LLM)
  /mentionable-content-gap                  → backlog éditorial complémentaire

Jour 3 — Production
  /mentionable-article <plan pilier>        → article complet GEO Princeton + JSON-LD
  /mentionable-images <article>             → 4 visuels (cover + social + flat)
```

Livrables fournis au client : audit exec-ready, plan éditorial 10+ articles, premier article publiable. Tout est sous `projects/<client>/` prêt à backup.

### 2. Tu veux produire 5 articles GEO-optimisés pour ton site

```
/mentionable-clusters                       → choisis 5 clusters non couverts
for cluster in top5:
  /mentionable-pillar "<seed>" --from-cluster <path>
  /mentionable-article <plan>
  /mentionable-images <article>
```

Chaque article inclut TL;DR, FAQ, citations sourcées, statistiques, JSON-LD (`Article` + `FAQPage` + `BreadcrumbList`), audit trail des sources fetchées. Anti-détection IA appliquée automatiquement via [`CLAUDE.md`](CLAUDE.md).

### 3. Tu fais du reporting hebdo client

```
/mentionable-weekly                         → reporting hebdo automatisé
/mentionable-reddit-triage                  → opportunités d'outreach Reddit
/mentionable-backlinks                      → plan d'achat de backlinks priorisé
```

3 livrables exec-ready en 5 minutes, à envoyer en PDF ou Slack au client.

### 4. Tu refresh la stratégie d'un client tous les 2 mois

```
/mentionable-clusters <projet>              → nouveau snapshot daté

L'historique daté sous `discovery/<date>/` te permet de tracker l'évolution des fan-outs LLM mois sur mois (nouveaux thèmes, hausse de fréquence, concurrents émergents).

## Démarrage rapide

```bash
# 1. Cloner le repo
git clone https://github.com/mentionable-ai/mentionable-playbook.git
cd mentionable-playbook

# 2. Installer le MCP Mentionable (voir docs/getting-started.md)

# 3. Optionnel : npm install si tu veux DataForSEO (/mentionable-pillar) ou Gemini (/mentionable-images)
npm install

# 4. Ouvrir le repo dans Claude Code et choisir ton point d'entrée :
#    - Tu découvres un projet client :   /mentionable-audit
#    - Tu veux produire du contenu :     /mentionable-clusters
```

Si tu n'as pas Claude Code, chaque playbook contient le **prompt complet à copier-coller** dans Cursor, Claude Desktop ou tout autre client compatible MCP.

## Les 12 commandes, par phase de workflow

### 🔍 Diagnostic & analyse

| #  | Commande                                                                       | Pour qui              | Livrable                                     |
| -- | ------------------------------------------------------------------------------ | --------------------- | -------------------------------------------- |
| 1  | [`/mentionable-audit`](.claude/commands/mentionable-audit.md)                  | Tous, jour 1          | Audit GEO complet exec-ready                 |
| 2  | [`/mentionable-sov`](.claude/commands/mentionable-sov.md)                      | Consultant, agence    | Share of Voice par LLM + heatmap             |
| 3  | [`/mentionable-reverse`](.claude/commands/mentionable-reverse.md)              | Tous                  | Reverse engineering d'un concurrent          |
| 4  | [`/mentionable-content-gap`](.claude/commands/mentionable-content-gap.md)      | SEO content, in-house | Backlog éditorial issu des fan-outs          |
| 5  | [`/mentionable-clusters`](.claude/commands/mentionable-clusters.md)            | SEO content, agence   | Clusters de fan-outs par thème + intent, passerelle vers `/mentionable-pillar` |

### ✍️ Production de contenu

| #  | Commande                                                                       | Pour qui              | Livrable                                     |
| -- | ------------------------------------------------------------------------------ | --------------------- | -------------------------------------------- |
| 6  | [`/mentionable-pillar`](.claude/commands/mentionable-pillar.md)                | SEO content, agence   | Plan pilier+satellites SEO+GEO (DataForSEO × LLM) |
| 7  | [`/mentionable-brief`](.claude/commands/mentionable-brief.md)                  | Rédacteurs, content   | Brief d'article complet                      |
| 8  | [`/mentionable-article`](.claude/commands/mentionable-article.md)              | Rédacteurs, content   | Article complet GEO-optimisé (Princeton) + JSON-LD |
| 9  | [`/mentionable-images`](.claude/commands/mentionable-images.md)                | Content, rédacteurs   | 4 images d'article via Gemini (cover, social, flat) |

### 🔗 Outreach & link building

| #  | Commande                                                                       | Pour qui              | Livrable                                     |
| -- | ------------------------------------------------------------------------------ | --------------------- | -------------------------------------------- |
| 10 | [`/mentionable-reddit-triage`](.claude/commands/mentionable-reddit-triage.md)  | Community, growth     | Triage hebdo des opportunités Reddit         |
| 11 | [`/mentionable-backlinks`](.claude/commands/mentionable-backlinks.md)          | Link builder, agence  | Plan d'achat de backlinks priorisé           |

### 📊 Reporting

| #  | Commande                                                                       | Pour qui              | Livrable                                     |
| -- | ------------------------------------------------------------------------------ | --------------------- | -------------------------------------------- |
| 12 | [`/mentionable-weekly`](.claude/commands/mentionable-weekly.md)                | Consultant, freelance | Reporting hebdo client                       |

Chaque commande a son **playbook .md équivalent** dans [`playbooks/`](playbooks/) avec contexte, prompt brut, exemple de livrable et variantes.

## Workflow complet : du signal LLM à l'article publié

```
/mentionable-clusters <projet>
       ↓ projects/<projet>/discovery/<date>/clusters.json (seeds prêts, daté)
       ↓
       ↓ choisir un cluster
       ↓
/mentionable-pillar "<seed>" --from-cluster <path>
       ↓ projects/<projet>/pillars/<seed>/plan.md (pilier + N satellites SEO×GEO)
       ↓
/mentionable-brief "<titre>"  [optionnel, pour briefer un rédacteur humain]
       ↓
/mentionable-article <path>
       ↓ projects/<projet>/articles/<slug>/article.md (+ jsonld.json + sources.json + meta.json)
       ↓
/mentionable-images <article>
       ↓ projects/<projet>/articles/<slug>/images/{1-cover, 2-3-illustration, 4-illustration-flat}.png
       ↓
[publication]
```

Le pipeline est **modulaire** : chaque étape produit un fichier réutilisable, chacune peut être relancée indépendamment, et tout est tracé dans le filesystem sous `projects/<projet>/`.

## Garanties qualité intégrées

Ce repo n'est pas juste un set de prompts. Il intègre 4 mécanismes qui rendent la production fiable et auditable :

1. **Tactiques GEO validées par la recherche académique** — `/mentionable-article` applique les 4 tactiques mesurées par l'étude Princeton ["GEO: Generative Engine Optimization"](https://arxiv.org/abs/2311.09735) (Aggarwal et al., KDD 2024) : `Cite_Sources` (+30-40%), `Quotation_Addition` (+25-35%), `Statistics_Addition` (+25-30%), `Fluency_Optimization` (+15-25%). Compteurs affichés dans le résumé final.

2. **Anti-détection IA stricte** — [`CLAUDE.md`](CLAUDE.md) est chargé automatiquement à chaque conversation : em-dashes interdits, ~25 mots/expressions IA-typiques bannis, patterns détectables (anaphores triples, "pas X mais Y" en rafale) plafonnés. Check QA bloquant avant écriture de l'article.

3. **Anti-hallucination par sources fetchées** — `/mentionable-article` lance 3-5 `WebFetch` en parallèle sur les sources d'autorité du brief pour extraire stats et quotes réelles. Le fichier `sources.json` garde l'audit trail des URLs effectivement utilisées.

4. **Cross-signal SERP × LLM** — `/mentionable-pillar` croise DataForSEO (volume Google, top 10 SERP, KD) avec le MCP Mentionable (fan-outs LLM par cluster, concurrents trackés, sources d'autorité LLM) pour distinguer les vrais doubles signaux des opportunités SERP-only ou GEO-only.

## Convention projets Mentionable

Tous les livrables sont scopés par projet Mentionable sous `projects/<projet-slug>/` (slug dérivé du nom récupéré via le MCP). Un fichier `.project.json` au niveau projet stocke `projectId` + `projectName` pour que les commandes downstream retrouvent le projet sans re-demander.

```
projects/
└── mon-client/
    ├── .project.json
    ├── discovery/
    │   └── 2026-05-11/
    │       ├── clusters.json     ← seeds prêts, machine-readable
    │       ├── clusters.md       ← rapport human-readable
    │       └── fan-outs-raw.json ← audit trail
    ├── pillars/
    │   └── communication-non-violente/
    │       ├── brief.json        ← output DataForSEO
    │       └── plan.md           ← plan pilier+satellites
    └── articles/
        └── cnv-au-travail/
            ├── article.md        ← frontmatter + corps GEO
            ├── jsonld.json       ← Article + FAQPage + BreadcrumbList
            ├── sources.json      ← audit trail des citations
            ├── meta.json         ← wordCount, h2Count, …
            └── images/
                └── 1-cover.png
```

Le dossier `projects/` est **gitignoré par défaut** (contenu client confidentiel). Pour un usage agence multi-clients, chaque sous-dossier est trivial à backup/share/transmettre isolément (`tar czf mon-client.tar.gz projects/mon-client/`).

## Pré-requis selon les commandes

| Commande | Pré-requis | Coût indicatif |
|---|---|---|
| `/mentionable-audit`, `-sov`, `-reverse`, `-content-gap`, `-clusters`, `-brief`, `-reddit-triage`, `-backlinks`, `-weekly` | MCP Mentionable installé | Gratuit (juste des calls MCP) |
| `/mentionable-pillar` | + Node ≥ 18 + compte [DataForSEO](https://app.dataforseo.com) (1 $ offert) | ~0.05-0.15 $ par run |
| `/mentionable-article` | + accès web (WebFetch) | Gratuit côté API tiers |
| `/mentionable-images` | + Node ≥ 18 + clé [Google Gemini](https://aistudio.google.com/apikey) (billing activé) | ~0.04-0.20 $ pour 4 images |

Setup détaillé : [docs/getting-started.md](docs/getting-started.md) · [docs/dataforseo-setup.md](docs/dataforseo-setup.md) · [docs/images-setup.md](docs/images-setup.md) · [docs/gemini-api-key.md](docs/gemini-api-key.md).

## Documentation

- [Getting started](docs/getting-started.md) — installer le MCP, créer un projet, premiers appels
- [Concepts GEO](docs/concepts.md) — fan-outs, citations, Share of Voice, vocabulaire
- [Tools reference](docs/tools-reference.md) — cheatsheet des 12 tools MCP
- [Images setup](docs/images-setup.md) — configurer Gemini pour `/mentionable-images`
- [Créer une clé Gemini avec billing](docs/gemini-api-key.md) — walkthrough AI Studio / GCP Console
- [DataForSEO setup](docs/dataforseo-setup.md) — configurer DataForSEO pour `/mentionable-pillar`
- [CLAUDE.md](CLAUDE.md) — guidelines de style anti-détection IA (chargé automatiquement)

## Contribuer

Tu as un workflow GEO qui marche bien chez tes clients ? Ouvre une PR.
Voir [CONTRIBUTING.md](CONTRIBUTING.md).

## Licence

MIT — utilise, fork, adapte chez tes clients sans restriction.

---

**Maintenu par** [Mentionable](https://mentionable.ai)
