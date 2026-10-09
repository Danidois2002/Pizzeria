# Daniel's Pizzeria

Site vitrine d'une pizzeria artisanale à Liège : une seule page, 100 % statique, compatible GitHub Pages.

## Lancer le projet

Aucune installation : ouvrez `index.html` dans le navigateur (ou via WAMP : `http://localhost/pizzeria/`).

## Structure

- `index.html` : la page (hero, histoire, savoir-faire, carte, réservation, infos)
- `styles.css` : la direction artistique (palette crème / tomate / or, typo Fraunces + Manrope)
- `script.js` : la carte (données `MENU`), la réservation, le statut « ouvert maintenant », la vidéo
- `assets/img/` : les images (WebP), la vidéo de présentation (MP4 720p) et le logo
- `assets/img/menu/` : les photos détourées des plats, numérotées de 1 à 20

## Modifier la carte

Tout se passe dans le tableau `MENU` en haut de `script.js` :

```js
{ cat: 'pizza', name: 'Margherita', desc: 'Tomate, mozzarella, basilic', price: 12.99, img: 3, badge: 'veggie' },
```

- `cat` : `pizza`, `salade`, `dessert` ou `boisson`
- `img` : numéro de l'image dans `assets/img/menu/`
- `badge` (facultatif) : `signature` ou `veggie`

Pour une nouvelle photo (PNG détouré), convertissez-la en WebP, par exemple avec ffmpeg :

```bash
ffmpeg -i ma-pizza.png -vf "scale='min(560,iw)':-1" -c:v libwebp -quality 82 assets/img/menu/21.webp
```

## Fonctionnalités

- Statut **ouvert / fermé** en direct (heure de Bruxelles), jour actuel mis en évidence dans les horaires
- Carte par catégories, avec aperçu du plat au survol
- Réservation : nombre de convives, date, créneaux (les heures passées sont désactivées), résumé en direct ; la demande s'ouvre dans l'application e-mail (`mailto:`)
- Vidéo de présentation dans une fenêtre (`<dialog>`)
- Accessible au clavier, respecte « réduire les animations »

## Cache

Après une modification de `styles.css` ou `script.js`, augmentez le numéro `?v=` dans `index.html` pour que les navigateurs rechargent les fichiers.
