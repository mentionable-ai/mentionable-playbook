# Playbook 08 — Reporting hebdo client

> Le reporting que tu envoies tous les lundis matin à ton client.
> Court, factuel, avec un TL;DR en 3 lignes et 3 actions claires pour la semaine.

## Objectif

Produire un **reporting GEO hebdomadaire** prêt à envoyer au client : évolutions clés de la semaine, nouveaux signaux, et 3 actions priorisées pour la semaine suivante.

## Pour qui

- **Consultant SEO freelance** qui livre un reporting client récurrent
- **Agence SEO** qui automatise les reportings sur N clients
- **SEO in-house** qui rend des comptes au CMO ou au CEO

## Pré-requis

- MCP Mentionable installé
- Projet avec 2+ semaines de tracking (sans ça, pas de comparaison)
- Idéalement : un reporting de la semaine précédente à fournir en contexte (pour les Δ)

## Tools MCP utilisés

- `list_projects`
- `list_prompts` — état courant
- `list_competitors` — Share of Voice
- `list_llm_sources` (avec `dateRange` sur 7 jours)
- `list_fan_outs` (sortBy: recent) — détection des nouveaux

## Sur Claude Code

```
/mentionable-weekly
/mentionable-weekly nom-du-projet
```

À combiner avec `/loop` ou `/schedule` pour une exécution automatique :

```
/schedule chaque lundi 9h /mentionable-weekly nom-du-projet
```

## Sur Cursor / Claude Desktop / autre client

```text
Tu es un consultant GEO senior. Produis un reporting hebdo client.

Période : 7 derniers jours · Période de comparaison : 7 jours précédents.

1. list_projects() → projectId
2. En parallèle :
   - list_prompts(projectId, limit: 100)
   - list_competitors(projectId, filters.status: ["CONFIRMED"], limit: 20, sortBy: "mentions_desc")
   - list_llm_sources(projectId, limit: 50, filters.dateRange: { from: "J-7", to: "now" })
   - list_fan_outs(projectId, limit: 50, sortBy: "recent")

3. Détecte :
   - Nouveaux fan-outs (firstSeen >= J-7)
   - Nouveaux domaines (premier appearance dans la fenêtre)
   - Nouveaux concurrents SUGGESTED
   - Évolutions Share of Voice si comparable

Rends un reporting markdown :
- TL;DR (3 lignes)
- Visibilité globale (prompts, taux moyen, LLMs)
- Share of Voice top 5 avec Δ vs S-1
- Nouveaux signaux (fan-outs, domaines, concurrents suggérés)
- Top 3 actions semaine prochaine

Règles : 1 page max, TL;DR en haut, pas d'invention de Δ, ton exec.
```

## Exemple de livrable

```markdown
# Reporting GEO — Acme SaaS

> Semaine du 23 au 30 avril 2026

## TL;DR

- SoV global stable à 20%, mais **bond de +6 pts sur Perplexity** (38% → 44%) suite à publication article comparatif
- Alerte : CompetitorD apparu cette semaine en SUGGESTED avec 11 mentions — à valider avant qu'il monte
- Action principale semaine prochaine : attaquer Gemini (toujours à 8%) via 2 articles long-form

## 1. Visibilité globale

- Prompts trackés : 24 (stable)
- Taux de visibilité moyen : 28% (+2 pts vs S-1)
- LLMs : ChatGPT 18%, Perplexity 44% (+6), Gemini 8%, Claude 22%, AIO 12%

## 2. Share of Voice — top 5

| Concurrent | Mentions | Δ vs S-1 | Posture |
|---|---|---|---|
| CompetitorA | 187 | -3 | leader stable |
| **Acme SaaS (nous)** | **131** | **+7** | challenger en croissance |
| CompetitorB | 92 | -6 | challenger en repli |
| CompetitorC | 67 | 0 | stable |
| CompetitorD (nouveau) | 11 | +11 | à surveiller |

## 3. Nouveaux signaux de la semaine

### Nouveaux fan-outs détectés

| Fan-out | Fréq | LLMs | Couvert ? |
|---|---|---|---|
| [catégorie] vs CompetitorD comparatif | 8 | 2/5 | non |
| [catégorie] pour startup early stage | 6 | 3/5 | partiel |
| meilleurs plugins [catégorie] 2026 | 5 | 2/5 | non |
| intégration [catégorie] avec [outil tiers] | 4 | 2/5 | non |
| [catégorie] AI features comparatif | 4 | 3/5 | non |

### Nouveaux domaines dans l'écosystème

| Domaine | Apparitions | Type |
|---|---|---|
| [nouveau-comparateur].com | 7 | cited |
| [media-startup].fr | 4 | cited |
| [forum-niche].com | 3 | consulted |

### Nouveaux concurrents suggérés

| Concurrent | Mentions | À traiter |
|---|---|---|
| CompetitorD | 11 | Valider statut + lancer reverse engineering |

## 4. Actions menées la semaine

- Publication "Top 7 [catégorie] open source 2026" → +6 pts Perplexity confirmés
- 2 commentaires Reddit (r/SaaS, r/[autre]) → upvotes positifs
- Audit Trustpilot lancé (résultats S+1)

## 5. Top 3 actions semaine prochaine

1. **Valider CompetitorD et lancer reverse engineering** — un nouveau concurrent à 11 mentions doit être analysé tant qu'il est encore petit — `/mentionable-reverse CompetitorD`

2. **Attaquer Gemini avec 2 briefs** — la stagnation à 8% est notre point faible — `/mentionable-content-gap` filtré sur Gemini puis `/mentionable-brief` sur les 2 fan-outs prioritaires

3. **Achat backlink ciblé sur [media-startup].fr** — nouveau domaine de l'écosystème, fenêtre d'entrée — `/mentionable-backlinks` sur 1 cible
```

## Variantes

- **Reporting mensuel** : modifie la période en 30 jours, ajoute des graphes de tendance (à dessiner manuellement à partir des données)
- **Reporting multi-projets (agence)** : "produis un reporting consolidé sur les projets X, Y, Z" — utile pour un compte d'agence avec plusieurs clients
- **Reporting executive (3 lignes)** : "version ultra condensée, juste TL;DR + 1 action"
- **Reporting automatique** : `/schedule chaque lundi 9h /mentionable-weekly nom-du-projet` pour le recevoir avant ton client

## Aller plus loin

- [Audit GEO complet quand le reporting alerte](01-audit-geo-initial.md)
- [Reverse engineering quand un nouveau concurrent monte](03-reverse-engineering-concurrents.md)
