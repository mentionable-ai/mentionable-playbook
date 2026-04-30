# Tools reference — MCP Mentionable

Cheatsheet des 12 tools exposés par le MCP. Pour chaque tool : à quoi il sert, ses inputs clés, et dans quel(s) playbook(s) il est utilisé.

## Découverte

### `list_projects`

Liste les projets accessibles avec la clé API courante.

| Input | Optionnel | Note |
|---|---|---|
| `filters.nameContains` | Oui | Recherche par nom partiel |
| `sortBy` | Oui | `recent` (défaut), `oldest`, `alphabetical` |
| `limit`, `cursor` | Oui | Pagination, max 100 |

**Utilisé dans** : tous les playbooks (point d'entrée).

### `list_prompts`

Liste les prompts trackés d'un projet, avec stats de mention et **visibilité par LLM**.

| Input | Note |
|---|---|
| `projectId` | Requis |
| `filters.categoryIds`, `filters.personaIds` | Filtrage segmenté |
| `filters.country` | Code ISO 2 lettres |
| `filters.isActive`, `filters.textContains` | Filtres complémentaires |

**Utilisé dans** : `audit`, `sov`, `weekly`, `content-gap`.

## Mesure GEO

### `list_competitors`

Concurrents trackés avec mentions totales et présence par LLM (Share of Voice).

| Input | Note |
|---|---|
| `filters.status` | `CONFIRMED`, `SUGGESTED`, `REJECTED` |
| `sortBy` | `mentions_desc` (défaut), `recent`, `alphabetical` |
| `filters.minMentions` | Filtrer le bruit |

**Utilisé dans** : `audit`, `sov`, `reverse`, `weekly`.

### `list_llm_sources`

Domaines apparaissant dans les réponses LLM (cités, consultés, fan-out).

| Input | Note |
|---|---|
| `filters.appearanceTypes` | `cited`, `consulted`, `fan_out` |
| `filters.llms` | Filtrer par LLM (ChatGPT, Perplexity, etc.) |
| `filters.dateRange` | Période d'analyse |
| `sortBy` | `appearances_desc`, `cited_desc`, `fan_out_desc`, `recent` |

**Utilisé dans** : `audit`, `reverse`, `backlinks`, `content-gap`.

## Reverse engineering

### `list_competitor_sources`

Pour un concurrent donné, les domaines qui le citent dans les LLMs (avec top URLs et contexte d'exemple).

| Input | Note |
|---|---|
| `competitorId` | Requis |
| `filters.minMentions` | Filtrer le bruit |
| `sortBy` | `mentions_desc` (défaut), `recent` |

**Utilisé dans** : `reverse`, `backlinks` (cibles outreach).

### `list_fan_outs`

Les requêtes que les LLMs lancent en coulisses pour répondre aux prompts trackés. Dédupliquées, classées par fréquence.

| Input | Note |
|---|---|
| `filters.search` | Recherche textuelle |
| `filters.promptId` | Fan-outs d'un prompt précis |
| `filters.llm` | Par LLM |
| `sortBy` | `frequency` (défaut), `recent` |

**Utilisé dans** : `audit`, `content-gap`, `brief`.

## Reddit (workflow GEO)

### `list_reddit_threads`

Threads Reddit cités par les LLMs avec signaux GEO (citations, web searches, LLMs touchés) + contenu scrapé si enrichi.

| Input | Note |
|---|---|
| `filters.status` | `NEW`, `ENRICHING`, `ENRICHED`, `COMMENTED`, `SKIPPED`, `DELETED` |
| `filters.subredditContains` | Cibler un subreddit |
| `filters.enrichedOnly` | Ne garder que les threads avec contenu scrapé |
| `sortBy` | `score_desc`, `recent`, `citations_desc` |

**Utilisé dans** : `reddit-triage`.

### `enrich_reddit_thread`

Lance le scraping Bright Data d'un thread Reddit (titre, body, top comments). **Charge des crédits AI**. Asynchrone (1-3 min).

| Input | Note |
|---|---|
| `redditPostId` | Requis |
| Idempotent | Re-call ne re-charge pas si déjà en cours |

**Utilisé dans** : `reddit-triage`.

### `get_reddit_thread`

Polling d'un thread après `enrich_reddit_thread`. Retourne le statut courant + contenu scrapé si dispo.

**Utilisé dans** : `reddit-triage`.

### `bulk_update_reddit_thread_status`

Mise à jour en bulk (max 50) du statut des threads. Statuts utilisateur : `NEW`, `COMMENTED`, `SKIPPED`.

**Utilisé dans** : `reddit-triage`.

## Acquisition

### `list_backlink_opportunities`

Domaines où acheter un backlink pourrait améliorer la visibilité GEO, avec impact score et offres marketplace.

| Input | Note |
|---|---|
| `filters.providers` | Filtrer par marketplace |
| `filters.priceMin`, `filters.priceMax` | Budget |
| `filters.minImpactScore` | Filtrer le faible impact |
| `filters.hasOffer` | Ne garder que les domaines achetables |
| `sortBy` | `impact_score_desc`, `cheapest_offer`, `best_impact_price_ratio`, `recent` |

**Utilisé dans** : `backlinks`.

## Hygiène / workflow

### `bulk_update_competitor_status`

Mise à jour en bulk (max 50) du statut des concurrents : `CONFIRMED`, `REJECTED`, `SUGGESTED`.

**Utilisé dans** : optionnel — peut être greffé dans `audit` ou un futur `competitor-triage`.

## Patterns d'utilisation

### Pagination

Tous les `list_*` supportent `cursor` + `limit`. Pour itérer :

```
1. Appel sans cursor → réponse contient `nextCursor`
2. Appel avec cursor: <nextCursor> → page suivante
3. Stop quand pas de `nextCursor` retourné
```

### Parallélisation

Les appels MCP sur des tools différents sont **indépendants** : sur Claude Code, ils peuvent être lancés en parallèle dans le même tour pour gagner du temps (typiquement dans `audit` : 4 appels en parallèle).

### Format CUID

Les `projectId`, `competitorId`, `redditPostId`, etc. sont au format **CUID** (commencent par `c`, ex: `clxyz1234abcd`). Si tu manipules ces IDs manuellement, vérifie le format.
