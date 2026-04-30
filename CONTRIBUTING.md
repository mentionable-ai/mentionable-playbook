# Contribuer

Tu as un workflow GEO qui marche bien chez tes clients ? Tu veux ajouter un use case, corriger une coquille, traduire un playbook ? Bienvenue.

## Ajouter un use case

Un use case = **1 slash command + 1 playbook .md**.

### 1. Slash command

Crée `.claude/commands/mentionable-<nom>.md` avec ce squelette :

```markdown
---
description: <une phrase qui décrit le livrable>
argument-hint: [argument-optionnel]
---

Tu vas <objectif clair>.

Argument fourni : `$ARGUMENTS`

## Étape 1 — <action>

[appel MCP avec inputs précis]

## Étape 2 — <action>

[...]

## Étape N — Produire le livrable

Format markdown :

### <Titre>

[structure exacte du rendu]

## Règles

- [contraintes de qualité]
```

### 2. Playbook .md

Crée `playbooks/<NN>-<slug>.md` avec :

- **Objectif** (1 phrase)
- **Pour qui** (2-4 personas)
- **Pré-requis**
- **Tools MCP utilisés**
- **Sur Claude Code** (la slash command)
- **Sur autre client** (le prompt complet à copier)
- **Exemple de livrable** (markdown du rendu attendu)
- **Variantes** (filtres, déclinaisons)
- **Aller plus loin** (liens vers playbooks complémentaires)

### 3. Mettre à jour le README

Ajoute ton use case au tableau `Use cases inclus`.

## Principes éditoriaux

- **Agnostique** : pas de niche spécifique, exemples génériques (`[votre secteur]`, `votre marque`)
- **Factuel** : pas d'invention. Si une donnée n'existe pas, dire "non disponible"
- **Actionnable** : un livrable doit être utilisable en l'état (envoi client, copy-paste backlog)
- **Court** : un playbook qui dépasse 200 lignes est probablement deux playbooks
- **Français** pour la v1 (traduction EN à venir)

## Process

1. Fork
2. Branche `feat/<nom-use-case>`
3. PR avec description du use case et un exemple de livrable réel (anonymisé)
4. Review : on regarde format + valeur + qualité éditoriale

## Bugs et corrections

Issues bienvenues. Pour les corrections de coquilles, PR direct sans issue.

## Code de conduite

Soyez respectueux, factuel, sourcé. Pas de bashing de produits concurrents.
