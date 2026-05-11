# Playbook 10 — Stratégie pilier + satellites (SEO + GEO)

> **Slash command** : [`/mentionable-pillar`](../.claude/commands/mentionable-pillar.md)
> **Pour qui** : SEO content, agence, in-house qui prépare un cluster éditorial
> **Livrable** : `projects/<projectSlug>/pillars/<slug>/plan.md` — plan pilier + N satellites enrichi du signal LLM

## Pourquoi

Le SEO classique te dit quoi écrire pour ranker sur la SERP Google (volume, KD, intent, sémantique).
Le GEO te dit quoi écrire pour ranker dans les réponses des LLMs (fan-outs, citations, concurrents LLM).

La plupart des stratégies de contenu n'utilisent qu'**un seul** des deux signaux. Cette commande croise les deux :

- **DataForSEO** sort le pilier + les satellites à partir d'un seed.
- **MCP Mentionable** enrichit chaque cluster avec : demande LLM réelle, concurrents qui dominent déjà les LLMs, sources d'autorité que les LLMs citent.

Le plan final priorise les articles à **double signal** (SERP + LLM) — c'est là que tu construis de l'autorité simultanément sur les 2 surfaces.

## Pré-requis

1. **MCP Mentionable** installé et un projet configuré ([docs/getting-started.md](../docs/getting-started.md)).
2. **Compte DataForSEO** + credentials dans `.env` ([docs/dataforseo-setup.md](../docs/dataforseo-setup.md)).
3. **Node ≥ 18** + `npm install` lancé une fois à la racine.

## Comment utiliser

### Via Claude Code

```
/mentionable-pillar cours de guitare
```

### Via Cursor / Claude Desktop / autre

Copie-colle le prompt complet de [`.claude/commands/mentionable-pillar.md`](../.claude/commands/mentionable-pillar.md) en remplaçant `$ARGUMENTS` par ton seed keyword.

### En CLI brut (sans LLM)

Si tu veux juste le brief DataForSEO sans la couche MCP/LLM :

```bash
npm run pillar -- "cours de guitare"
# → pillars/cours-de-guitare/brief.json
```

## Le pipeline en 8 étapes

1. **Pré-requis** — vérifie `.env`, `node_modules`, MCP disponible.
2. **DataForSEO** — `npm run pillar -- "<seed>"` produit `brief.json` (pilier + clusters + top 10 SERP).
3. **Lecture du brief** — l'agent parse le JSON pour orchestrer la suite.
4. **Cross-signal A — Demande LLM par cluster** — pour chaque cluster, `list_fan_outs(search: theme)` → tag `double_demande` / `serp_only` / `geo_dominant`.
5. **Cross-signal B — Concurrents SERP × LLM** — `list_competitors` une fois, flag binaire `LLM✓/✗` sur chaque URL du top 10 SERP.
6. **Cross-signal C — Sources d'autorité** — `list_llm_sources(promptIds)` → 8 domaines à citer en outbound dans pilier et satellites.
7. **Score recalculé** — `score_final = score_dataforseo × (1 + 0.5 × fanouts_freq_normalisée)`.
8. **Plan markdown** — écrit `projects/<projectSlug>/pillars/<slug>/plan.md` : pilier détaillé, satellites triés, maillage interne, roadmap.

## Ce qui rend ce plan différent

| Sortie classique pilier+satellites | Cette commande |
|---|---|
| Volume + KD par mot-clé | + fan-outs LLM cumulés par cluster |
| Top 10 SERP brut | + flag `LLM✓/✗` sur chaque domaine du top 10 |
| Sources à citer génériques | + domaines réellement cités par les LLMs sur ces prompts |
| Roadmap basée sur volume seul | + bump des clusters à double demande SERP+LLM |

## Coût et limites

- **Coût DataForSEO** : ~0.05-0.15 $ par run (1 $ de crédits gratuits à l'inscription).
- **Coût LLM (Claude/GPT)** : le scoring se fait côté agent, ~5-10 tool calls MCP par run.
- **Limite location** : un run = une localisation. Pour un site multi-pays, relance avec `--location` différent.
- **Pas de re-run automatique** : si `projects/<projectSlug>/pillars/<slug>/brief.json` existe déjà, l'agent demande avant de relancer DataForSEO.

## Chaînage avec les autres commandes

Le plan pilier+satellites est le **point de départ** d'un workflow éditorial complet :

```
/mentionable-pillar "cours de guitare"
  ↓ (plan.md avec N satellites priorisés)
/mentionable-brief "<satellite #1>"
  ↓ (brief.md détaillé pour l'article)
[rédaction]
  ↓
/mentionable-images articles/<slug>/article.md
  ↓ (illustrations cover + social + inline)
[publication]
```

Plus tard, pour vérifier la couverture :
- `/mentionable-content-gap` — détecte les fan-outs non encore couverts par le plan
- `/mentionable-weekly` — reporting hebdo de l'évolution de visibilité sur le cluster

## Exemple de livrable

Pour `npm run pillar -- "cours de guitare"`, le plan ressemble à :

```markdown
# Stratégie SEO + GEO : cours de guitare

## TL;DR
- Pilier retenu : `cours de guitare en ligne` (vol=8100, KD=45, intent=informational)
- 8 clusters satellites dont 3 à double demande SERP+LLM
- Niche LLM : 5/10 domaines top SERP dominent aussi les LLMs → mixte
- Prochaine action : satellite "débutant" (score 6420, double demande)

## 🏛️ Article pilier
...

## 🛰️ Pack satellites
### Satellite #1 — débutant  [double_demande]
- Intent : informational
- Volume cumulé : 4200
- Demande LLM : 12 fan-outs · LLMs : chatgpt, perplexity
- Score final : 6420
...
```

## Variantes

- **Multilingue** : pour un client international, relance `npm run pillar -- "<seed-traduit>" --location 2840 --language en` par marché. Tu obtiens un plan par pays.
- **Niche très technique** : si DataForSEO retourne trop peu de mots-clés, descends d'un cran de spécificité (ex : `kubernetes operator pattern` → `kubernetes operator`).
- **Site existant à auditer** : lance d'abord `/mentionable-audit` pour comprendre où tu en es, puis `/mentionable-pillar` sur les seeds prioritaires révélés par l'audit.
