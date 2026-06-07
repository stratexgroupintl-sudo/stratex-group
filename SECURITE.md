# STRATEX Group — Note technique : sécurité, domaine & durcissement

> Document de prise en main destiné au développeur qui reprend le projet.
> Le site est **statique** (HTML/CSS/JS, sans backend, sans base de données),
> hébergé sur **GitHub Pages**. La surface d'attaque est donc volontairement
> réduite — pas de serveur applicatif, pas de SQL, pas d'authentification.
> L'essentiel du durcissement passe par : HTTPS, en-têtes HTTP, et la
> sécurisation du formulaire de contact.

---

## 1. Nature du site & modèle de menace

- **Type** : site vitrine 100 % statique. Aucune donnée utilisateur stockée côté serveur.
- **Hébergement** : GitHub Pages (fichiers servis tels quels).
- **Seul point dynamique** : le formulaire de contact (`contact.html`), qui envoie
  les demandes via le service tiers **FormSubmit** (`formsubmit.co`).
- **Risques réalistes** :
  - Spam / abus du formulaire de contact.
  - Absence d'en-têtes de sécurité (clickjacking, sniffing MIME, etc.).
  - Dépendances chargées depuis des CDN externes (intégrité à vérifier).
  - Fuite éventuelle d'infos via le dépôt (clés, emails) — **aucune clé secrète
    n'est présente** : FormSubmit n'utilise pas de clé API, seulement l'email public.

---

## 2. Connexion du nom de domaine (GitHub Pages)

### Côté GitHub
1. **Settings → Pages → Custom domain** : saisir le domaine (ex. `www.stratexgroup.com`) → **Save**.
   - GitHub crée automatiquement un fichier `CNAME` à la racine du dépôt. **Ne pas le supprimer.**
2. Cocher **Enforce HTTPS** (apparaît une fois le certificat émis, peut prendre jusqu'à 24 h).

### Côté registraire (zone DNS)
- **Sous-domaine `www`** → enregistrement **CNAME** :
  `www` → `<compte-github>.github.io`
- **Domaine apex (sans www)** → 4 enregistrements **A** vers les IP GitHub Pages :
  ```
  185.199.108.153
  185.199.109.153
  185.199.110.153
  185.199.111.153
  ```
  (Optionnel mais recommandé, ajouter aussi les AAAA IPv6 de GitHub Pages.)
- Choisir le domaine canonique (apex ou www) et **rediriger l'autre** vers lui.

### Vérification
- `dig www.stratexgroup.com` et `dig stratexgroup.com` doivent pointer vers les bonnes cibles.
- Tester le certificat : https://www.ssllabs.com/ssltest/ (viser une note A).

---

## 3. En-têtes de sécurité HTTP

⚠️ **Limite GitHub Pages** : il ne permet PAS d'ajouter des en-têtes HTTP personnalisés
(CSP, HSTS, X-Frame-Options…). Le `<meta http-equiv>` couvre une partie mais pas tout.

**Recommandation forte : placer un CDN devant le site** — **Cloudflare** (gratuit) ou
**Netlify**. Les deux permettent de définir les en-têtes ci-dessous et apportent
HTTPS + protection DDoS de base.

En-têtes à configurer (via Cloudflare « Transform Rules » ou un fichier `_headers` sur Netlify) :

```
Content-Security-Policy: default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https://*.googleapis.com https://*.gstatic.com https://maps.google.com;
  frame-src https://www.google.com https://maps.google.com;
  connect-src 'self' https://formsubmit.co;
  base-uri 'self';
  form-action 'self' https://formsubmit.co;
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

> ⚠️ La CSP ci-dessus est un **point de départ** : il faut la tester page par page
> (la carte Google Maps et FormSubmit doivent rester autorisés). Auditer avec
> https://csp-evaluator.withgoogle.com/ et la console du navigateur. Le `'unsafe-inline'`
> sur `script-src` est nécessaire car le site utilise des scripts inline ; pour le
> retirer, il faudrait externaliser tout le JS et/ou passer aux nonces (chantier optionnel).

Pour un fichier `_headers` Netlify, reprendre les mêmes valeurs au format Netlify.

---

## 4. Sécurisation du formulaire de contact (`contact.html`)

Le formulaire poste en AJAX vers `https://formsubmit.co/ajax/info.stratexgroup@gmail.com`.

**Points de durcissement :**
1. **Activation** : la première soumission déclenche un email de confirmation FormSubmit
   à valider **une seule fois** (anti-usurpation). Sans ça, rien n'est délivré.
2. **Anti-spam** : actuellement `_captcha` = `false`. Pour réduire le spam :
   - Repasser le captcha FormSubmit à `true`, **ou**
   - Ajouter un champ **honeypot** : `_honey` (champ caché ; rempli = bot = ignoré).
   - Option CAPTCHA plus robuste : hCaptcha / reCAPTCHA si le spam persiste.
3. **Masquer l'email de destination** : FormSubmit propose un **alias** (`/ajax/<token>`)
   pour ne pas exposer `info.stratexgroup@gmail.com` en clair dans le code source.
   → créer l'alias depuis le tableau de bord FormSubmit et remplacer l'URL.
4. **Redirection / confirmation** : déjà gérée côté JS (message de succès, pas de fuite).
5. **Validation** : le HTML valide déjà `required`/`type=email` ; FormSubmit re-valide côté service.

Snippet honeypot à ajouter dans le `<form>` :
```html
<input type="text" name="_honey" style="display:none" tabindex="-1" autocomplete="off">
```

---

## 5. Dépendances externes (intégrité)

Le site charge quelques ressources tierces (polices Google, iframe Google Maps,
FormSubmit). À auditer :
- Vérifier que chaque `<script>`/`<link>` externe est en **HTTPS**.
- Pour les scripts CDN figés, ajouter si possible **SRI** (`integrity="sha384-…"` + `crossorigin`).
- Limiter les domaines tiers au strict nécessaire (cf. CSP ci-dessus).
- Lancer un audit **Lighthouse** (onglet « Best Practices » + « SEO ») et
  **Mozilla Observatory** (https://observatory.mozilla.org) pour une note globale.

---

## 6. Checklist de durcissement (ordre conseillé)

- [ ] Domaine connecté + **Enforce HTTPS** actif (certificat valide).
- [ ] Mettre **Cloudflare ou Netlify** devant le site pour les en-têtes HTTP.
- [ ] Déployer **CSP + HSTS + X-Content-Type-Options + Referrer-Policy + Permissions-Policy**.
- [ ] Tester la CSP page par page (carte + formulaire OK, 0 erreur console).
- [ ] Formulaire : confirmer FormSubmit, ajouter **honeypot**, envisager captcha, masquer l'email via alias.
- [ ] Audit **SSL Labs** (A), **Mozilla Observatory**, **Lighthouse**.
- [ ] Vérifier qu'aucun secret n'est commité (le dépôt n'en contient pas aujourd'hui).
- [ ] Activer **Dependabot alerts** dans Settings → Code security (par sécurité, même sans deps npm).

---

## 7. Référence projet

Voir `README.md` pour la structure des fichiers, le système de traduction FR/EN,
l'identité visuelle (variables CSS) et la carte. Contact propriétaire :
`info.stratexgroup@gmail.com`.

© STRATEX Group INTL.
