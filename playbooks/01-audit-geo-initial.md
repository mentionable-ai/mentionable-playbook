# Playbook 01 — Audit GEO initial

> Premier réflexe quand on prend en main un projet Mentionable : **où en est-on ?**
> Cet audit donne un état des lieux exec-ready en 2 minutes, prêt à être envoyé à un client.

## Objectif

Produire un diagnostic GEO complet d'un projet : visibilité par LLM, Share of Voice, top concurrents, top sources, fan-outs prioritaires, et 3 actions à mener.

## Pour qui

- **Consultant SEO freelance** qui prend un nouveau client
- **SEO in-house** qui setup le tracking et veut un baseline
- **Agence SEO** qui audite un projet existant
- **Agence web** qui veut chiffrer une mission GEO

## Pré-requis

- MCP Mentionable installé (voir [getting-started](../docs/getting-started.md))
- Au moins 1 projet Mentionable avec des prompts trackés
- 24-48h de tracking pour avoir des données significatives

## Tools MCP utilisés

- `list_projects` — identification du projet
- `list_prompts` — visibilité par LLM
- `list_competitors` — Share of Voice
- `list_llm_sources` — écosystème de sources
- `list_fan_outs` — requêtes fan-out

## Sur Claude Code

```
/mentionable-audit
```

Avec un projet précis :

```
/mentionable-audit nom-de-mon-projet
```

## Sur Cursor / Claude Desktop / autre client MCP

Copie-colle le prompt suivant dans ton chat (le client appellera les tools MCP automatiquement) :

```text
Tu es un consultant GEO senior. Produis un audit GEO exec-ready d'un projet Mentionable.

1. Identifie le projet :
   - Si je précise un nom : list_projects(filters.nameContains: "<nom>")
   - Sinon : list_projects() et prends le seul disponible (sinon demande)

2. Collecte en parallèle :
   - list_prompts(projectId, limit: 100)
   - list_competitors(projectId, filters.status: ["CONFIRMED"], limit: 20, sortBy: "mentions_desc")
   - list_llm_sources(projectId, limit: 50, sortBy: "appearances_desc")
   - list_fan_outs(projectId, limit: 30, sortBy: "frequency")

3. Rends un rapport markdown structuré :
   - Vue d'ensemble (prompts, concurrents, LLMs)
   - Visibilité par LLM (tableau)
   - Top 5 concurrents Share of Voice (tableau)
   - Top 10 fan-outs avec statut "couvert / à travailler"
   - Top 10 sources LLM (tableau)
   - 3 actions prioritaires (action / pourquoi / comment)

Règles : données uniquement, pas d'invention, format compact, tone exec.
```

## Exemple de livrable

```markdown
# Audit GEO — Acme SaaS

> Période d'analyse : 7 derniers jours

## 1. Vue d'ensemble

- Prompts trackés : 24 (dont 22 actifs)
- Concurrents confirmés : 8
- LLMs couverts : ChatGPT, Perplexity, Gemini, Claude, Google AIO
- Domaines détectés dans l'écosystème : 142

## 2. Visibilité par LLM

| LLM | Prompts couverts | Taux moyen | Note |
|---|---|---|---|
| ChatGPT | 18/24 | 42% | moyen |
| Perplexity | 22/24 | 67% | fort |
| Gemini | 9/24 | 18% | faible |
| Claude | 12/24 | 28% | moyen |
| Google AIO | 6/24 | 12% | faible |

## 3. Share of Voice — Top 5 concurrents

| Concurrent | Mentions | LLMs présents | Statut |
|---|---|---|---|
| CompetitorA | 187 | 5/5 | leader |
| Acme SaaS (nous) | 124 | 5/5 | challenger |
| CompetitorB | 98 | 4/5 | challenger |
| CompetitorC | 67 | 3/5 | suiveur |
| CompetitorD | 41 | 2/5 | niche |

## 4. Top 10 fan-outs

| Fan-out | Fréquence | LLMs | Statut |
|---|---|---|---|
| meilleur outil [catégorie] PME 2026 | 47 | 4/5 | couvert |
| comparatif [catégorie] open source | 38 | 3/5 | à travailler |
| [catégorie] avis utilisateurs | 31 | 5/5 | couvert |
| ... | | | |

## 5. Top 10 sources de l'écosystème

| Domaine | Apparitions | Type dominant |
|---|---|---|
| reddit.com | 89 | cited |
| g2.com | 67 | cited |
| capterra.com | 54 | consulted |
| [media-sectoriel].com | 41 | cited |
| ... | | |

## 6. 3 actions prioritaires

1. **Travailler la visibilité Gemini** (18% vs 67% sur Perplexity)
   — Pourquoi : asymétrie nette, Gemini consulte d'autres sources
   — Comment : `/mentionable-sov` puis `/mentionable-content-gap` filtré sur Gemini

2. **Reverse engineering de CompetitorA** (leader SoV avec 35% de présence)
   — Pourquoi : il domine sur tous les LLMs, comprendre ses canaux
   — Comment : `/mentionable-reverse CompetitorA`

3. **Combler le fan-out "comparatif open source"** (38 occurrences, non couvert)
   — Pourquoi : intent fort, on n'apparaît sur aucun LLM
   — Comment : `/mentionable-brief comparatif [catégorie] open source`
```

## Variantes

- **Audit hebdomadaire** : enchaîne avec `/mentionable-weekly` pour suivre les évolutions
- **Audit par persona** : ajoute "filtre les prompts par personaIds: [...]" si tu as des personas configurés
- **Audit par pays** : ajoute `filters.country: "FR"` aux `list_prompts`
- **Audit court (5 prompts)** : pour démo client, demande un audit "version condensée 1 page"

## Aller plus loin

- [Reverse engineering d'un concurrent](03-reverse-engineering-concurrents.md) — décortiquer les canaux du leader SoV
- [Content gap via fan-outs](04-fan-outs-pour-briefs-articles.md) — backlog éditorial issu de l'audit
- [Reporting hebdo client](08-reporting-hebdo-geo.md) — automatiser le suivi
