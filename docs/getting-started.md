# Getting started

5 minutes pour avoir le MCP Mentionable connecté à ton agent IA et lancer ta première commande.

## 1. Créer un compte Mentionable

1. Inscription sur [mentionable.ai](https://mentionable.ai)
2. Crée un projet (ton site, ton produit, ton client)
3. Ajoute quelques prompts à tracker (5-20 pour démarrer)
4. Laisse Mentionable collecter des données pendant 24-48h

> Sans données collectées, le MCP renverra des résultats vides — patience le temps du premier run.

## 2. Récupérer ta clé API

Dans Mentionable → Settings → API → Create new key.

Garde-la précieusement, elle ne s'affiche qu'une fois.

## 3. Connecter le MCP

Le MCP Mentionable est compatible avec **tout client supportant MCP** : Claude Code, Cursor, Claude Desktop, Codex CLI, etc.

Deux méthodes d'authentification sont disponibles :

- **A. Header `Authorization` (recommandée)** — plus propre, plus sûre
- **B. Clé en query string (`?key=...`)** — fallback simple si la config par header te bloque

### Méthode A — Auth par header (recommandée)

#### Claude Code

```bash
claude mcp add mentionable \
  --transport http \
  --url https://mentionable.ai/api/mcp \
  --header "Authorization: Bearer $MENTIONABLE_API_KEY"
```

Vérifie l'installation :

```bash
claude mcp list
```

#### Cursor

Ajoute dans `.cursor/mcp.json` :

```json
{
  "mcpServers": {
    "mentionable": {
      "url": "https://mentionable.ai/api/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

#### Claude Desktop

Ajoute dans `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) ou `%APPDATA%\Claude\claude_desktop_config.json` (Windows) :

```json
{
  "mcpServers": {
    "mentionable": {
      "url": "https://mentionable.ai/api/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

Redémarre Claude Desktop.

### Méthode B — Auth par query string (fallback simple)

**Tutoriel vidéo** — setup MCP Mentionable sur Claude (web / desktop) et ChatGPT via clé en URL :

[![Tutoriel : setup MCP Mentionable via clé en URL](https://img.youtube.com/vi/C1EbdAnwRRo/maxresdefault.jpg)](https://youtu.be/C1EbdAnwRRo?si=peBBhagn_e_e_rzj)

Si tu galères avec la config par header (variable d'env qui ne se charge pas, fichier de conf qui n'est pas pris en compte, client qui ignore les `headers`), tu peux passer ta clé directement dans l'URL :

```
https://mentionable.ai/api/mcp?key=YOUR_API_KEY
```

#### Claude Code

```bash
claude mcp add mentionable \
  --transport http \
  --url "https://mentionable.ai/api/mcp?key=YOUR_API_KEY"
```

#### Cursor

```json
{
  "mcpServers": {
    "mentionable": {
      "url": "https://mentionable.ai/api/mcp?key=YOUR_API_KEY"
    }
  }
}
```

#### Claude Desktop

```json
{
  "mcpServers": {
    "mentionable": {
      "url": "https://mentionable.ai/api/mcp?key=YOUR_API_KEY"
    }
  }
}
```

> **Attention** : avec la méthode B, ta clé API se retrouve en clair dans le fichier de conf et potentiellement dans des logs. À éviter sur les machines partagées. **Ne jamais committer un fichier de conf qui contient cette URL** — vérifie ton `.gitignore`.

## 4. Cloner ce repo

```bash
git clone https://github.com/mentionable-ai/mentionable-playbook.git
cd mentionable-playbook
```

Si tu utilises Claude Code, les **slash commands** dans `.claude/commands/` sont automatiquement détectées dès que tu lances Claude Code dans ce dossier.

## 5. Premier appel

### Sur Claude Code

```
/mentionable-audit
```

Si tu as plusieurs projets, précise lequel :

```
/mentionable-audit nom-de-mon-projet
```

### Sur autre client

Ouvre `[playbooks/01-audit-geo-initial.md](../playbooks/01-audit-geo-initial.md)`, copie le prompt, colle-le dans ton chat. L'agent va appeler les tools MCP et te rendre l'audit.

## Vérifier que ça marche

Si tu obtiens un rapport markdown structuré, c'est gagné.

Si tu obtiens une erreur :

- `**No projects found**` : le MCP est connecté mais ta clé API ne voit aucun projet → vérifie le workspace lié à la clé
- `**Unauthorized**` : la clé API est invalide ou expirée → régénère-la
- `**Tool not found**` : le MCP n'est pas chargé → vérifie `claude mcp list` ou redémarre ton client

## Pour la suite

- Lis les [concepts GEO](concepts.md) si tu débutes
- Parcours la [reference des tools](tools-reference.md)
- Explore les [8 playbooks](../playbooks/)

