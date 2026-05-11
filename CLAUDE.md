# Guidelines de rédaction d'articles — Mentionable Playbook

> Ce fichier est **chargé automatiquement** par Claude Code à chaque conversation et **doit être relu intégralement** au début de chaque rédaction d'article (`/mentionable-article`, ou toute autre tâche éditoriale). Ces règles s'appliquent au contenu publié par les utilisateurs du playbook ; elles ne concernent pas la documentation interne du repo.

## Pourquoi ces règles

Les LLMs ont des **tics d'écriture statistiquement détectables**. Les détecteurs anti-IA (Originality.ai, GPTZero, Copyleaks, Winston AI, Sapling) reposent en grande partie sur ces signatures. Plus important : les lecteurs humains aussi reconnaissent ces patterns et perdent confiance. Une bonne stratégie GEO (cite-sources, quotation, stats) ne sert à rien si la prose elle-même hurle "généré par IA".

Ces guidelines visent une prose qui **se lit comme du contenu humain expert**, parce que la voix éditoriale est l'un des derniers signaux de différenciation.

## Règles strictes (interdictions absolues)

### Ponctuation interdite

1. **Aucun em-dash** (`—`, U+2014). Jamais. Sous aucune forme. C'est le signal numéro un.
2. **Aucun en-dash** (`–`, U+2013) hors plages chiffrées (`2019–2024` OK). Pas dans une phrase.
3. **Pas d'ellipses Unicode** (`…`). Si une ellipse est nécessaire, utiliser trois points ASCII `...` et rarement.
4. **Pas de guillemets droits anglais** (`" "`) dans un texte français. Toujours les chevrons français : `«  »` avec espaces insécables.

### Substitutions obligatoires

Quand un em-dash semble naturel, utiliser au choix :
- **Une virgule** : « La CNV n'est pas une technique magique, c'est une posture intérieure. »
- **Un point-virgule** : « La CNV demande de la patience ; c'est un apprentissage de plusieurs mois. »
- **Une parenthèse** : « Marshall Rosenberg (psychologue américain élève de Carl Rogers) a développé la méthode dans les années 1960. »
- **Deux phrases séparées** : « La CNV n'est pas une technique magique. C'est une posture intérieure. »

### Vocabulaire banni (français)

Ces mots/expressions sont des signaux IA français. À supprimer ou remplacer :

| Banni | Remplacement |
|---|---|
| « plongeons dans » / « plonger au cœur de » | entrer dans, comprendre, examiner |
| « naviguer » (au sens figuré) | traverser, gérer, parcourir |
| « véritable » (adjectif d'emphase) | retirer, ou « vrai » |
| « véritablement » | vraiment, ou supprimer |
| « littéralement » (au sens figuré) | supprimer |
| « absolument » (en intensificateur) | supprimer |
| « au cœur de » | dans, au centre de, au milieu de |
| « écosystème » (hors tech) | environnement, milieu |
| « univers » (au sens figuré) | monde, domaine |
| « panorama » | aperçu, tour d'horizon |
| « fascinant » / « captivant » | retirer, ou montrer pourquoi c'est intéressant |
| « incontournable » | central, important, utile |
| « il est essentiel de » | il faut, on doit, mieux vaut |
| « il convient de » | il faut |
| « il est important de noter que » | retirer ; commencer la phrase directement |
| « il s'agit de » | c'est, ça consiste à |
| « en somme » / « en conclusion » | retirer, ou « bref » |
| « par ailleurs » | aussi, en plus |
| « en effet » (en début de phrase) | retirer souvent |
| « ainsi » (en début de phrase) | retirer, ou « donc » |
| « découvrez » / « boostez » / « transformez » (impératif marketing) | retirer |
| « révolutionnaire » | retirer |
| « unique en son genre » | retirer |
| « que vous soyez X ou Y » | retirer, ou phrasing direct |
| « n'est-ce pas justement... » | retirer |

### Constructions à éviter

1. **Triade rythmique systématique** : « X, Y et Z. » répété en boucle. Acceptable une fois ; pas en pattern.
2. **Anaphore par trois** : « Vous voulez X. Vous voulez Y. Vous voulez Z. » Tic IA classique. Maximum une fois par article, et uniquement si l'effet rhétorique est délibéré.
3. **« Pas X, mais Y » / « Il ne s'agit pas de X, c'est Y »** : tic massif. Utiliser une seule fois maximum par article, et préférer une formulation positive directe (« Y. »).
4. **Questions rhétoriques en rafale** en intro : « Avez-vous déjà... ? Vous sentez-vous... ? Vous reconnaissez-vous... ? ». Au maximum une question d'accroche, pas trois.
5. **Bullet points avec bold + colon + paraphrase** : `**Concept :** explication du concept` répété 5 fois d'affilée. Varie la structure des listes. Préfère des phrases pleines entre les bullets.
6. **Paragraphes de conclusion qui résument l'article** : « Nous avons vu que X, Y et Z. » À supprimer. Un article bien écrit n'a pas besoin de récapituler.

### Tics structurels à casser

- **Variation des longueurs de phrases**. Une IA tend vers des phrases médium-longues (15-25 mots) en continu. Les humains alternent : phrase courte (3-8 mots), phrase longue (30+), fragment occasionnel.
- **Fragments autorisés**. « Trop tard. » « Et pourtant. » « Pas si simple. » Les humains les utilisent ; les IA évitent.
- **Voix active prioritaire**. Pas « il est nécessaire que la communication soit améliorée » mais « il faut améliorer la communication ».
- **Pas tous les paragraphes en transition**. Si un paragraphe commence par « Cependant », « Toutefois », « Par ailleurs », « En outre », c'est un signal IA. Maximum 1-2 paragraphes avec transition dans un article entier.

## Patterns à privilégier (signal humain)

1. **Détails spécifiques et personnels**. « La semaine dernière, en séance, une cliente m'a dit... » plutôt que « il arrive fréquemment que des personnes... ».
2. **Imperfections contrôlées**. Une parenthèse qui digresse. Une opinion tranchée. Un « je ne suis pas convaincue ». Une concession honnête.
3. **Vocabulaire concret plutôt qu'abstrait**. « Hier soir, à 22 h, après le dîner, elle m'a dit... » plutôt que « dans un contexte familial du soir ».
4. **Phrases courtes pour les idées fortes**. La punchline n'est jamais une phrase de 30 mots.
5. **Citations directes attribuées nommément**. Tactique GEO Princeton (+25-35% de citation rate) ET signal humain (peu d'IA prennent le risque d'attribuer une citation textuelle parce qu'elles peuvent l'inventer).

## Auto-check avant de livrer un article

Avant d'écrire le fichier `article.md` final, l'agent doit faire passer mentalement le texte à travers cette checklist :

1. **Zéro em-dash** (`—`) dans tout le fichier ? Si oui, remplacer chacun.
2. **Aucun mot de la liste bannie** présent ? Si oui, remplacer.
3. **Maximum 1 anaphore par trois** dans tout l'article ?
4. **Maximum 1 « pas X, mais Y »** ?
5. **Pas plus de 2 paragraphes commençant par une transition** (Cependant, Toutefois, Par ailleurs) ?
6. **Variation de longueur de phrase visible** dans chaque section ?
7. **Au moins une citation directe** avec attribution nominative ?
8. **Détails spécifiques** (lieu, heure, nom, chiffre) plutôt que tournures génériques ?

Si une checklist échoue, **reprendre le passage incriminé avant d'écrire le fichier**.

## Cas particuliers

- **Code, JSON, tableaux markdown** : ces guidelines ne s'appliquent pas aux blocs techniques. Les chevrons et em-dashes peuvent y figurer si c'est du code.
- **Citations textuelles d'auteurs** : si une source originale utilise un em-dash, on peut le conserver dans la citation entre guillemets. Pas de modification d'une citation.
- **Documentation interne du repo** (README, playbooks, fichiers `.md` de docs) : ces fichiers peuvent utiliser em-dashes et structure plus IA-friendly puisqu'ils ne sont pas du contenu publié.

## Quand ces règles ne s'appliquent pas

- Conversations dans Claude Code (réponses à l'utilisateur) : style libre, naturel.
- Génération de plans, briefs, JSON, JSON-LD : technique, pas concerné.
- Documentation du playbook (README, docs/, playbooks/) : technique, pas concerné.

Ces règles concernent **uniquement le contenu rédigé pour publication** : `article.md` produit par `/mentionable-article`, ou toute autre rédaction longue destinée à un site web.

---

**Rappel pour l'agent** : à la première étape de `/mentionable-article` (ou de toute rédaction longue), relire ce fichier intégralement, puis garder la checklist active pendant toute la rédaction.
