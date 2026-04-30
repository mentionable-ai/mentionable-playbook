# Mentionable Playbook

> Le playbook open-source pour démarrer avec le **MCP Mentionable** et faire du GEO actionnable depuis Claude Code, Cursor ou Claude Desktop.

[Mentionable](https://mentionable.ai) est une plateforme de **GEO (Generative Engine Optimization)** : tracking, mesure et acquisition de visibilité dans les LLMs (ChatGPT, Perplexity, Gemini, Claude, Google AIO/AI Mode, Copilot, Grok).

Le **MCP Mentionable** expose ces données à un agent IA. Ce repo contient des **slash commands prêtes à l'emploi** et des **playbooks détaillés** pour transformer ces données en livrables exécutables.

## Pour qui ?

- **Consultant SEO freelance** — auditer un nouveau client en 2 minutes, livrer un reporting hebdo automatisé
- **SEO in-house** — monitorer la visibilité GEO de son entreprise, prioriser le contenu et les backlinks
- **Agence SEO** — industrialiser le diagnostic et la production sur N clients
- **Agence web** — proposer une offre GEO crédible sans construire l'outillage

## Démarrage rapide

```bash
# 1. Cloner le repo
git clone https://github.com/mentionable-ai/mentionable-playbook.git
cd mentionable-playbook

# 2. Installer le MCP Mentionable (voir docs/getting-started.md)

# 3. Ouvrir le repo dans Claude Code et lancer
/mentionable-audit
```

Si tu n'as pas Claude Code, chaque playbook contient le **prompt complet à copier-coller** dans Cursor, Claude Desktop ou tout autre client compatible MCP.

## Use cases inclus


| #   | Slash command                                                                 | Pour qui              | Livrable                             |
| --- | ----------------------------------------------------------------------------- | --------------------- | ------------------------------------ |
| 1   | `[/mentionable-audit](.claude/commands/mentionable-audit.md)`                 | Tous, jour 1          | Audit GEO complet exec-ready         |
| 2   | `[/mentionable-sov](.claude/commands/mentionable-sov.md)`                     | Consultant, agence    | Share of Voice par LLM + heatmap     |
| 3   | `[/mentionable-reverse](.claude/commands/mentionable-reverse.md)`             | Tous                  | Reverse engineering d'un concurrent  |
| 4   | `[/mentionable-content-gap](.claude/commands/mentionable-content-gap.md)`     | SEO content, in-house | Backlog éditorial issu des fan-outs  |
| 5   | `[/mentionable-brief](.claude/commands/mentionable-brief.md)`                 | Rédacteurs, content   | Brief d'article complet              |
| 6   | `[/mentionable-reddit-triage](.claude/commands/mentionable-reddit-triage.md)` | Community, growth     | Triage hebdo des opportunités Reddit |
| 7   | `[/mentionable-backlinks](.claude/commands/mentionable-backlinks.md)`         | Link builder, agence  | Plan d'achat de backlinks            |
| 8   | `[/mentionable-weekly](.claude/commands/mentionable-weekly.md)`               | Consultant, freelance | Reporting hebdo client               |


Chaque slash command a son **playbook .md équivalent** dans `[playbooks/](playbooks/)` avec contexte, prompt brut, exemple de livrable et variantes.

## Documentation

- [Getting started](docs/getting-started.md) — installer le MCP, créer un projet, premiers appels
- [Concepts GEO](docs/concepts.md) — fan-outs, citations, Share of Voice, vocabulaire
- [Tools reference](docs/tools-reference.md) — cheatsheet des 12 tools MCP

## Contribuer

Tu as un workflow GEO qui marche bien chez tes clients ? Ouvre une PR.
Voir [CONTRIBUTING.md](CONTRIBUTING.md).

## Licence

MIT — utilise, fork, adapte chez tes clients sans restriction.

---

**Maintenu par** [Mentionable](https://mentionable.ai) 