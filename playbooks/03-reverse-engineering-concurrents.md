# Playbook 03 — Reverse engineering d'un concurrent

> "Pourquoi ce concurrent ranke mieux que moi dans les LLMs ?"
> Cette commande décortique ses canaux d'acquisition GEO et te sort une liste d'outreach prioritaires.

## Objectif

Pour un concurrent confirmé, comprendre **par quels canaux il gagne en visibilité** (médias sectoriels, comparateurs, Reddit, annuaires, doc on-site, etc.) et en sortir 3 cibles outreach actionnables cette semaine.

## Pour qui

- **Consultant SEO / agence** qui doit justifier une stratégie GEO à un client
- **SEO in-house** qui veut combler son retard sur un leader
- **Link builder** qui cherche des cibles d'outreach pertinentes
- **PMM / growth** qui veut comprendre la stratégie GEO d'un compétiteur

## Pré-requis

- MCP Mentionable installé
- Au moins 1 concurrent au statut `CONFIRMED` dans le projet
- Idéalement : 7+ jours de tracking (sinon les mentions sont trop volatiles)

## Tools MCP utilisés

- `list_projects` — sélection projet
- `list_competitors` — résolution du concurrent
- `list_competitor_sources` — domaines qui citent ce concurrent
- `list_llm_sources` — comparaison avec notre écosystème

## Sur Claude Code

```
/mentionable-reverse CompetitorA
```

Sans argument, l'agent te proposera le top 10 par Share of Voice :

```
/mentionable-reverse
```

## Sur Cursor / Claude Desktop / autre client MCP

Copie-colle ce prompt :

```text
Tu es un consultant GEO senior. Fais un reverse engineering du concurrent <NOM> dans Mentionable.

1. list_projects() → projectId (demander si plusieurs)
2. list_competitors(projectId, filters.nameContains: "<NOM>", filters.status: ["CONFIRMED", "SUGGESTED"]) → competitorId
3. list_competitor_sources(projectId, competitorId, limit: 50, sortBy: "mentions_desc")
4. list_llm_sources(projectId, limit: 100, sortBy: "appearances_desc") pour comparer

Rends un rapport markdown :
- Vue d'ensemble (mentions, LLMs, force perçue)
- Top 10 domaines qui le citent (tableau avec Type et Position vs nous : "Avantage exclusif" ou "Terrain commun")
- Top URLs précises (extraites de topUrls)
- Pattern d'acquisition (3-5 bullets factuels)
- 3 cibles outreach prioritaires (avec angle d'approche)

Règles : données uniquement, pas de jugement de qualité du concurrent, tone exec.
```

## Exemple de livrable

```markdown
# Reverse engineering — CompetitorA

**Mentions totales** : 187 · **LLMs où il apparaît** : ChatGPT, Perplexity, Gemini, Claude, AIO · **Statut** : CONFIRMED

## 1. Vue d'ensemble

- Domaines qui le citent (top 50) : 38
- Type dominant : comparateurs (42% des mentions) + Reddit (24%)
- Force perçue : leader

## 2. Top 10 domaines qui le citent

| Domaine | Mentions | LLMs | Type | Position vs nous |
|---|---|---|---|---|
| g2.com | 31 | 5/5 | comparateur | Terrain commun |
| reddit.com | 27 | 4/5 | Reddit | Terrain commun |
| capterra.com | 19 | 4/5 | comparateur | Terrain commun |
| competitora.com | 14 | 5/5 | doc concurrent | Avantage exclusif |
| trustpilot.com | 11 | 3/5 | reviews | Avantage exclusif |
| [media-sectoriel].com | 9 | 3/5 | média sectoriel | Avantage exclusif |
| getapp.com | 8 | 2/5 | comparateur | Terrain commun |
| producthunt.com | 7 | 2/5 | annuaire | Terrain commun |
| alternativeto.net | 6 | 2/5 | annuaire | Avantage exclusif |
| [forum-vertical].com | 5 | 2/5 | forum | Avantage exclusif |

## 3. Top URLs précises

- **g2.com**
  - `https://g2.com/products/competitora/reviews` — "CompetitorA est cité comme leader pour les PME"
  - `https://g2.com/categories/[catégorie]` — "CompetitorA en position #2 du classement"
- **reddit.com**
  - `https://reddit.com/r/[subreddit]/comments/abc/best-tool-for...` — "thread de 230 commentaires, CompetitorA mentionné 14 fois"
- **competitora.com**
  - `https://competitora.com/blog/comparison-page` — "page comparative qui se positionne sur les requêtes 'CompetitorA vs X'"

## 4. Pattern d'acquisition

- **Capitalise massivement sur les comparateurs** : G2, Capterra et GetApp = 58 mentions cumulées (31% du total)
- **Présence Reddit organique forte** sur r/[subreddit] et r/[autre] (27 mentions, 4/5 LLMs)
- **SEO on-site agressif** : son propre domaine génère 14 mentions via des pages comparatives "CompetitorA vs X"
- **Présence éditoriale ciblée** : 1 article de [media-sectoriel] qui revient sur 3 LLMs
- **Annuaires alternatifs** (alternativeto, producthunt) : 13 mentions cumulées

## 5. 3 cibles outreach prioritaires

1. **trustpilot.com** — 11 mentions concurrent, 0 chez nous
   — Angle : monter une page Trustpilot active, répondre aux reviews négatives, atteindre la masse critique d'avis

2. **[media-sectoriel].com** — 9 mentions concurrent, 0 chez nous
   — Angle : pitch d'un article comparatif ou d'une tribune ; ce média a une autorité forte et est lu par 3/5 LLMs

3. **alternativeto.net** — 6 mentions concurrent, 0 chez nous
   — Angle : créer/réclamer notre fiche, lister CompetitorA comme alternative pour bénéficier de son trafic GEO
```

## Variantes

- **Reverse multi-concurrents** : "Compare CompetitorA et CompetitorB sur leurs sources" → utile pour identifier les domaines qui citent les deux mais pas nous
- **Reverse par LLM** : "Concentre-toi uniquement sur Perplexity" → si on perd particulièrement sur un moteur
- **Reverse condensé** : "Sors-moi juste le top 5 sources et 3 actions" → pour démo client express

## Aller plus loin

- [Plan d'achat de backlinks](07-backlinks-prioritisation.md) — convertir les "Avantage exclusif" en achats priorisés
- [Reddit outreach](07-reddit-outreach-workflow.md) — si Reddit ressort fort dans le pattern
- [Content gap via fan-outs](04-fan-outs-pour-briefs-articles.md) — comprendre les requêtes que le concurrent capture
