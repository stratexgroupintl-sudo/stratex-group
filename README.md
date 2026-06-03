# STRATEX Group INTL — Site web

Site vitrine multi-pages du groupe STRATEX (Cotonou, Bénin). HTML/CSS/JS statique, sans framework ni build — il s'ouvre directement dans un navigateur et s'héberge sur n'importe quel hébergeur statique.

## Mise en ligne rapide

Aucune compilation nécessaire. Déposez le contenu du dépôt sur un hébergeur statique :

- **Netlify / Vercel** : glisser-déposer le dossier, ou connecter ce dépôt GitHub (déploiement automatique à chaque commit).
- **GitHub Pages** : Settings → Pages → Source = branche `main`, dossier `/root`.

Page d'entrée : `index.html`.

## Structure du projet

```
index.html              Accueil
le-groupe.html          Le Groupe (vision, positionnement, ancrage Cotonou)
nos-poles.html          Présentation des 3 pôles
academy.html            STRATEX Academy
contact.html            Contact + formulaire + carte Google Maps
filiales/               Une page par filiale (pharma, médical, finance,
                        immobilier, bureautique, service, academy)

assets/
  styles.css            Toute la mise en forme (design tokens en :root)
  site.js               JS partagé : géométrie hexagonale, composition héro,
                        icônes, motifs décoratifs, helpers
  i18n.js               Dictionnaire de traduction FR / EN
  img/                  Images (siège, Cotonou, etc.)

Apercu mobile.html                    Aperçu du site dans un cadre mobile (interne)
STRATEX Accueil (hors-ligne).html     Version autonome hors-ligne de l'accueil
```

## Points techniques à connaître pour la reprise

### Internationalisation (FR / EN)
Les textes traduisibles portent un attribut `data-i18n="clé"`. Les traductions
vivent dans `assets/i18n.js` (et dans des dictionnaires locaux en bas de
certaines pages). Le sélecteur de langue applique la langue et la mémorise.
Pour ajouter un texte traduisible : ajouter `data-i18n="ma.cle"` sur l'élément
puis la clé dans le dictionnaire.

### Identité visuelle
Couleurs, polices et rayons sont des variables CSS définies dans `:root`
(`assets/styles.css`). Le motif en nid d'abeille (hexagones) et la composition
de la page d'accueil sont générés en JS dans `assets/site.js`
(`heroComposition()`, `flatHex()`, `honeycomb()`).

### Formulaire de contact (`contact.html`)
Les demandes sont envoyées via **FormSubmit** (service gratuit, sans clé API)
vers `info.stratexgroup@gmail.com`, en AJAX — le visiteur reste sur la page.

> ⚠️ **Activation unique** : à la toute première demande envoyée, FormSubmit
> envoie un email de confirmation à l'adresse de destination. Il faut cliquer
> le lien de confirmation **une fois** pour activer la réception. Pour changer
> l'adresse de destination, modifier l'URL `formsubmit.co/ajax/<email>` dans le
> script en bas de `contact.html`.

### Carte (`contact.html`)
Carte Google Maps intégrée (iframe) centrée sur le siège STRATEX
(6.3813125, 2.4951875). Le bouton « Itinéraire » ouvre la navigation Google Maps.

## Licence / propriété
© STRATEX Group INTL. Tous droits réservés.
