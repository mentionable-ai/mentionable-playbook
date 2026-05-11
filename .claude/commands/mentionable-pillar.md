---
description: Stratégie pilier + satellites depuis un seed keyword (DataForSEO) enrichie avec le signal LLM (MCP Mentionable)
argument-hint: <seed keyword>
allowed-tools: Bash, Read, Write, AskUserQuestion
---

Tu es un stratège SEO + GEO. À partir du seed keyword `$ARGUMENTS`, tu produis un plan éditorial actionnable **pilier + satellites** qui croise le signal SERP (DataForSEO) avec le signal LLM (MCP Mentionable). L'objectif : des pages qui rankent à la fois sur la SERP Google **et** dans les réponses des LLMs.

Si `$ARGUMENTS` est vide, demande à l'utilisateur le seed keyword.

## Pré-requis (vérifier au tout début, une seule fois)

1. `package.json` à la racine et dossier `node_modules` présent. Si absent → `npm install`.
2. Fichier `.env` à la racine avec `DATAFORSEO_LOGIN` et `DATAFORSEO_PASSWORD`. Si absent → indique à l'utilisateur de copier `.env.example` en `.env` et de remplir ses credentials (voir [docs/dataforseo-setup.md](../../docs/dataforseo-setup.md)).
3. MCP Mentionable installé (les tools `list_projects`, `list_fan_outs`, `list_competitors`, `list_llm_sources` doivent être disponibles). Si absent → indique [docs/getting-started.md](../../docs/getting-started.md).
4. Node ≥ 18 (`node --version`).

Si l'un manque, arrête et explique clairement la commande à exécuter.

## Étape 1 — Sélection du projet Mentionable

Avant de lancer le pipeline DataForSEO (qui consomme des crédits), confirme le projet sur lequel on va croiser le signal LLM.

### Mode A — Avec `--from-cluster <path>` (recommandé si tu viens de `/mentionable-clusters`)

Si `$ARGUMENTS` contient `--from-cluster projects/<slug>/discovery/<date>/clusters.json#cluster-N` :

1. Extrais `projectSlug` du path et `clusterId` du fragment `#cluster-N`.
2. Lis `projects/<projectSlug>/.project.json` → `projectId`, `projectName`.
3. Lis `projects/<projectSlug>/discovery/<date>/clusters.json`, trouve le cluster dont l'`id` matche `clusterId`.
4. Stocke en mémoire les champs du cluster : `theme`, `intent`, `fanOuts`, `promptIds`, `seedSuggested`.
5. Si `$ARGUMENTS` ne contient pas de seed keyword positionnel, **utilise `seedSuggested` du cluster comme seed**.
6. Passe directement à l'étape 2.

Bénéfices : skip de la sélection projet, réutilisation des fan-outs déjà collectés (étape 4 enrichie sans nouveau call MCP), traçabilité du cluster source dans le `plan.md` généré.

### Mode B — Sans `--from-cluster` (sélection interactive)

1. `list_projects()` → liste des projets.
2. **Si un seul projet** : utilise-le, affiche son nom pour confirmation visuelle et continue.
3. **Si plusieurs projets** : utilise `AskUserQuestion` pour faire choisir l'utilisateur (label = nom du projet, description = domaine principal si dispo). Pas de "Other" — l'utilisateur doit choisir parmi les projets existants.
4. **Si zéro projet** : arrête et indique à l'utilisateur de créer un projet sur [app.mentionable.ai](https://app.mentionable.ai) avant de relancer.

### Communs aux deux modes

Stocke `projectId`, `projectName` et calcule `projectSlug` (kebab-case du nom, sans accents, max 60 char) — réutilisés en étapes 2, 4, 5, 6.

Tu peux aussi conseiller `/mentionable-clusters` à l'utilisateur en amont s'il n'a pas encore exploré les fan-outs du projet : c'est la commande dédiée pour transformer le signal LLM brut en seeds prêts à passer ici.

## Étape 2 — Pipeline DataForSEO

Lance le script depuis la racine du repo en passant le `projectSlug` :

```bash
npm run pillar -- "$ARGUMENTS" --project-slug <projectSlug>
```

Le script écrit `./projects/<projectSlug>/pillars/<seedSlug>/brief.json` contenant :
- `pillar` : mot-clé pilier retenu, volume, KD, longueur cible, top 10 SERP avec domaines, termes sémantiques partagés, échantillon de headings concurrents
- `satellites` : clusters groupés par intent et theme, avec leurs articles candidats (titre, volume, KD)

> **Convention de stockage** : tout ce qui concerne un projet Mentionable vit sous `projects/<projectSlug>/` (`.project.json`, `pillars/`, `articles/`). Cf. README.

Récupère le `slug` (seed-slug) affiché dans la sortie du script. Le dossier de travail pour la suite est `./projects/<projectSlug>/pillars/<slug>/`.

Si le fichier `./projects/<projectSlug>/.project.json` n'existe pas, crée-le maintenant avec le Write tool :

```json
{
  "projectId": "<projectId>",
  "projectName": "<projectName>",
  "projectUrl": "<url du projet si dispo>",
  "createdAt": "<ISO date>"
}
```

Ce fichier permet aux commandes downstream (`/mentionable-article`, `/mentionable-images`) de retrouver le projet Mentionable sans re-demander.

## Étape 3 — Lis le brief

`Read ./projects/<projectSlug>/pillars/<slug>/brief.json` — c'est ta source de vérité pour la suite. Note :
- `pillar.targetKeyword` (le mot-clé pilier)
- `pillar.top10Serp[].domain` (liste des domaines à croiser en étape 4)
- `satellites[].theme` (chaque theme va être enrichi en étape 4)

## Étape 4 — Cross-signal A : demande LLM par cluster (`list_fan_outs`)

Tu as déjà `projectId` depuis l'étape 1. **Pour chaque cluster satellite** (et pour le pilier lui-même), lance :

> **Mode `--from-cluster`** : tu as déjà les fan-outs en mémoire (cluster source). Tu peux **skip** les call `list_fan_outs(search: theme_du_cluster_source)` pour ce thème central et utiliser directement les fan-outs en mémoire. Continue à appeler `list_fan_outs` pour les *autres* clusters DataForSEO qui n'étaient pas dans le cluster source, pour ne pas perdre de signal.

```
list_fan_outs(projectId, filters: { search: "<theme du cluster>" }, limit: 20, sortBy: "frequency")
```

Lance les calls **en parallèle** (un seul message, N tool calls). Pour chaque cluster note :
- `fanOutsMatched` : nombre de fan-outs trouvés
- `cumulativeFrequency` : somme des fréquences
- `llmsConcerned` : union des LLMs qui surfacent ces fan-outs
- `promptIds` : ids parents (réutilisés en étape 5)

Tag chaque cluster :
- `double_demande` si `cumulativeFrequency ≥ 5` → priorité haute (volume Google **et** demande LLM)
- `serp_only` si `fanOutsMatched == 0` → SEO classique, pas de pari GEO
- `geo_dominant` si volume Google faible mais fanOutsMatched élevé → pari GEO pur (rare)

## Étape 5 — Cross-signal B : concurrents SERP vs concurrents LLM (`list_competitors`)

Un seul call :

```
list_competitors(projectId, limit: 30, filters: { status: ["CONFIRMED"] }, sortBy: "mentions_desc")
```

Récupère le set de domaines (`competitor.domain` normalisé sans `www.`).

Pour chaque URL du `pillar.top10Serp`, pose un flag :
- `llmStatus = "✓"` si le domaine est dans le set des concurrents LLM
- `llmStatus = "✗"` sinon

Calcule deux signaux globaux :
- `hegemonicCount` : nb de domaines top 10 SERP qui sont aussi top concurrents LLM → si ≥ 4, la niche est verrouillée des 2 côtés
- `serpOnlyCount` : nb de domaines top 10 SERP **absents** des concurrents LLM → opportunité GEO sur le pilier

## Étape 6 — Cross-signal C : sources d'autorité à citer (`list_llm_sources`)

Agrège tous les `promptIds` collectés en étape 4 (déduplique). Lance :

```
list_llm_sources(projectId, filters: { promptIds: [...tous-les-promptIds] }, limit: 30, sortBy: "appearances_desc")
```

Retiens les **8 domaines** les plus cités par les LLMs sur ces prompts. Ce sont les sources d'autorité que les articles (pilier + satellites) devront citer en outbound pour ressembler aux pages que les LLMs trustent déjà.

Si zéro `promptIds` collectés (aucun fan-out trouvé en étape 4), saute cette étape et indique-le dans le rapport.

## Étape 7 — Recalcul du score satellite

Pour chaque cluster satellite :

```
score_final = score_dataforseo × (1 + 0.5 × min(cumulativeFrequency / 10, 2))
```

(Le score DataForSEO de base = `totalVolume × (100 − KD_moyen) / 100`. Si KD non dispo, prends 50.)

Retri les satellites par `score_final` décroissant.

## Étape 8 — Produis le plan markdown

Écris `./projects/<projectSlug>/pillars/<slug>/plan.md` avec cette structure exacte. **Pas de lorem ipsum** — titres réels, ancres réelles, domaines réels extraits des données.

```markdown
# Stratégie SEO + GEO : <seed>

> Projet Mentionable : `<projectName>` · Loc <LOCATION_CODE> · Lang <LANGUAGE_CODE> · Généré le <date> · `npm run pillar -- "<seed>"`
> Source : <si --from-cluster, path du clusters.json#cluster-N ; sinon "seed direct">.

## TL;DR

- **Pilier retenu** : `<targetKeyword>` (vol=<volume>, KD=<difficulty>, intent=<intent>)
- **<N> clusters satellites** (<X> à double demande SERP+LLM, <Y> SERP-only)
- **Niche LLM** : <hegemonicCount>/10 domaines du top SERP dominent aussi les LLMs → [verrouillée / mixte / ouverte]
- **Prochaine action** : <satellite #1 ou pilier — voir roadmap>

## 🏛️ Article pilier

- **Mot-clé cible** : `<targetKeyword>` · volume=<vol> · KD=<kd> · intent=<intent>
- **Longueur cible** : <targetWordCount> mots (concurrents = <avgWordCount> en moyenne)
- **Demande LLM** : <cumulativeFrequency> fan-outs cumulés sur <N> LLMs (<liste>)

### Plan H1 + H2/H3 proposé

Couvrir les termes sémantiques requis et répondre aux fan-outs LLM trouvés.

- H1 : <reformulation du targetKeyword en titre éditorial>
- H2 — <section 1 inspirée des concurrents>
  - H3 — <sous-section>
- ... (vise 6-10 H2, dont une H2 "FAQ")

### Top 10 SERP — qui est dominant aussi en LLM ?

| Rank | Domaine | URL | LLM | Mots |
|---|---|---|---|---|
| 1 | <domain> | <url> | <✓/✗> | <wordCount> |
| ... | | | | |

**Lecture** : <hegemonicCount> domaines SERP sont aussi tops LLM (ennemis double-front). <serpOnlyCount> sont SERP-only (opportunité GEO).

### Sources d'autorité à citer en outbound

Domaines que les LLMs lisent réellement pour ce type de requête — citer 4-6 en outbound :

| Domaine | Apparitions LLM | Pourquoi |
|---|---|---|

### Termes sémantiques à intégrer

<liste comma-separated de pillar.semanticTermsToCover>

### Angles différenciants (vs top 10 SERP)

3 angles que les concurrents ne traitent PAS, déduits de `competitorHeadingsSample` :

- <angle 1>
- <angle 2>
- <angle 3>

## 🛰️ Pack satellites

Trié par `score_final` décroissant.

### Satellite #1 — <theme> [<tag : double_demande / serp_only / geo_dominant>]

- **Intent** : <intent>
- **Volume cumulé** : <totalVolume>
- **Demande LLM** : <cumulativeFrequency> fan-outs · LLMs : <liste>
- **Score final** : <score>
- **Articles candidats** :

  | Titre / mot-clé | Volume | KD |
  |---|---|---|
  | <keyword> | <vol> | <kd> |

- **Angle éditorial** : <1 phrase>
- **Sources à citer** : <2-3 depuis l'étape 5>

### Satellite #2 — ...

(répéter pour chaque cluster, tri par score_final)

## 🔗 Maillage interne

- **Schéma** : chaque satellite → lien vers le pilier (ancre = variation sémantique de `<targetKeyword>`)
- **Cross-links** : satellites de même intent se citent entre eux quand pertinent
- **Section dédiée dans le pilier** : H2 "Pour aller plus loin" qui renvoie vers les N satellites avec ancre descriptive
- **Ancres recommandées** (échantillon) :
  - Pilier ← Satellite "<theme>" : "<ancre concrète>"
  - ...

## 📋 Roadmap de production

**Ordre** : <pilier-first | satellites-first>

Justification :
- Si `hegemonicCount ≥ 4` ET le pilier est KD-difficile (>50) → **satellites-first** sur les 2-3 clusters double_demande pour construire l'autorité avant d'attaquer le pilier
- Sinon → **pilier-first** (centralise l'autorité, puis les satellites maillent vers lui)

| Ordre | Article | Cluster | Score | Pourquoi |
|---|---|---|---|---|
| 1 | <titre> | <theme ou "pilier"> | <score> | <raison> |
| ... | | | | |

## Chaînage suggéré

Pour aller plus loin, lance :
- `/mentionable-brief "<satellite #1 mot-clé>"` — brief détaillé du premier article à produire
- `/mentionable-content-gap` — matche les fan-outs non couverts par ce plan
- `/mentionable-images <chemin-article.md>` — illustrations une fois l'article rédigé
```

## Étape 9 — Résumé final dans le chat

Affiche en 3 bullets :

```
✅ Plan généré : ./projects/<projectSlug>/pillars/<slug>/plan.md
   - Projet Mentionable : "<projectName>"
   - Pilier : "<targetKeyword>" (vol=X, KD=Y)
   - <N> satellites prioritaires dont <X> à double demande SERP+LLM
   - Next : /mentionable-article ./projects/<projectSlug>/pillars/<slug>
```

## Règles strictes

- **Pas d'invention** : tous les domaines, fan-outs, concurrents, sources doivent venir des données réelles (DataForSEO + MCP). Si la donnée manque, signale-le explicitement dans le plan plutôt que d'inventer.
- **Calls MCP en parallèle quand possible** : un seul message avec N tool calls pour les `list_fan_outs` de l'étape 4.
- **Slug stable** : utilise toujours le slug renvoyé par le script — ne pas le re-générer.
- **Confirme avant relancer DataForSEO** : si `./projects/<projectSlug>/pillars/<slug>/brief.json` existe déjà, demande si on relance le pipeline (chaque run coûte des crédits DataForSEO) ou si on repart du fichier existant.
- **Tone exec, factuel** : pas de prose marketing, pas de superlatifs.
