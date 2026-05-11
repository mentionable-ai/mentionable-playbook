# Setup DataForSEO

`/mentionable-pillar` utilise l'API DataForSEO pour la recherche de mots-clés, l'analyse SERP et le scoring KD. Ce guide te fait passer du zéro à `npm run pillar` qui tourne.

## 1. Créer un compte

1. Va sur [app.dataforseo.com](https://app.dataforseo.com/register).
2. Crée un compte (mail + mot de passe ou Google).
3. Tu reçois **1 $ de crédits gratuits** à l'inscription — assez pour 5-10 runs `/mentionable-pillar` sur un seed.

## 2. Récupérer tes credentials API

1. Une fois connecté, va dans **API Access** → onglet **API Dashboard** (`app.dataforseo.com/api-access`).
2. Note les deux valeurs :
   - **API Login** (souvent ton email)
   - **API Password** (chaîne générée — clique sur "Show" pour la révéler)

Ces deux valeurs vont dans `.env`.

## 3. Configurer le .env

À la racine du repo :

```bash
cp .env.example .env
```

Édite `.env` :

```env
DATAFORSEO_LOGIN=ton-email@example.com
DATAFORSEO_PASSWORD=xxxxxxxxxxxxxxxx

# Localisation par défaut. Override possible via CLI : --location 2840 --language en
LOCATION_CODE=2250
LANGUAGE_CODE=fr
```

## 4. Codes location & langue

DataForSEO utilise des codes numériques pour les pays. Les plus utilisés :

| Pays | `LOCATION_CODE` | `LANGUAGE_CODE` |
|---|---|---|
| France | `2250` | `fr` |
| États-Unis | `2840` | `en` |
| Royaume-Uni | `2826` | `en` |
| Espagne | `2724` | `es` |
| Allemagne | `2276` | `de` |
| Italie | `2380` | `it` |
| Belgique (FR) | `2056` | `fr` |
| Canada (FR) | `2124` | `fr` |
| Canada (EN) | `2124` | `en` |

Liste complète : [docs.dataforseo.com/v3/serp/google/locations/](https://docs.dataforseo.com/v3/serp/google/locations/).

## 5. Tester

```bash
npm run pillar -- "cours de guitare"
```

Tu dois voir :

```
[1/4] Mots-clés autour de "cours de guitare" (loc=2250, lang=fr)…
      127 mots-clés uniques.
[2/4] Sélection de la cible pilier…
      Cible : "cours de guitare en ligne" (vol=8100, KD=45)
[3/4] Analyse SERP de "cours de guitare en ligne"…
      Longueur moyenne : 2340 mots → cible : 2808
[4/4] Clustering des satellites…
      8 clusters de satellites.

✅ Brief écrit : pillars/cours-de-guitare/brief.json
```

## 6. Coût par run

Un run `/mentionable-pillar` consomme typiquement **0.05 à 0.15 $** de crédits DataForSEO :
- ~0.01 $ — related keywords + suggestions (DataForSEO Labs)
- ~0.003 $ — SERP organique top 10
- Pas de coût supplémentaire pour le scraping des pages concurrentes (fait en local, pas via DataForSEO)

Avec 1 $ de crédits gratuits, tu fais facilement 8-10 runs pour tester.

## Erreurs courantes

| Erreur | Cause | Fix |
|---|---|---|
| `DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD manquants` | `.env` absent ou variables vides | Voir étape 3 |
| `401 Authentication failed` | Mauvais login / password | Re-copier depuis le dashboard, sans espace |
| `40400 No tasks available` | Crédits épuisés | Recharger depuis le dashboard |
| `Empty result` sur certains seeds | Seed trop niche ou mal localisé | Tester avec un `LOCATION_CODE` plus large ou un seed plus générique |

## Override par CLI

Tu peux écraser les défauts `.env` ponctuellement :

```bash
npm run pillar -- "yoga classes near me" --location 2840 --language en
```
