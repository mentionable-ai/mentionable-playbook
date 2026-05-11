# Playbook 12 — Clusters discovery (passerelle fan-outs → pilier)

> **Slash command** : [`/mentionable-clusters`](../.claude/commands/mentionable-clusters.md)
> **Pour qui** : SEO content, agence, in-house qui veut transformer le signal LLM brut d'un projet Mentionable en un catalogue de seeds prêts à produire
> **Livrable** : `projects/<projet>/discovery/<YYYY-MM-DD>/{clusters.json, clusters.md, fan-outs-raw.json}`

## Pourquoi

Le workflow GEO complet :

```
[Fan-outs LLM bruts]   ← collectés par le scan Mentionable
       ↓
   Clustering          ← /mentionable-clusters (cette commande)
       ↓
[Seeds prêts]
       ↓
   Plan pilier+sat.    ← /mentionable-pillar
       ↓
   Brief article       ← /mentionable-brief (optionnel)
       ↓
   Rédaction GEO       ← /mentionable-article
       ↓
   Images              ← /mentionable-images
```

Avant cette commande, le pont entre les **fan-outs LLM** (signal réel) et la **production de contenu** (DataForSEO + rédaction) était implicite : il fallait choisir manuellement un seed keyword, puis lancer `/mentionable-pillar`. Pas d'historique, pas de traçabilité.

`/mentionable-clusters` matérialise ce pont sous forme de fichier `clusters.json` consommable par `/mentionable-pillar --from-cluster`. Bénéfices :

1. **Discovery automatisée** : tu vois en 30 secondes les 15 thèmes principaux que les LLMs interrogent sur ton projet.
2. **Seeds prêts à passer** : chaque cluster a un `seedSuggested` neutre, exploitable par DataForSEO.
3. **Historique daté** : chaque snapshot `discovery/<date>/` garde une photo du signal LLM à un moment T. Tu peux comparer mois sur mois.
4. **Idempotence** : si tu relances le même jour, la commande te propose de repartir du cache.

## Pré-requis

1. Un projet Mentionable actif avec des fan-outs collectés. Si le scan n'est pas encore actif, lance-le sur app.mentionable.ai et reviens plus tard.
2. MCP Mentionable installé (tools `list_projects`, `list_fan_outs`, `list_prompts` accessibles).
3. Optionnel : `.project.json` déjà présent dans `projects/<projet>/` (créé automatiquement par `/mentionable-pillar` ou cette commande au premier run).

## Comment utiliser

### Via Claude Code

```
/mentionable-clusters
```

L'agent te demande de sélectionner le projet si plusieurs sont disponibles.

### Sur un projet spécifique

```
/mentionable-clusters mon-client
```

ou un path :

```
/mentionable-clusters projects/mon-client
```

### Via Cursor / Claude Desktop

Copie le prompt de [`.claude/commands/mentionable-clusters.md`](../.claude/commands/mentionable-clusters.md), remplace `$ARGUMENTS`.

## Le pipeline en 8 étapes

1. **Sélection projet** — depuis path ou interactif via `list_projects`.
2. **Cache check** — si `discovery/<today>/clusters.json` existe, propose cache ou refresh.
3. **Fetch fan-outs** — `list_fan_outs(limit: 100, sortBy: frequency)`.
4. **Fetch prompts trackés** — `list_prompts(limit: 100)` pour le flag coverage.
5. **Classification intent** — règles regex sur les queries.
6. **Clustering thème + intent** — tokens partagés, sous-clusters par intent si pertinent, cap à 15.
7. **Écriture** — `clusters.json`, `clusters.md`, `fan-outs-raw.json`.
8. **Console** — top 5 clusters + commandes prêtes à coller.

## Structure du `clusters.json`

```json
{
  "projectId": "...",
  "projectName": "...",
  "snapshotDate": "2026-05-11",
  "clusters": [
    {
      "id": "cluster-1",
      "rank": 1,
      "theme": "coaching",
      "intent": "commercial",
      "cumulativeFrequency": 14,
      "llmsConcerned": ["CHATGPT", "PERPLEXITY"],
      "coverageStatus": "tracked",
      "seedSuggested": "coach communication non violente en ligne",
      "suggestedCommand": "/mentionable-pillar \"...\" --project-slug ...",
      "fanOuts": [...],
      "promptIds": [...]
    }
  ]
}
```

Chaque cluster est **autonome** : tu peux le passer tel quel à `/mentionable-pillar --from-cluster` qui :
- skip la sélection projet (path implicite)
- réutilise les fan-outs sans re-call MCP
- référence le cluster source dans le `plan.md` généré (traçabilité)

## Workflow complet : fan-outs → article publié

```
# 1. Discovery
/mentionable-clusters mon-client
  → projects/mon-client/discovery/2026-05-11/clusters.json
  → top 5 clusters affichés avec commandes suggérées

# 2. Choix d'un cluster (ex : cluster-1 = "coach CNV en ligne")
/mentionable-pillar "coach communication non violente en ligne" \
  --project-slug mon-client \
  --from-cluster projects/mon-client/discovery/2026-05-11/clusters.json#cluster-1
  → projects/mon-client/pillars/coach-cnv-en-ligne/plan.md

# 3. Rédaction du pilier
/mentionable-article projects/mon-client/pillars/coach-cnv-en-ligne
  → projects/mon-client/articles/coach-cnv-en-ligne/article.md
  → + jsonld.json + sources.json + meta.json

# 4. Images
/mentionable-images projects/mon-client/articles/coach-cnv-en-ligne/article.md
  → projects/mon-client/articles/coach-cnv-en-ligne/images/
```

## Cadence recommandée

- **Premier run** : dès qu'un projet a accumulé 30+ fan-outs (typiquement 2-3 semaines après l'activation du scan).
- **Runs suivants** : toutes les 2-4 semaines pour observer l'évolution des fan-outs (nouveaux thèmes, hausse de fréquence sur certains clusters, apparition de marques concurrentes).
- **À ignorer** : ne pas lancer plusieurs fois par jour, le signal LLM bouge sur des cycles hebdomadaires/mensuels.

## Comparer deux snapshots

Pour voir ce qui a évolué entre deux dates :

```bash
diff projects/<projet>/discovery/2026-05-11/clusters.json \
     projects/<projet>/discovery/2026-06-15/clusters.json
```

Les nouveaux clusters apparus, les hausses de fréquence et les LLMs nouvellement concernés sont les signaux les plus actionnables.

## Différence avec `/mentionable-content-gap`

`/mentionable-content-gap` produit un **backlog d'articles** priorisé par score (info / comparatif / trans / reviews) à partir des fan-outs. Output : table Markdown directement actionnable par un rédacteur.

`/mentionable-clusters` produit un **catalogue de seeds** consommable par les autres commandes (`/mentionable-pillar`, `/mentionable-brief`). Output : fichier `clusters.json` + résumé `clusters.md`. C'est plus une **donnée structurée** qu'un livrable éditorial.

Les deux sont complémentaires :
- Tu utilises `/mentionable-clusters` pour piloter la production multi-piliers sur un projet (vision macro, plusieurs mois).
- Tu utilises `/mentionable-content-gap` pour livrer un backlog éditorial à un rédacteur à un instant T.

## Coûts

- **Modèle Claude** : ~5-15k tokens (les fan-outs sont compacts, le clustering est rapide).
- **MCP Mentionable** : 2 calls (`list_fan_outs`, `list_prompts`). Pas de coût tiers.
- **DataForSEO** : aucun (cette commande ne touche pas DataForSEO).
