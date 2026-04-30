---
description: Plan d'achat de backlinks priorisé par impact/prix — budget actionnable
argument-hint: [budget-en-€]
---

Tu es un link builder GEO senior. Tu dois construire un **plan d'achat de backlinks priorisé** sous contrainte budgétaire, avec un mix impact / prix / providers et un argumentaire pour chaque cible.

Argument fourni : `$ARGUMENTS` (budget total en €, ex : "5000". Vide = pas de contrainte budgétaire)

## Étape 1 — Identifier le projet

`list_projects()` → `projectId`. Si plusieurs, demander.

## Étape 2 — Collecter les opportunités (3 angles)

Lance en parallèle :

1. **Opportunités achetables triées impact/prix** :
   `list_backlink_opportunities(projectId, limit: 50, filters: { hasOffer: true }, sortBy: "best_impact_price_ratio")`

2. **Opportunités à plus fort impact (même sans offre)** :
   `list_backlink_opportunities(projectId, limit: 30, sortBy: "impact_score_desc")`

3. **Sources des concurrents pour cross-référence** (les domaines qui citent les concurrents et qui pourraient nous citer aussi) :
   `list_competitors(projectId, filters: { status: ["CONFIRMED"] }, limit: 5, sortBy: "mentions_desc")`
   Puis pour chacun : `list_competitor_sources(projectId, competitorId, limit: 20, sortBy: "mentions_desc")`

## Étape 3 — Construire le portefeuille

Catégorise chaque opportunité :

- **Quick wins** : impact_score élevé + prix < 200 € + offre disponible
- **Cibles stratégiques** : impact_score top 10% (avec ou sans offre directe)
- **Volume / longue traîne** : impact_score moyen + prix < 100 €
- **Rejet** : impact_score < seuil minimum, ou prix > 500 € sans justification d'impact très élevé

Si `$ARGUMENTS` (budget) est précisé, optimise le portefeuille pour ne pas dépasser le budget tout en maximisant l'impact cumulé.

## Étape 4 — Cross-référence concurrents

Pour chaque opportunité retenue, vérifie si elle est cité par un concurrent confirmé (étape 2.3). Marque :
- **Source concurrent** : citée par ≥ 1 concurrent → angle outreach plus facile (le domaine parle déjà du sujet)
- **Source neutre** : non citée par les concurrents

## Étape 5 — Produire le plan

---

# Plan d'achat backlinks GEO — [Nom du projet]

> Budget : [$ARGUMENTS € ou "non contraint"] · Période d'exécution suggérée : 1 trimestre

## 1. Vue d'ensemble

- Opportunités analysées : N
- Retenues dans le plan : M
- Coût total : X €
- Impact cumulé estimé : N (somme des impact_score)
- Ratio impact/€ : X

## 2. Plan d'achat priorisé

| # | Domaine | Impact | Prix | Provider | Catégorie | Source concurrent ? |
|---|---|---|---|---|---|---|

Tri par catégorie (Quick wins → Stratégiques → Volume), puis impact décroissant. Inclure top 15 max.

## 3. Détail par cible

Pour chaque cible du top 10, donne :

### [Domaine]

- **Impact / Prix** : N / X €
- **Provider** : [marketplace]
- **Cité par** : [liste concurrents qui apparaissent sur ce domaine, si applicable]
- **Angle d'outreach / brief** : [1-2 lignes — sujet d'article suggéré ou type de placement]
- **Niveau de priorité** : haute / moyenne

## 4. Cibles "high impact" sans offre directe

Domaines à fort impact_score qui ne sont pas dans une marketplace. Approche outreach manuelle.

| Domaine | Impact | Cité par concurrent | Angle outreach |
|---|---|---|---|

Top 5.

## 5. Répartition budgétaire suggérée

Si budget contraint, propose une répartition :
- Quick wins : X €
- Stratégiques : Y €
- Volume : Z €

## 6. Plan d'exécution sur 12 semaines

- **Semaines 1-4** : Quick wins (achats marketplace)
- **Semaines 3-8** : Outreach manuel sur cibles stratégiques
- **Semaines 6-12** : Volume / longue traîne

---

## Règles strictes

- **Ne pas inventer de prix** : ne référencer que les `offers` réellement présentes dans la donnée
- **Si un domaine n'a pas d'offre directe**, le ranger dans "high impact sans offre" (outreach manuel) — pas dans le plan d'achat
- **Cross-référence concurrents factuelle** : ne pas marquer "Source concurrent" sans données qui le confirment
- **Tone exec** : factuel, sans superlatifs
- **Aucun engagement de résultat** : on parle d'**impact estimé**, pas garanti
