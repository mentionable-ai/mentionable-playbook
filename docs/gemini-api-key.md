# Créer une clé API Gemini avec billing activé

> Pré-requis pour utiliser `/mentionable-images`. La génération d'images via Gemini (`gemini-2.5-flash-image`) **n'est pas disponible sur le free tier** — il faut un projet Google Cloud avec un compte de facturation lié (Tier 1).

## TL;DR

1. https://aistudio.google.com/api-keys
2. Clique **"Set up billing"** sur ton projet
3. Lie un compte de facturation (Prepay min. 10 $)
4. Ta clé existante passe automatiquement en Tier 1 — pas besoin d'en recréer une

## Méthode 1 — Via Google AI Studio (recommandé)

C'est la voie la plus courte. AI Studio crée et gère le projet Google Cloud pour toi.

### 1. Accéder à tes clés

Va sur **https://aistudio.google.com/api-keys**.

Tu verras la liste de tes clés API existantes avec, pour chacune :
- Le **projet Google Cloud** associé
- Le **Billing Tier** (Free / Tier 1 / Tier 2 / Tier 3)

Si tu n'as pas encore de clé : clique **"Create API key"** et choisis (ou laisse AI Studio créer) un projet.

### 2. Activer le billing sur le projet

Dans la colonne **Billing Tier**, clique **"Set up billing"** sur la ligne du projet qui héberge ta clé.

> ⚠️ Vérifie bien que tu actives le billing sur **le même projet** que celui de la clé. Activer le billing sur un autre projet ne débloque pas la clé.

### 3. Lier un compte de facturation

- **Nouveau compte** : remplis tes infos de contact + un moyen de paiement (CB)
- **Compte existant** : sélectionne-le dans la liste

Accepte les CGU selon ta région.

### 4. Choisir le plan de facturation

- **Prepay** (recommandé) : tu charges un solde (minimum 10 $), Google débite au fur et à mesure
- **Postpay** (si éligible) : facturation mensuelle

> 💡 Le crédit gratuit de 300 $ Google Cloud **ne couvre pas** l'API Gemini. Tu paies dès le premier appel.

### 5. Premier versement

Pour le Prepay : effectue le versement initial. Le projet passe automatiquement en **Tier 1** et la génération d'images est débloquée.

### 6. Vérifier

- Solde et tier : https://aistudio.google.com/billing
- Test : `npm run generate:image -- --prompt "test blue circle" --out images/test.png`

Si tu vois `✓ images/test.png` → c'est gagné. Si tu vois encore `429 free_tier` → la clé pointe vers un autre projet (retour étape 1, vérifie le rattachement).

## Méthode 2 — Via Google Cloud Console

Plus de contrôle, plus d'étapes. À utiliser si tu veux gérer le projet GCP manuellement (équipe, restrictions IAM, etc.).

### 1. Créer ou sélectionner un projet

**https://console.cloud.google.com/** → sélecteur de projet en haut → "New project" ou choisis-en un existant.

### 2. Lier un compte de facturation

Menu **Billing** → **Link a billing account** → crée ou lie un compte avec carte bancaire.

### 3. Activer l'API Gemini

Menu **APIs & Services → Library** → recherche **"Generative Language API"** → clique **Enable**.

### 4. Créer une clé API

Menu **APIs & Services → Credentials → Create credentials → API key**.

Copie la clé qui s'affiche.

### 5. Restreindre la clé (recommandé)

Sur la clé fraîchement créée, clique **Restrict key** :
- **API restrictions** → coche uniquement **Generative Language API**
- **Application restrictions** → garde "None" pour un usage CLI local

> 📌 À partir du **19 juin 2026**, Google déprécie les clés sans restriction. Restreins-la maintenant.

### 6. Renseigner la clé dans le repo

```bash
cp .env.example .env
# édite .env
GEMINI_API_KEY=AIza...
```

## Coûts indicatifs

- Tarifs à jour : https://ai.google.dev/gemini-api/docs/pricing
- `gemini-2.5-flash-image` ≈ quelques centimes par image au moment de la rédaction
- Chaque appel `/mentionable-images` génère N images = N appels payés

> Pour un article avec 1 cover + 2 illustrations : compte ~3 appels.

## Notes importantes (2026)

- **Mars 2026** : les nouveaux comptes AI Studio sont forcés en plan **Prepay**
- **Juin 2026** : les clés sans restriction d'API seront dépréciées — restreins toujours à "Generative Language API"
- Le crédit gratuit GCP $300 ne s'applique **pas** à l'API Gemini

## Troubleshooting

| Erreur | Cause probable | Solution |
|---|---|---|
| `429 free_tier_requests, limit: 0` | Le billing n'est pas actif sur le projet de la clé | Vérifie le projet associé à la clé sur https://aistudio.google.com/api-keys |
| `403 PERMISSION_DENIED` | API Generative Language pas activée | Active-la dans GCP Console → APIs & Services |
| `400 API key not valid` | Clé incorrecte ou révoquée | Re-copie depuis AI Studio, vérifie l'absence d'espaces |
| `429` malgré billing actif | Quota par minute dépassé | Attends quelques secondes ou répartis les appels |

## Liens utiles

- [Gemini API — Billing](https://ai.google.dev/gemini-api/docs/billing)
- [Gemini API — Pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [Gemini API — Rate limits](https://ai.google.dev/gemini-api/docs/rate-limits)
- [AI Studio — API keys](https://aistudio.google.com/api-keys)
- [AI Studio — Billing](https://aistudio.google.com/billing)
