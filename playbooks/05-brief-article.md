# Playbook 05 — Brief d'article complet

> Tu as un fan-out à attaquer. Cette commande te sort un **brief prêt à rédiger** : titre, outline H2/H3, FAQ, sources à citer, pages concurrentes à dépasser.

## Objectif

Transformer un fan-out (issu de `/mentionable-content-gap` ou choisi à la main) en **brief éditorial complet et actionnable**, calibré sur ce que les LLMs consultent réellement pour ce type de requête.

## Pour qui

- **Rédacteurs internes ou freelance** qui ont besoin d'un cadre clair
- **SEO content** qui valide les briefs avant production
- **Agences** qui veulent industrialiser la production de briefs GEO

## Pré-requis

- MCP Mentionable installé
- Au moins 1 prompt tracké couvrant le sujet (pour avoir les fan-outs et sources associés)
- Idéalement : avoir lancé `/mentionable-content-gap` au préalable pour choisir un fan-out à fort score

## Tools MCP utilisés

- `list_projects`, `list_fan_outs`
- `list_llm_sources` (filtré par `promptIds`) — sources d'autorité
- `list_competitors`, `list_competitor_sources` — pages concurrentes à dépasser

## Sur Claude Code

```
/mentionable-brief "comparatif [catégorie] open source 2026"
```

```
/mentionable-brief "alternative à CompetitorA"
```

## Sur Cursor / Claude Desktop / autre client

```text
Tu es un stratège contenu GEO. Produis un brief d'article complet pour le sujet : "<SUJET>".

1. list_projects() → projectId
2. list_fan_outs(projectId, filters.search: "<SUJET>", limit: 20) → trouve le fan-out exact, note fréquence, LLMs, promptIds parents
3. list_llm_sources(projectId, filters.promptIds: [...], limit: 50, sortBy: "appearances_desc") → sources que les LLMs consultent
4. list_competitors(projectId, filters.status: ["CONFIRMED"], limit: 10, sortBy: "mentions_desc") → top concurrents
5. Pour le top 3 concurrents : list_competitor_sources(projectId, competitorId, limit: 10) → URLs précises à dépasser

Rends un brief markdown :
- Méta (titre, slug, méta-desc, intent, format)
- Outline H2/H3 (6-10 H2)
- FAQ (5-8 questions issues des fan-outs proches)
- Sources à citer (4-6 domaines d'autorité)
- Sources à dépasser (URLs concurrents avec faiblesse à exploiter)
- 3 angles différenciants
- Signal GEO (entités, données à inclure)

Règles : titre = fan-out reformulé, outline alignée sur l'intent, sources factuelles.
```

## Exemple de livrable

```markdown
# Brief d'article — Comparatif des [catégorie] open source en 2026

> Sujet basé sur le fan-out : "comparatif [catégorie] open source 2026"
> Fréquence : 38 · LLMs concernés : ChatGPT, Perplexity, Gemini, Claude

## 1. Méta

- **Titre H1** : Les 7 meilleurs [catégorie] open source en 2026 — comparatif complet
- **Slug** : `/blog/comparatif-[categorie]-open-source-2026`
- **Méta-desc** : Notre comparatif des 7 meilleurs [catégorie] open source en 2026 : fonctionnalités, communauté, courbe d'apprentissage et alternatives commerciales. (152 car)
- **Intent** : Comparatif
- **Format** : Article long-form 2500-3500 mots avec tableau récap + JSON-LD ItemList

## 2. Outline

- ## H2 — Pourquoi choisir un [catégorie] open source en 2026
  - ### H3 — Avantages vs solutions propriétaires
  - ### H3 — Limites à connaître
- ## H2 — Notre méthodologie de comparaison
  - ### H3 — Critères évalués
  - ### H3 — Période de test
- ## H2 — Tool 1 : [Nom] — le plus populaire
  - ### H3 — Points forts
  - ### H3 — Points faibles
  - ### H3 — Pour qui
- ## H2 — Tool 2 : [Nom] — le plus complet
- ## H2 — Tool 3 à 7 (même structure)
- ## H2 — Tableau récapitulatif
- ## H2 — Open source vs commercial : que choisir ?
- ## H2 — FAQ

## 3. FAQ

- **Q : Quel est le meilleur [catégorie] open source pour une PME ?** — synthèse des 2-3 outils les plus accessibles avec le bon ratio simplicité/puissance
- **Q : Open source est-il vraiment gratuit ?** — clarifier les coûts cachés (hosting, support, maintenance)
- **Q : Peut-on migrer d'une solution propriétaire vers l'open source ?** — guide express + outils de migration
- **Q : Quelle alternative open source à CompetitorA ?** — comparatif sur 3 critères clés
- **Q : Quel [catégorie] open source pour démarrer en solo ?** — recommandation 1 outil + raisons
- **Q : Comment évaluer la santé d'un projet open source ?** — checklist (commits, contributors, roadmap, communauté)

## 4. Sources à citer

| Domaine | Pourquoi | URL si connue |
|---|---|---|
| github.com | Référence absolue pour le contexte projet | github.com/<projet>/<repo> |
| g2.com | Avis utilisateurs structurés | g2.com/categories/[catégorie] |
| capterra.com | Comparatif PME | capterra.com/[catégorie]-software/ |
| reddit.com (r/[subreddit]) | Validation sociale, débats récents | – |
| [media-sectoriel].com | Autorité éditoriale du secteur | – |

## 5. Sources à dépasser (concurrents qui ressortent)

| Concurrent | Page concurrente | Faiblesse |
|---|---|---|
| CompetitorA | competitora.com/blog/best-open-source-tools | Non daté, liste 5 outils seulement, pas de tableau |
| CompetitorB | competitorb.com/comparison/open-source | Liste de 3 outils, ton trop promotionnel |
| [autre source] | exemple.com/2024-comparison | Datée 2024, peut être dépassée par un comparatif 2026 frais |

## 6. Angles différenciants

1. **Donnée originale** : benchmark perf/install des 7 outils sur même VM, chiffres publiables
2. **Format unique** : calculator interactif "quel outil pour mon use case" (3 questions → 1 reco)
3. **Posture éditoriale** : avis tranché en conclusion, on désigne un winner par profil utilisateur

## 7. Signal GEO

- Entités produits : [Tool 1 à 7 + leurs alternatives commerciales]
- Entités contexte : open source, PME, self-hosted, cloud
- Données à inclure : install size, RAM minimum, nombre de stars GitHub, dernière release, taille communauté
```

## Variantes

- **Brief court (1500 mots)** : ajoute "format article condensé 1500 mots, 5 H2 max"
- **Brief landing produit** : "format landing page avec hero + 3 sections + CTA"
- **Brief multilingue** : "produis le brief en FR puis EN"
- **Brief conversationnel** : "structure pour réponse directe LLM (paragraphe-réponse en intro, sources visibles)"

## Aller plus loin

- [Content gap pour identifier le prochain sujet](04-fan-outs-pour-briefs-articles.md)
- [Reverse engineering pour creuser le concurrent dominant](03-reverse-engineering-concurrents.md)
