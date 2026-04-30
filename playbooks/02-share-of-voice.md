# Playbook 02 — Share of Voice par LLM

> "On est devant ou derrière ? Sur quel LLM ?"
> Cette analyse croisée concurrent × LLM montre où on gagne, où on perd, et où concentrer les efforts.

## Objectif

Produire une **heatmap Share of Voice** par LLM (ChatGPT, Perplexity, Gemini, Claude, AIO, AI Mode, Copilot, Grok) pour identifier les zones de faiblesse et de force du projet.

## Pour qui

- **Consultant SEO** qui doit prioriser le travail (quel LLM attaquer en premier ?)
- **Agence SEO** qui pilote plusieurs clients et compare les profils GEO
- **SEO in-house** qui doit justifier des arbitrages contenu / backlinks au comité de direction

## Pré-requis

- MCP Mentionable installé
- Concurrents `CONFIRMED` (sans ça, la heatmap est vide ou peu utile)
- 7+ jours de tracking pour des % stables

## Tools MCP utilisés

- `list_projects`
- `list_competitors` — mentions par LLM
- `list_prompts` — taux de visibilité par LLM
- `list_llm_sources` — détection des LLMs actifs

## Sur Claude Code

```
/mentionable-sov
```

Avec un projet précis :

```
/mentionable-sov nom-du-projet
```

## Sur Cursor / Claude Desktop / autre client

```text
Tu es un consultant GEO senior. Produis une analyse de Share of Voice par LLM.

1. list_projects() → projectId
2. En parallèle :
   - list_competitors(projectId, filters.status: ["CONFIRMED"], limit: 30, sortBy: "mentions_desc")
   - list_prompts(projectId, limit: 100)
   - list_llm_sources(projectId, limit: 30, sortBy: "appearances_desc")

3. Construis une matrice concurrent × LLM (SoV en %).

4. Rends un rapport :
   - Heatmap (tableau markdown, ligne par concurrent, colonne par LLM)
   - Lecture rapide (3-5 bullets factuels)
   - Zones de faiblesse (LLMs où SoV < 15%)
   - Zones de force (LLMs où SoV > 30%)
   - 3 actions prioritaires

Règles : pas d'invention, écrire "–" si donnée manquante, tone exec.
```

## Exemple de livrable

```markdown
# Share of Voice par LLM — Acme SaaS

## 1. Heatmap concurrent × LLM

| Concurrent | ChatGPT | Perplexity | Gemini | Claude | AIO | **Global** |
|---|---|---|---|---|---|---|
| CompetitorA | 38% | 22% | 31% | 35% | 28% | **31%** |
| **Acme SaaS (nous)** | **18%** | **41%** | **8%** | **22%** | **12%** | **20%** |
| CompetitorB | 14% | 17% | 19% | 12% | 21% | **17%** |
| CompetitorC | 11% | 9% | 14% | 8% | 15% | **11%** |
| CompetitorD | 7% | 4% | 12% | 9% | 8% | **8%** |

## 2. Lecture rapide

- On est **leader sur Perplexity** (41%, +19 pts vs CompetitorA)
- On est **4ème sur Gemini** (8%) — gros décrochage sur ce LLM
- CompetitorA domine partout sauf Perplexity
- Aucun concurrent ne dépasse 30% sur AIO → terrain peu défendu, opportunité

## 3. Zones de faiblesse

| LLM | Notre SoV | Concurrent dominant | Écart |
|---|---|---|---|
| Gemini | 8% | CompetitorA (31%) | -23 pts |
| AIO | 12% | CompetitorA (28%) | -16 pts |
| ChatGPT | 18% | CompetitorA (38%) | -20 pts |

## 4. Zones de force

| LLM | Notre SoV | Posture | Risque |
|---|---|---|---|
| Perplexity | 41% | leader confortable | CompetitorA en croissance (+5 pts vs M-1) |
| Claude | 22% | challenger | stable |

## 5. 3 actions prioritaires

1. **Attaquer Gemini en priorité** — écart -23 pts vs CompetitorA
   — Pourquoi : Gemini consulte des sources différentes (souvent plus institutionnelles)
   — Comment : `/mentionable-content-gap` puis filtrer sur fan-outs Gemini

2. **Reverse engineering de CompetitorA** — leader 4 LLMs sur 5
   — Pourquoi : il faut comprendre ses canaux pour répliquer
   — Comment : `/mentionable-reverse CompetitorA`

3. **Investir AIO avant que les concurrents s'y installent**
   — Pourquoi : aucun concurrent > 30%, fenêtre encore ouverte
   — Comment : `/mentionable-backlinks` ciblé sur sources qui ressortent dans AIO
```

## Variantes

- **SoV mensuel** : ajoute "compare avec les 30 derniers jours" pour voir les évolutions
- **SoV par catégorie** : si tu as des catégories de prompts, demande "segmente par catégorie"
- **SoV pays-spécifique** : `filters.country: "FR"` sur `list_prompts`

## Aller plus loin

- [Reverse engineering du concurrent dominant](03-reverse-engineering-concurrents.md)
- [Content gap par LLM](04-fan-outs-pour-briefs-articles.md)
- [Reporting hebdo qui suit la SoV dans le temps](08-reporting-hebdo-geo.md)
