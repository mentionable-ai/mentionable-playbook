# Playbook 07 — Plan d'achat de backlinks priorisé

> Tu as un budget et une liste d'opportunités. Cette commande te sort le **plan d'achat optimal** : quick wins, cibles stratégiques, longue traîne — avec un mix impact/prix et un argumentaire par cible.

## Objectif

Transformer la liste brute des `list_backlink_opportunities` Mentionable en **plan d'achat exécutable sur 1 trimestre**, avec budget alloué et angle d'outreach par cible.

## Pour qui

- **Link builder freelance** ou en agence
- **SEO in-house** qui défend un budget backlinks
- **Agence SEO** qui industrialise les achats sur N clients

## Pré-requis

- MCP Mentionable installé
- Mentionable a calculé des opportunités (`list_backlink_opportunities` non vide)
- Au moins 1-2 concurrents `CONFIRMED` (pour la cross-référence)

## Tools MCP utilisés

- `list_projects`
- `list_backlink_opportunities` — la matière première (avec offres marketplace)
- `list_competitors` + `list_competitor_sources` — cross-référence pour identifier les domaines qui citent déjà les concurrents

## Sur Claude Code

```
/mentionable-backlinks
/mentionable-backlinks 5000
/mentionable-backlinks 12000
```

(le nombre = budget total en €)

## Sur Cursor / Claude Desktop / autre client

```text
Tu es un link builder GEO senior. Construis un plan d'achat de backlinks pour le budget : <BUDGET € ou "non contraint">.

1. list_projects() → projectId
2. En parallèle :
   - list_backlink_opportunities(projectId, filters.hasOffer: true, limit: 50, sortBy: "best_impact_price_ratio")
   - list_backlink_opportunities(projectId, limit: 30, sortBy: "impact_score_desc")
   - list_competitors(projectId, filters.status: ["CONFIRMED"], limit: 5, sortBy: "mentions_desc")
   - Pour top 5 concurrents : list_competitor_sources(projectId, competitorId, limit: 20)

3. Catégorise : Quick wins / Stratégiques / Volume / Rejet
4. Cross-référence avec sources concurrents
5. Si budget : optimise pour ne pas dépasser

Rends un plan markdown :
- Vue d'ensemble (nb opportunités, retenues, coût, impact cumulé)
- Plan d'achat priorisé (top 15 tableau)
- Détail par cible (top 10) avec angle outreach
- Cibles high impact sans offre (outreach manuel, top 5)
- Répartition budgétaire
- Plan d'exécution 12 semaines

Règles : pas d'invention de prix, ne référencer que les offers réelles.
```

## Exemple de livrable

```markdown
# Plan d'achat backlinks GEO — Acme SaaS

> Budget : 5000 € · Période : 1 trimestre

## 1. Vue d'ensemble

- Opportunités analysées : 47
- Retenues dans le plan : 14
- Coût total : 4 720 €
- Impact cumulé estimé : 312
- Ratio impact/€ : 0.066

## 2. Plan d'achat priorisé

| # | Domaine | Impact | Prix | Provider | Catégorie | Source concurrent ? |
|---|---|---|---|---|---|---|
| 1 | [media-sectoriel].com | 47 | 380 € | LinkBuilder.io | Stratégique | Oui (CompetitorA, B) |
| 2 | [comparateur].com | 38 | 290 € | Marketplace1 | Quick win | Oui (CompetitorA) |
| 3 | [blog-vertical].fr | 34 | 220 € | Marketplace2 | Quick win | Non |
| 4 | [annuaire-pro].com | 29 | 180 € | Marketplace1 | Quick win | Oui (CompetitorB) |
| ... | | | | | | |

## 3. Détail des cibles top 10

### [media-sectoriel].com

- **Impact / Prix** : 47 / 380 €
- **Provider** : LinkBuilder.io
- **Cité par** : CompetitorA (8 mentions), CompetitorB (3 mentions)
- **Angle d'outreach / brief** : article comparatif "Top 7 [catégorie] pour [persona cible]" qui nous positionne en alternative crédible aux deux concurrents
- **Priorité** : haute

### [comparateur].com

- **Impact / Prix** : 38 / 290 €
- **Provider** : Marketplace1
- **Cité par** : CompetitorA (5 mentions)
- **Angle d'outreach** : profil produit complet + 5 reviews authentiques pour atteindre la masse critique
- **Priorité** : haute

### [blog-vertical].fr

- **Impact / Prix** : 34 / 220 €
- **Provider** : Marketplace2
- **Cité par** : – (source neutre)
- **Angle d'outreach** : guide pédagogique "Comment choisir un [catégorie]" en sponso éditorial
- **Priorité** : moyenne (source neutre, mais bon ratio impact/prix)

[7 autres entrées dans le même format]

## 4. Cibles "high impact" sans offre directe

| Domaine | Impact | Cité par | Angle outreach |
|---|---|---|---|
| [média-tier1].com | 89 | CompetitorA, B, C | Pitch tribune ou cas client + données originales |
| [association-pro].fr | 64 | CompetitorB | Adhésion + contribution éditoriale |
| [podcast-vertical] | 51 | CompetitorA | Pitch interview founder |
| [conférence-tech].com | 47 | CompetitorB, C | Speaker submission + sponsoring tier 3 |
| [newsletter-curatée] | 39 | CompetitorA | Featured tool / sponso ciblée |

## 5. Répartition budgétaire suggérée

- Quick wins : 1 870 € (4 achats < 350 €/u)
- Stratégiques : 2 230 € (5 achats 200-500 €/u)
- Volume / longue traîne : 620 € (5 achats < 150 €/u)

**Total : 4 720 € (sous budget de 280 €)**

## 6. Plan d'exécution sur 12 semaines

- **Semaines 1-4** : exécuter les 4 quick wins (Marketplace1 + 2)
- **Semaines 3-8** : initier l'outreach manuel sur les 5 cibles "high impact sans offre"
- **Semaines 6-12** : exécuter les achats stratégiques + volume restant
```

## Variantes

- **Sans budget** : `/mentionable-backlinks` → liste exhaustive priorisée, pas de coupe budgétaire
- **Budget faible (<2000 €)** : focalise sur Quick wins uniquement, ignore les stratégiques
- **Spécifique à un LLM** : "ne garde que les domaines qui apparaissent dans les sources Gemini" si on veut booster un LLM précis
- **Spécifique providers** : "ne propose que des opportunités via [marketplace X]" si on a un compte préexistant

## Aller plus loin

- [Reverse engineering pour identifier les sources qu'un concurrent exploite](03-reverse-engineering-concurrents.md)
- [Reporting hebdo qui suit l'évolution des sources après achat](08-reporting-hebdo-geo.md)

## Notes prudentes

- L'impact_score est une **estimation** Mentionable, pas une garantie
- Les achats marketplace varient en qualité — préférer les domaines avec sources concurrents (terrain validé)
- Diversifier les providers et les types de contenu (article, profil, listing) pour limiter les risques de pénalité
