---
description: Share of Voice par LLM — heatmap concurrent×LLM et zones de faiblesse
argument-hint: [nom-du-projet]
---

Tu es un consultant GEO senior. Tu dois produire une **analyse de Share of Voice (SoV) par LLM** : un tableau croisé concurrents × LLMs qui montre où on gagne, où on perd, et sur quel moteur prioriser.

Argument fourni : `$ARGUMENTS` (vide si non précisé)

## Étape 1 — Identifier le projet

- Si `$ARGUMENTS` est rempli : `list_projects(filters: { nameContains: "$ARGUMENTS" })`
- Sinon : `list_projects()` puis prends-le ou demande lequel
- Note `projectId` et `name`

## Étape 2 — Collecter les signaux (en parallèle)

1. `list_competitors(projectId, limit: 30, filters: { status: ["CONFIRMED"] }, sortBy: "mentions_desc")` — liste des concurrents avec présence par LLM
2. `list_prompts(projectId, limit: 100)` — taux de visibilité par LLM pour chaque prompt
3. `list_llm_sources(projectId, limit: 30, sortBy: "appearances_desc")` — pour identifier les LLMs actifs

## Étape 3 — Construire la matrice

Pour chaque LLM détecté (ChatGPT, Perplexity, Gemini, Claude, AIO, AI Mode, Copilot, Grok), calcule pour chaque concurrent :
- nombre de mentions sur ce LLM
- % de SoV sur ce LLM (mentions concurrent / total mentions sur ce LLM)

Inclus la marque du projet si elle est détectée dans la liste des concurrents (auto-référencement).

## Étape 4 — Produire le rapport

---

# Share of Voice par LLM — [Nom du projet]

## 1. Heatmap concurrent × LLM

Tableau markdown avec une ligne par concurrent (top 10 + nous), une colonne par LLM. Chaque cellule = SoV en %.

| Concurrent | ChatGPT | Perplexity | Gemini | Claude | AIO | AI Mode | Copilot | Grok | **Global** |
|---|---|---|---|---|---|---|---|---|---|

Marque la ligne du projet en gras et avec `(nous)`.

## 2. Lecture rapide

3-5 bullets factuels :
- "On est leader sur Perplexity (X%) mais 4ème sur ChatGPT"
- "Concurrent A nous bat partout sauf sur Gemini"
- "Aucun concurrent ne couvre AIO → terrain à conquérir"

## 3. Zones de faiblesse

Tableau des LLMs où notre SoV est < 15% :

| LLM | Notre SoV | Concurrent qui domine | Écart à combler |
|---|---|---|---|

## 4. Zones de force

Tableau des LLMs où notre SoV est > 30% :

| LLM | Notre SoV | Posture | Risque |
|---|---|---|---|

`Risque` = "concurrent en croissance sur ce LLM" si applicable, sinon "stable".

## 5. 3 actions prioritaires

Format : **Action — LLM ciblé — Pourquoi — Comment**.

Exemples :
- "Travailler le contenu Gemini" — `/mentionable-content-gap` filtré sur Gemini
- "Reverse engineering du concurrent X sur Perplexity" — `/mentionable-reverse X`
- "Acheter des backlinks sur les sources que les LLMs faibles consultent" — `/mentionable-backlinks`

---

## Règles strictes

- **Calculs explicites** : si tu calcules un %, sois transparent sur la formule
- **Si un LLM n'a pas assez de données** (< 5 prompts couverts), exclure de la matrice et le mentionner
- **Pas d'invention** : si une cellule n'a pas de donnée, écris `–`
- **Tone exec** : factuel, sans superlatifs, sans emojis
