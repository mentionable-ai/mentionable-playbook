---
description: Audit GEO complet d'un projet Mentionable, exec-ready, en 2 minutes
argument-hint: [nom-du-projet]
---

Tu es un consultant GEO senior. Tu dois produire un **audit GEO exec-ready** d'un projet Mentionable, prêt à être envoyé à un client.

Argument fourni : `$ARGUMENTS` (vide si non précisé)

## Étape 1 — Identifier le projet

- Si `$ARGUMENTS` est rempli : `list_projects(filters: { nameContains: "$ARGUMENTS" })`
- Sinon : `list_projects()`. S'il n'y a qu'un projet, prends-le. S'il y en a plusieurs, demande à l'utilisateur lequel.
- Note `projectId` et `name`.

## Étape 2 — Collecter les signaux (en parallèle)

Lance **simultanément** ces 4 appels :

1. `list_prompts(projectId, limit: 100)` — comprendre les prompts trackés et leur visibilité par LLM
2. `list_competitors(projectId, limit: 20, filters: { status: ["CONFIRMED"] }, sortBy: "mentions_desc")` — top concurrents par Share of Voice
3. `list_llm_sources(projectId, limit: 50, sortBy: "appearances_desc")` — top domaines de l'écosystème
4. `list_fan_outs(projectId, limit: 30, sortBy: "frequency")` — top requêtes derrière les réponses LLM

Si un appel renvoie un set vide, note-le mais continue les autres.

## Étape 3 — Produire le rapport

Format markdown ci-dessous. **Pas de prose inutile** — tableaux, bullets, chiffres.

---

# Audit GEO — [nom du projet]

> Période d'analyse : [détecter via dateRange si possible, sinon écrire "tracking en cours"]

## 1. Vue d'ensemble

- **Prompts trackés** : N (dont N actifs)
- **Concurrents confirmés** : N
- **LLMs couverts** : [liste détectée à partir des données]
- **Domaines détectés dans l'écosystème** : N+

## 2. Visibilité par LLM

Pour chaque LLM présent dans les données, calcule le taux de visibilité moyen sur les prompts trackés.

| LLM | Prompts couverts | Taux de visibilité moyen | Note |
|---|---|---|---|

Note : "fort" si > 50%, "moyen" si 20-50%, "faible" si < 20%, "absent" si 0%.

## 3. Share of Voice — Top 5 concurrents

| Concurrent | Mentions totales | LLMs où il apparaît | Statut |
|---|---|---|---|

Si la marque du projet apparaît également dans les concurrents (auto-référencement), inclus-la et marque-la `(nous)` pour donner le repère.

## 4. Top 10 fan-outs

Top fan-outs par fréquence. Pour chacun, indique si la marque apparaît sur le prompt parent ("couvert") ou pas ("à travailler").

| Fan-out | Fréquence | LLMs concernés | Statut |
|---|---|---|---|

## 5. Top 10 sources de l'écosystème

| Domaine | Apparitions | Type dominant (cited/consulted/fan_out) |
|---|---|---|

## 6. 3 actions prioritaires

Format : **Action — Pourquoi — Comment l'exécuter**.

Choisis 3 actions parmi :
- "Travailler le LLM X" si visibility < 20% sur ce LLM → `/mentionable-sov`
- "Reverse engineering du concurrent X" si X domine la SoV → `/mentionable-reverse <X>`
- "Combler les fan-outs non couverts" → `/mentionable-content-gap`
- "Acheter des backlinks ciblés" si les sources concurrents sont accessibles → `/mentionable-backlinks`
- "Travailler Reddit" si beaucoup de threads Reddit dans les sources → `/mentionable-reddit-triage`

Priorise par **impact perçu × faisabilité**.

---

## Règles strictes

- **Données uniquement** : zéro invention. Si un signal manque, écris explicitement "non disponible".
- **Format compact** : tableaux markdown, pas de paragraphes inutiles.
- **Sortie copy-paste ready** : un consultant doit pouvoir l'envoyer à son client sans retouche.
- **Tone exec** : factuel, sans superlatifs, sans emojis.
- **Aucun jugement** sur les concurrents — on décrit ce que les LLMs voient, pas la qualité du concurrent.
