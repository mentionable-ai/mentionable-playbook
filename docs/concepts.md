# Concepts GEO — vocabulaire pour utiliser le playbook

Ce document définit les concepts manipulés dans le MCP et les playbooks. Si tu connais déjà le GEO, tu peux passer à [tools-reference.md](tools-reference.md).

## GEO (Generative Engine Optimization)

Le **GEO** est l'optimisation de la visibilité d'une marque, d'un produit ou d'un domaine dans les **réponses générées par les LLMs** : ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews, Google AI Mode, Copilot, Grok.

Différence avec le SEO classique :


|                  | SEO classique                | GEO                                           |
| ---------------- | ---------------------------- | --------------------------------------------- |
| Surface          | SERP Google (10 liens bleus) | Réponse LLM (1 paragraphe synthétisé)         |
| Mesure           | Position du mot-clé          | Présence dans la réponse + citations          |
| Levier principal | Backlinks + on-page          | Citations sur sources que les LLMs consultent |
| Volatilité       | Stable au jour le jour       | Variable par requête, par LLM, par run        |


## Prompt tracké

Une requête utilisateur surveillée par Mentionable, par exemple :
*"Quel est le meilleur CRM pour une PME française ?"*

Mentionable interroge plusieurs LLMs avec ce prompt à intervalle régulier et capture :

- la réponse complète
- les marques/produits cités
- les sources citées (visibles)
- les sources consultées (en coulisses)
- les **fan-outs** lancés pour répondre

## Fan-out

Quand un LLM reçoit un prompt complexe, il **décompose** la requête en plusieurs sous-recherches web (les fan-outs) avant de synthétiser la réponse.

Exemple — prompt : *"Compare Salesforce, Hubspot et Pipedrive pour une PME"*

Fan-outs probables :

- "Salesforce pricing PME"
- "Hubspot vs Pipedrive 2026"
- "meilleur CRM PME France avis"
- "intégrations Salesforce écosystème français"

**Pourquoi c'est de l'or** : les fan-outs révèlent l'**intention réelle du LLM** — donc les requêtes sur lesquelles il faut être présent. Ce sont des angles d'articles directement actionnables.

## Citation vs Consultation vs Fan-out

Le MCP distingue 3 manières dont un domaine apparaît dans le pipeline LLM :


| Type          | Définition                                                      | Visible dans la réponse ?   |
| ------------- | --------------------------------------------------------------- | --------------------------- |
| **Cited**     | Lien explicitement cité par le LLM dans sa réponse              | Oui — l'utilisateur le voit |
| **Consulted** | Source lue par le LLM mais non citée dans la réponse finale     | Non — caché à l'utilisateur |
| **Fan-out**   | Domaine apparu dans une recherche fan-out, non lue ou non citée | Non                         |


**Implication tactique** : être *cited* > *consulted* > *fan-out*. Mais apparaître en *consulted* prouve déjà que le LLM considère le domaine pertinent.

## Share of Voice (SoV)

Le pourcentage de mentions d'une marque parmi toutes les marques détectées sur un set de prompts trackés.

Exemple sur 100 prompts trackés :

- Concurrent A est mentionné 80 fois → SoV ≈ 35%
- Notre marque est mentionnée 40 fois → SoV ≈ 17%
- 10 autres marques se partagent le reste

Le SoV est mesurable **globalement** ou **par LLM** (souvent très différent : on peut être leader sur Perplexity et invisible sur ChatGPT).

## Visibility rate

Pour un prompt donné, le pourcentage de runs où la marque apparaît.

Si Mentionable interroge 7 LLMs × 4 fois par semaine = 28 runs, et qu'on apparaît dans 7 réponses, le visibility rate du prompt est 25%.

C'est la métrique opérationnelle clé pour identifier :

- Les prompts **forts** (visibility > 50%)
- Les prompts **faibles** (visibility < 20%) → cibles de travail
- Les prompts **perdus** (passage de 60% à 10%) → alerting

## Concurrent (Competitor)

Une marque, produit ou domaine que Mentionable détecte comme alternative à la nôtre dans les réponses LLM.

Statuts possibles :

- `SUGGESTED` : détecté automatiquement, à valider
- `CONFIRMED` : validé manuellement comme concurrent réel
- `REJECTED` : faux positif (ex : marque grand public sans rapport)

Le triage `SUGGESTED → CONFIRMED/REJECTED` est un workflow récurrent (cf. `bulk_update_competitor_status`).

## Source LLM

Domaine apparaissant dans le pipeline LLM (cited / consulted / fan-out) pour les prompts du projet.

C'est la **map du terrain GEO** :

- Quels médias les LLMs lisent dans ta verticale ?
- Quels domaines comparatifs reviennent ?
- Quel poids ont Reddit, G2, Capterra, ProductHunt, Wikipedia, etc. ?

## Reddit thread (cas particulier)

Reddit est sur-représenté dans les sources LLM (ChatGPT en particulier). Mentionable expose un workflow dédié :

1. **Détection** : threads Reddit cités/consultés par les LLMs (`list_reddit_threads`)
2. **Enrichissement** : scraping du contenu via Bright Data (`enrich_reddit_thread`)
3. **Triage** : marquer `COMMENTED` / `SKIPPED` / `NEW` (`bulk_update_reddit_thread_status`)

L'enrichissement consomme des **crédits AI** ; il est asynchrone (1-3 minutes).

## Backlink opportunity

Domaine où acheter un backlink pourrait améliorer la visibilité GEO. Mentionable expose :

- un **impact score** (heuristique de gain GEO attendu)
- les **offres marketplace** disponibles (provider, prix)
- des sorts par impact, prix, ou ratio impact/prix

## Glossaire express


| Terme      | Définition courte                                              |
| ---------- | -------------------------------------------------------------- |
| LLM        | Modèle de langage (ChatGPT, Perplexity, etc.)                  |
| AIO        | Google AI Overviews — les réponses IA en haut de Google        |
| AI Mode    | Google AI Mode — l'interface chat de Google                    |
| Persona    | Profil utilisateur fictif pour segmenter les prompts           |
| Catégorie  | Regroupement thématique de prompts                             |
| Visibility | Taux d'apparition d'une marque sur un prompt                   |
| SoV        | Share of Voice                                                 |
| Crédit AI  | Unité de consommation Mentionable (ex : enrichissement Reddit) |


