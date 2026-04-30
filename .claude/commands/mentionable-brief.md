---
description: Brief d'article complet à partir d'un fan-out — outline, FAQ, sources à citer/dépasser
argument-hint: <fan-out ou sujet d'article>
---

Tu es un stratège contenu GEO. Tu dois produire un **brief d'article complet et prêt à rédiger** à partir d'un fan-out (ou sujet d'article).

Argument fourni : `$ARGUMENTS` (le fan-out ou sujet, requis)

Si `$ARGUMENTS` est vide, demande à l'utilisateur le sujet à briefer (idéalement issu de `/mentionable-content-gap`).

## Étape 1 — Identifier le projet et le fan-out

1. `list_projects()` → `projectId`
2. `list_fan_outs(projectId, filters: { search: "$ARGUMENTS" }, limit: 20)` — retrouve le fan-out exact et ses prompts associés
3. Note la fréquence, les LLMs concernés, et les `promptIds` parents

## Étape 2 — Cartographier les sources existantes

Pour comprendre ce que les LLMs lisent déjà sur ce sujet :

`list_llm_sources(projectId, limit: 50, filters: { promptIds: [...promptIds-trouvés] }, sortBy: "appearances_desc")`

→ Liste des domaines que les LLMs consultent pour répondre à ce type de requête.

## Étape 3 — Identifier les concurrents qui ressortent

`list_competitors(projectId, limit: 10, filters: { status: ["CONFIRMED"] }, sortBy: "mentions_desc")`

Note les 3-5 concurrents les plus présents, qu'on devra dépasser ou citer.

## Étape 4 — Pour chaque concurrent dominant, ses URLs précises

Pour le top 3 concurrents :
`list_competitor_sources(projectId, competitorId, limit: 10, sortBy: "mentions_desc")`

Note les URLs précises citées (les `topUrls`) pour chaque concurrent → ce sont les pages à dépasser.

## Étape 5 — Produire le brief

---

# Brief d'article — [titre de l'article basé sur le fan-out]

> Sujet basé sur le fan-out : *"$ARGUMENTS"*
> Fréquence : N · LLMs concernés : [liste]

## 1. Méta

- **Titre H1 proposé** : [reformulation accrocheuse du fan-out]
- **Slug suggéré** : `/[slug]`
- **Méta-description** (155 car max) : [proposition]
- **Intent** : informationnel / comparatif / transactionnel / reviews
- **Format** : article long / page comparative / guide / landing

## 2. Outline (H2/H3)

Structure recommandée. Inspirée des sources qui ressortent dans les LLMs sur ce type de requête :

- ## H2 — [section 1]
  - ### H3 — [sous-section]
  - ### H3 — [sous-section]
- ## H2 — [section 2]
  - ### H3 — ...
- ## H2 — [section 3]
- ## H2 — FAQ

Vise 6-10 H2. Chaque H2 doit répondre à une **question implicite** du fan-out.

## 3. FAQ à inclure

5-8 questions issues des fan-outs sémantiquement proches. Format :

- **Q : [question]** — réponse en 2-3 phrases
- ...

## 4. Sources à citer (autorité)

| Domaine | Pourquoi | URL spécifique si connue |
|---|---|---|

Domaines à citer = sources que les LLMs consultent pour ce type de requête (extraites étape 2). Cibler 4-6 sources d'autorité.

## 5. Sources à dépasser (concurrents)

| Concurrent | Page concurrente | Faiblesse à exploiter |
|---|---|---|

Liste les URLs précises où les concurrents apparaissent. Pour chaque, propose une faiblesse à exploiter (page datée, manque de profondeur, absence de FAQ, etc.).

## 6. Angles différenciants (3 max)

Comment se démarquer dans les réponses LLM :
- Donnée originale (étude, benchmark, enquête)
- Format unique (calculator, framework, template téléchargeable)
- Posture éditoriale (avis tranché, prise de position)

## 7. Signal GEO

Mots-clés / entités à inclure pour maximiser les chances d'être cité :
- Entités produit : [marque, concurrents, technologies]
- Entités contexte : [secteur, géo, taille d'entreprise]
- Données chiffrées à inclure

---

## Règles strictes

- **Le titre = le fan-out reformulé** : ne pas s'éloigner de la requête réelle
- **Outline alignée sur l'intent** : un comparatif a 3-5 H2 produits + tableau, un guide a une progression pédagogique, etc.
- **Sources citées et dépassées factuelles** : extraites des données MCP, pas inventées
- **Pas de jargon SEO inutile** : le brief doit être lisible par un rédacteur freelance
- **Tone exec / éditorial** : précis, sans superlatifs
