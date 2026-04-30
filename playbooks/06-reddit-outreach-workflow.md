# Playbook 06 — Triage Reddit hebdo

> Reddit est sur-représenté dans les sources LLM (ChatGPT en particulier).
> Cette commande trie les threads cités par les LLMs, te dit lesquels valent un commentaire, et nettoie le reste.

## Objectif

Workflow hebdomadaire de **triage des opportunités Reddit** : ranking, enrichissement (scraping Bright Data) sélectif, recommandation d'angle de commentaire, et marquage en bulk du reste.

## Pour qui

- **Community manager / growth** qui pilote la présence Reddit
- **SEO in-house / agence** qui cherche des leviers GEO différenciants
- **Founder de SaaS** qui fait du community-led GEO

## Pré-requis

- MCP Mentionable installé
- Tracking Mentionable activé depuis 7+ jours (pour avoir des threads détectés)
- Crédits AI disponibles (l'enrichissement Bright Data en consomme)
- Compte Reddit avec un peu d'historique (les comptes neufs se font ban)

## Tools MCP utilisés

- `list_projects`, `list_reddit_threads`
- `enrich_reddit_thread` — scraping Bright Data (asynchrone, payant)
- `get_reddit_thread` — polling
- `bulk_update_reddit_thread_status` — nettoyage en bulk

## Sur Claude Code

```
/mentionable-reddit-triage
```

Avec un filtre subreddit :

```
/mentionable-reddit-triage SaaS
/mentionable-reddit-triage entrepreneur
```

## Sur Cursor / Claude Desktop / autre client

```text
Tu es un community / SEO senior. Trie les threads Reddit cités par les LLMs.

1. list_projects() → projectId
2. list_reddit_threads(projectId, filters.status: ["NEW"], limit: 50, sortBy: "score_desc")
   [si filtre subreddit : filters.subredditContains: "<sub>"]
3. Pré-tri sans enrichissement : Top (20%) / Medium / Bas
4. Demande-moi confirmation avant d'enrichir (max 5 threads, c'est payant)
5. Pour les Top : enrich_reddit_thread, puis poll get_reddit_thread toutes les 30s (max 4 min)
6. Pour les Bas : bulk_update_reddit_thread_status(updates: [...{status: "SKIPPED"}])
7. Pour chaque thread enrichi : lis title/body/topComments et propose verdict + angle de commentaire (non promotionnel)

Rends un rapport :
- Résumé (analysés, enrichis, skipped, à commenter)
- Threads à commenter (titre, sub, signal GEO, verdict, angle suggéré 3-5 phrases)
- Threads SKIPPED automatiquement
- Threads à observer la semaine prochaine

Règles : confirmation avant enrichissement (payant), angle jamais promo, tone authentique.
```

## Exemple de livrable

```markdown
# Triage Reddit — Acme SaaS

> Période : threads NEW à date · Filtre : aucun

## Résumé

- Threads NEW analysés : 27
- Threads enrichis : 4
- Threads SKIPPED en bulk : 18
- Recommandés à commenter : 3

## Threads à commenter

### "Looking for an alternative to CompetitorA — fed up with their pricing changes"

- **r/[subreddit]** · `https://reddit.com/r/.../comments/abc123/...` · upvotes: 142 · commentaires: 67
- **Signal GEO** : cité par 3 LLMs sur 4 prompts trackés
- **Verdict** : Commenter maintenant
- **Pourquoi** : OP cherche activement une alternative, thread chaud (24h), 67 commentaires = audience engagée
- **Angle suggéré** :
  > "On a fait la même bascule il y a 6 mois. CompetitorA est solide mais le pricing par seat devient vite douloureux dès qu'on dépasse 20 users. On utilise [notre marque] depuis et le delta principal c'est [bénéfice concret], par contre on a perdu [petite contrepartie honnête]. Si tu veux je peux te détailler ce qui m'a vraiment manqué pendant la migration."
- **Action après commentaire** : marquer COMMENTED dans le dashboard

### "What's the ROI of [catégorie] for a 10-person team?"

- **r/SaaS** · upvotes: 89 · commentaires: 34
- **Signal GEO** : cité par 2 LLMs sur 2 prompts trackés
- **Verdict** : Commenter maintenant
- **Pourquoi** : question ouverte, intent transactionnel, faible compétition de réponses qualitatives
- **Angle suggéré** :
  > "Pour 10 personnes c'est souvent à partir du moment où tu passes plus de 2h par semaine sur [tâche manuelle X]. On a calculé chez nous : 4h/semaine × 4 semaines × taux horaire = X €. À partir de là n'importe quel outil dans la fourchette 50-150 €/mois rentabilise. Le vrai sujet c'est plutôt [point qualité]."

### "Self-hosted [catégorie] vs cloud — what would you choose in 2026?"

- **r/selfhosted** · upvotes: 203 · commentaires: 91
- **Signal GEO** : cité par 4 LLMs sur 3 prompts trackés
- **Verdict** : Commenter maintenant
- **Pourquoi** : énorme audience (203 upvotes), thread evergreen sur sujet fan-out fort
- **Angle suggéré** :
  > "Self-hosted en 2026 a du sens dans 3 cas précis : conformité strictes, équipes très techniques, ou usage à très haut volume. En dehors, les coûts cachés (RGPD, backups, maintenance versions) dépassent vite le SaaS équivalent. J'ai documenté un calcul là-dessus si ça t'intéresse."

## Threads SKIPPED automatiquement

| # | Subreddit | Score | Raison |
|---|---|---|---|
| 1 | r/[autre] | 12 | thread vieux de 8 mois, 0 LLM citation récente |
| 2 | r/[autre] | 4 | upvotes faibles, 1 LLM seulement |
| ... | | | (18 entrées au total) |

## Threads à observer la semaine prochaine

- "Best [catégorie] for solopreneurs in 2026" (r/Entrepreneur, upvotes 56)
- "Migration from [outil] to [autre]" (r/[sub], upvotes 38)
- (4 autres entrées)
```

## Variantes

- **Triage par subreddit** : `/mentionable-reddit-triage SaaS` pour cibler un sub spécifique
- **Triage approfondi** : "enrichis 10 threads au lieu de 5" — coûte plus cher en crédits
- **Triage sans enrichissement** : "ne fais pas d'enrichissement, juste le ranking sur les signaux bruts" — gratuit
- **Mode rétro** : "regarde les threads COMMENTED des 30 derniers jours et donne-moi un retour sur l'impact GEO" — utile pour reporting

## Aller plus loin

- [Reverse engineering d'un concurrent qui domine sur Reddit](03-reverse-engineering-concurrents.md)
- [Reporting hebdo intégrant les actions Reddit](08-reporting-hebdo-geo.md)

## Notes éthiques

- Reddit a des règles strictes contre la promotion. **Apporter de la valeur d'abord**, mentionner sa marque seulement si pertinent, et **divulguer son affiliation** si on est employé/founder.
- Un compte avec 0 historique qui débarque pour pitcher un produit = ban immédiat. Travaille un compte avec des contributions réelles avant d'utiliser ce playbook.
