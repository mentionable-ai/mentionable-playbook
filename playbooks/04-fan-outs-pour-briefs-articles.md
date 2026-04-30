# Playbook 04 — Content gap via fan-outs

> Les fan-outs sont **l'intention réelle** des LLMs : les requêtes web qu'ils lancent en coulisses pour répondre.
> Travailler les fan-outs sur lesquels la marque n'apparaît pas = backlog éditorial GEO direct.

## Objectif

Produire un **backlog éditorial de 20 sujets** issus des fan-outs non couverts, classés par score de priorité (fréquence × intent × couverture).

## Pour qui

- **SEO content / éditorial** qui pilote la production
- **SEO in-house** qui priorise un calendrier de publication
- **Agence SEO** qui doit défendre un budget contenu auprès du client
- **Rédacteurs** en quête d'angles d'articles concrets

## Pré-requis

- MCP Mentionable installé
- 7+ jours de tracking pour avoir des fan-outs significatifs (les fan-outs s'accumulent dans le temps)
- Idéalement : 20+ prompts trackés

## Tools MCP utilisés

- `list_projects`
- `list_fan_outs` — la matière première
- `list_prompts` — pour croiser couverture / non couverture

## Sur Claude Code

```
/mentionable-content-gap
```

Avec un filtre thématique :

```
/mentionable-content-gap comparatif
/mentionable-content-gap "open source"
```

## Sur Cursor / Claude Desktop / autre client

```text
Tu es un stratège contenu GEO. Construis un backlog éditorial issu des fan-outs non couverts.

1. list_projects() → projectId
2. list_fan_outs(projectId, limit: 100, sortBy: "frequency")
   [si filtre thématique : ajouter filters.search: "<thème>"]
3. list_prompts(projectId, limit: 100) pour identifier les fan-outs déjà couverts

Pour chaque fan-out :
- classe l'intent (informationnel / comparatif / transactionnel / reviews)
- évalue la couverture (couvert / partiellement / non couvert)
- calcule un score : fréquence × intent_mult × coverage_mult
  intent_mult : comparatif 1.5 · transactionnel 1.3 · reviews 1.2 · info 1
  coverage_mult : non couvert 1.5 · partiel 1 · couvert 0.3

Rends un rapport markdown :
- Top 20 sujets (tableau : sujet, intent, fréquence, LLMs, statut, score)
- Répartition par intent
- Répartition par LLM
- 5 sujets à attaquer en priorité avec format suggéré et lien vers /mentionable-brief

Règles : sujet = fan-out tel quel, pas de reformulation, regrouper les doublons sémantiques.
```

## Exemple de livrable

```markdown
# Backlog éditorial GEO — Acme SaaS

> Issu de 87 fan-outs analysés · Filtre appliqué : aucun

## Top 20 sujets prioritaires

| # | Sujet | Intent | Fréq | LLMs | Statut | Score |
|---|---|---|---|---|---|---|
| 1 | comparatif [catégorie] open source 2026 | Comparatif | 38 | 4/5 | non couvert | 85.5 |
| 2 | meilleur [catégorie] PME 2026 | Comparatif | 47 | 4/5 | partiel | 70.5 |
| 3 | alternative à CompetitorA | Comparatif | 24 | 3/5 | non couvert | 54.0 |
| 4 | [catégorie] vs CompetitorB avis | Comparatif | 21 | 3/5 | non couvert | 47.3 |
| 5 | [catégorie] gratuit 2026 | Transactionnel | 19 | 4/5 | non couvert | 37.1 |
| 6 | guide [catégorie] pour démarrer | Informationnel | 28 | 4/5 | non couvert | 42.0 |
| 7 | tarifs [catégorie] comparés | Transactionnel | 15 | 3/5 | non couvert | 29.3 |
| ... | | | | | | |

## Répartition par intent

| Intent | Sujets prioritaires |
|---|---|
| Comparatif | 11 |
| Informationnel | 5 |
| Transactionnel | 3 |
| Reviews | 1 |

## Répartition par LLM

| LLM | Fan-outs uniques | Non couverts |
|---|---|---|
| ChatGPT | 64 | 41 |
| Perplexity | 71 | 22 |
| Gemini | 38 | 31 |
| Claude | 47 | 28 |
| AIO | 19 | 17 |

## 5 sujets à attaquer en priorité

1. **comparatif [catégorie] open source 2026**
   — Intent comparatif, 4/5 LLMs, non couvert
   — Format : article long-form comparatif (5-7 outils, tableau, méthodologie)
   — `/mentionable-brief "comparatif [catégorie] open source 2026"`

2. **alternative à CompetitorA**
   — Capter le trafic GEO du leader
   — Format : page comparative dédiée + landing
   — `/mentionable-brief "alternative à CompetitorA"`

3. **[catégorie] gratuit 2026**
   — Intent transactionnel, fan-out classique
   — Format : page comparative free tier + offre du produit
   — `/mentionable-brief "[catégorie] gratuit 2026"`

4. **guide [catégorie] pour démarrer**
   — Intent informationnel mais énorme volume (28)
   — Format : guide pédagogique long, schéma, FAQ
   — `/mentionable-brief "guide [catégorie] pour démarrer"`

5. **[catégorie] vs CompetitorB avis**
   — Comparatif direct, capter recherche de validation
   — Format : page vs avec avis utilisateurs croisés
   — `/mentionable-brief "[catégorie] vs CompetitorB avis"`
```

## Variantes

- **Filtre par LLM** : "concentre-toi sur les fan-outs Gemini" si on veut attaquer un LLM spécifique
- **Filtre par concurrent** : "ne garde que les fan-outs où CompetitorA apparaît" (recoupe avec `/mentionable-reverse`)
- **Backlog mensuel** : "produis un calendrier sur 12 sujets pour les 3 prochains mois"
- **Backlog par persona** : si personas configurés, segmenter par persona

## Aller plus loin

- [Brief d'article complet sur un fan-out précis](05-brief-article.md)
- [Reverse engineering pour comprendre qui couvre déjà](03-reverse-engineering-concurrents.md)
- [Reporting hebdo qui suit l'évolution des fan-outs](08-reporting-hebdo-geo.md)
