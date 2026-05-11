---
description: Clusterise les fan-outs LLM d'un projet par thème + intent, produit clusters.json consommable par /mentionable-pillar
argument-hint: [project-slug-ou-path-optionnel]
allowed-tools: Read, Write, Bash, AskUserQuestion
---

Tu es un analyste GEO. À partir des fan-outs LLM d'un projet Mentionable, tu produis un **catalogue de clusters thématiques** qui sert de passerelle entre le signal brut (fan-outs LLM) et la production de contenu (`/mentionable-pillar`, `/mentionable-brief`, `/mentionable-article`).

Objectif : un fichier `clusters.json` machine-readable consommable par les autres commandes, plus un `clusters.md` lisible par un humain pour décider quoi écrire en priorité.

Argument fourni : `$ARGUMENTS` (project slug ou chemin sous `projects/<slug>/`, optionnel)

## Étape 1 — Identifier le projet

1. **Si `$ARGUMENTS` est un slug ou un path sous `projects/<slug>/`** → extrais le `projectSlug`, lis `projects/<projectSlug>/.project.json` pour récupérer `projectId` et `projectName`.
2. **Si `$ARGUMENTS` est vide** → `list_projects()`.
   - Si un seul projet : utilise-le.
   - Si plusieurs : `AskUserQuestion` pour faire choisir.
   - Si zéro : indique de créer un projet sur app.mentionable.ai.
3. Calcule `projectSlug` (kebab-case du nom, sans accents, max 60 char) si absent.
4. Si `projects/<projectSlug>/.project.json` n'existe pas, crée-le.

Stocke : `projectId`, `projectName`, `projectSlug`, `today` (`YYYY-MM-DD` ISO).

## Étape 2 — Cache / idempotence

Vérifie si `projects/<projectSlug>/discovery/<today>/clusters.json` existe déjà.

- **S'il existe** → `AskUserQuestion` : "Snapshot du jour déjà présent. Relancer la collecte (consomme N appels MCP) ou repartir du cache existant ?"
  - Si "repartir du cache" → saute les étapes 3-7 et passe directement à l'affichage console (étape 8) en lisant les fichiers existants.
  - Si "relancer" → continue normalement, **écrase** les fichiers existants.
- **S'il n'existe pas** → continue normalement.

## Étape 3 — Collecte des fan-outs

```
list_fan_outs(projectId, limit: 100, sortBy: "frequency")
```

Stocke la sortie brute dans `fanOutsRaw`. Si `totalCount` excède 100, note dans le `clusters.md` final qu'on a vu les 100 premiers et qu'il faudra paginer pour exhaustivité.

## Étape 4 — Collecte des prompts trackés (pour le flag coverage)

```
list_prompts(projectId, limit: 100)
```

Stocke le set des `promptId` trackés et leur `brandVisibility` ou équivalent disponible dans la réponse. Si le tool ne retourne pas directement la visibilité par marque, considère que tout prompt présent dans la liste est "tracké" et reste à un flag binaire `tracked / untracked`.

## Étape 5 — Classification intent

Pour chaque fan-out, déduis l'intent dominant à partir de la query. Règles (cumulables, dernière match = prioritaire) :

| Intent | Signaux dans la query |
|---|---|
| `transactional` | "prix", "tarif", "tarifs", "acheter", "abonnement", "abonnements", "gratuit", "gratuite", "free", "essai", "trial", "souscrire", "réserver", "rdv", "rendez-vous" |
| `commercial` | "meilleur", "meilleurs", "top", "comparatif", "vs", "alternative", "alternatives", "comparaison", "lequel", "laquelle", "choisir" |
| `reviews` | "avis", "review", "reviews", "retour", "retours", "témoignage", "témoignages", "expérience" |
| `navigational` | présence d'un nom de marque connu, nom de domaine, "site officiel", "connexion", "login", ou query qui désigne explicitement une entité |
| `informational` (défaut) | tout le reste : "comment", "qu'est-ce que", "pourquoi", "définition", "guide", "méthode", "exemple", "exemples", ou aucun signal des autres catégories |

Si une query matche plusieurs intents, choisis le plus spécifique dans l'ordre transactional > commercial > reviews > navigational > informational.

## Étape 6 — Clusterisation thème + intent

Algorithme :

1. **Tokenisation** : pour chaque fan-out, extrais les tokens significatifs (mots ≥ 4 caractères, hors stop-words FR/EN, normalisés sans accents et en lowercase).
2. **Groupement thématique** : groupe les fan-outs qui partagent au moins **2 tokens significatifs en commun**, ou un token saillant rare (apparaissant dans < 30% des fan-outs).
3. **Sous-cluster intent** : à l'intérieur d'un cluster thématique, si plusieurs intents coexistent avec une fréquence comparable (chacun ≥ 20% du cluster), sépare en sous-clusters par intent. Sinon, garde l'intent dominant pour tout le cluster.
4. **Cap à 15 clusters** : si plus de 15 clusters émergent, fusionne les plus petits dans un cluster `divers` ou ignore ceux à freq cumulée < 2.
5. **Pour chaque cluster, calcule** :
   - `theme` : token le plus saillant et représentatif (pas un mot vide)
   - `intent` : intent dominant
   - `cumulativeFrequency` : somme des `occurrences` des fan-outs du cluster
   - `llmsConcerned` : union des LLMs (ex: `["CHATGPT", "PERPLEXITY"]`)
   - `promptIds` : union dédupliquée
   - `coverageStatus` : `tracked` si ≥ 1 prompt parent du cluster est dans le set tracké, `untracked` sinon
   - `seedSuggested` : le titre du fan-out le plus fréquent du cluster, **simplifié** (retirer les mentions de marque concurrente, retirer les superlatifs marketing type "meilleur", garder une formulation neutre exploitable comme seed DataForSEO)
   - `suggestedCommand` : selon intent et statut, propose :
     - `transactional` ou `commercial` → `/mentionable-pillar "<seedSuggested>" --project-slug <projectSlug>`
     - `informational` à haut volume LLM → `/mentionable-pillar "<seedSuggested>" --project-slug <projectSlug>`
     - `informational` à faible volume LLM (<5) → `/mentionable-brief "<seedSuggested>"`
     - `navigational` → `/mentionable-article` directement (page courte ciblée)
6. **Tri** : par `cumulativeFrequency` décroissant.

## Étape 7 — Écriture des fichiers

Dossier : `projects/<projectSlug>/discovery/<today>/`

### 7.1 — `clusters.json` (machine-readable)

```json
{
  "projectId": "<projectId>",
  "projectName": "<projectName>",
  "projectSlug": "<projectSlug>",
  "snapshotDate": "<today>",
  "generatedAt": "<ISO datetime>",
  "totalFanOutsAnalyzed": <int>,
  "totalClustersFound": <int>,
  "clusters": [
    {
      "id": "cluster-1",
      "rank": 1,
      "theme": "<token saillant>",
      "intent": "informational|commercial|transactional|navigational|reviews",
      "cumulativeFrequency": <int>,
      "llmsConcerned": ["CHATGPT", "PERPLEXITY"],
      "coverageStatus": "tracked|untracked",
      "seedSuggested": "<seed prêt à passer à /mentionable-pillar>",
      "suggestedCommand": "/mentionable-pillar \"<seed>\" --project-slug <projectSlug>",
      "fanOuts": [
        { "query": "<query>", "occurrences": <int>, "llms": [...], "promptIds": [...] }
      ],
      "promptIds": [...]
    }
  ]
}
```

### 7.2 — `clusters.md` (human-readable)

```markdown
# Discovery clusters — <projectName>

> Snapshot du <today> · <totalFanOutsAnalyzed> fan-outs analysés · <totalClustersFound> clusters

## TL;DR

- **Top cluster** : `<theme #1>` (<intent>, freq=<X>, <coverageStatus>) — seed suggéré : `<seedSuggested>`
- **<N> clusters non couverts** (priorité GEO)
- **<N> clusters trackés mais à enrichir**

## Top 5 clusters à attaquer

| Rank | Thème | Intent | Fréq cumulée | LLMs | Coverage | Commande suggérée |
|---|---|---|---|---|---|---|
| 1 | `<theme>` | <intent> | <X> | <llms> | <status> | `/mentionable-pillar "<seed>" --project-slug <slug>` |
| ... | | | | | | |

## Détail par cluster

### Cluster #1 — <theme>

- **Intent** : <intent>
- **Fréquence cumulée** : <X> occurrences sur <N> fan-outs
- **LLMs** : <liste>
- **Coverage** : <status>
- **Seed suggéré** : `<seedSuggested>`
- **Commande** : `<suggestedCommand>`

**Fan-outs représentatifs** :

| Query | Occurrences | LLMs |
|---|---|---|
| <query> | <int> | <llms> |
| ... | | |

### Cluster #2 — ...

(répéter)

---

## Limites de ce snapshot

- <N> fan-outs vus sur <totalCount> disponibles (paginer si totalCount > 100)
- <autres caveats>
```

### 7.3 — `fan-outs-raw.json`

Le brut de `list_fan_outs` (la donnée que tu as récupérée en étape 3), pour audit ultérieur et permettre à `/mentionable-pillar --from-cluster` de la relire sans re-call MCP.

## Étape 8 — Résumé console

Affiche dans le chat :

```
✅ Snapshot généré : projects/<projectSlug>/discovery/<today>/
   Projet : <projectName>
   <totalFanOutsAnalyzed> fan-outs · <totalClustersFound> clusters

🎯 Top 5 clusters (par fréquence LLM cumulée) :

1. <theme> [<intent>, freq=<X>, <status>]
   → /mentionable-pillar "<seed>" --project-slug <projectSlug>

2. <theme> [<intent>, freq=<X>, <status>]
   → /mentionable-pillar "<seed>" --project-slug <projectSlug>

3. ... (etc.)

📊 Répartition :
   - <N> clusters informational
   - <N> clusters commercial / transactional
   - <N> clusters non-trackés (priorité GEO)

Prochain run conseillé : dans 2-4 semaines pour observer l'évolution des fan-outs.
```

## Règles strictes

- **Pas d'invention** : les clusters et les seeds suggérés viennent UNIQUEMENT des fan-outs réels collectés. Pas de seed deviné, pas de cluster théorique.
- **Seed simplifié** : un `seedSuggested` doit être un terme de recherche neutre (2-5 mots), pas une phrase entière. Retirer les mentions de marque, les superlatifs marketing ("meilleur", "top"), les modificateurs régionaux sauf si centraux au thème.
- **Cap raisonnable** : 15 clusters max. Au-delà, le rapport devient illisible. Fusionne les petits clusters dans `divers` ou abandonne-les.
- **Persistance** : ne supprime JAMAIS un snapshot existant sans demander confirmation. L'historique est la valeur principale de cette commande.
- **Confidentialité** : `projects/` est gitignoré globalement. Les fan-outs contiennent des données client — pas de leak.

## Chaînage suggéré en aval

Une fois `clusters.json` produit, le workflow continue manuellement :

1. L'utilisateur choisit un cluster (visuellement, depuis `clusters.md`)
2. Il lance la commande suggérée. Pour les pilier+satellites :
   ```
   /mentionable-pillar "<seedSuggested>" --project-slug <projectSlug> --from-cluster projects/<projectSlug>/discovery/<today>/clusters.json#cluster-1
   ```
   Le flag `--from-cluster` permet à `/mentionable-pillar` de :
   - skip la sélection projet (déduit du path)
   - réutiliser les fan-outs déjà collectés (skip le call list_fan_outs de l'étape 4)
   - faire référence au cluster source dans le `plan.md` (traçabilité)
3. Puis `/mentionable-article projects/<projectSlug>/pillars/<slug>` pour générer le contenu.

Voir [playbooks/12-clusters-discovery.md](../../playbooks/12-clusters-discovery.md) pour le workflow détaillé.
