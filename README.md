# 🍲 Nos recettes

Application familiale de recettes de cuisine : liste des recettes avec photos, impression, menu de la semaine et liste de courses automatique.
Elle fonctionne sur ordinateur et sur téléphone, sans rien installer.

## Ce que fait l'application

| Onglet | À quoi il sert |
|---|---|
| 📖 **Recettes** | Toutes les recettes avec photo. Recherche par nom ou ingrédient, tri par catégorie. Sur une recette : changer le nombre de personnes (les quantités suivent), **Imprimer**, **Mettre au menu**. |
| 📅 **Menu de la semaine** | Du samedi midi au vendredi soir (on fait les courses le samedi matin). On touche une case et on choisit un plat. |
| 🛒 **Liste de courses** | Calculée toute seule à partir du menu : quantités additionnées, arrondies au-dessus, classées par rayon. On coche dans le magasin, on peut ajouter des articles, l'imprimer ou l'envoyer sur un téléphone. |

Ajouter, modifier et supprimer des recettes se fait **uniquement depuis l'ordinateur réglé avec le jeton GitHub** : sur les autres appareils, ces boutons n'apparaissent pas.

## Mise en route (une seule fois)

1. **Créer le dépôt** `recettes` sur GitHub (public) et y mettre ces fichiers.
2. **Activer le site** : dépôt → *Settings* → *Pages* → *Source : Deploy from a branch* → branche `main`, dossier `/ (root)` → *Save*.
   Une ou deux minutes plus tard, le site est à l'adresse :
   `https://xavierlepallabre-cmyk.github.io/recettes/`
3. **Créer un jeton d'accès** (pour pouvoir ajouter des recettes depuis le site) :
   GitHub → photo de profil → *Settings* → *Developer settings* → *Personal access tokens* → *Fine-grained tokens* → *Generate new token*
   - *Repository access* : **Only select repositories** → `recettes`
   - *Permissions* → *Contents* : **Read and write**
   - Durée : au choix (1 an par exemple)
4. Sur l'ordinateur, ouvrir le site → **⚙ Réglages** en bas de page → coller le jeton → *Enregistrer et tester*.
   Le bouton **➕ Ajouter une recette** apparaît.

## Sur le téléphone

Ouvrir l'adresse du site, puis l'ajouter à l'écran d'accueil :
- **iPhone** (Safari) : bouton Partager → *Sur l'écran d'accueil*
- **Android** (Chrome) : menu ⋮ → *Ajouter à l'écran d'accueil*

L'application s'ouvre alors comme une vraie application, avec son icône.

## Bon à savoir

- Une recette ajoutée apparaît tout de suite sur l'ordinateur, et sur les téléphones **1 à 2 minutes plus tard** (le temps que GitHub publie le site).
- Le menu de la semaine fait sur l'ordinateur réglé est envoyé en ligne et visible sur les téléphones. Un menu modifié sur un téléphone reste sur ce téléphone.
- Les cases cochées de la liste de courses restent sur l'appareil où on les coche.
- Les photos sont réduites automatiquement (1200 px) avant l'envoi.
- Le dépôt étant public, recettes et photos sont visibles par toute personne qui a le lien.
- Les trois recettes fournies (quiche, soupe, gâteau) sont des exemples : supprimez-les quand vous voulez.

## Organisation des fichiers

```
index.html            page unique de l'application
style.css             apparence (écran, téléphone, impression)
app.js                fonctionnement
data/recettes.json    les recettes
data/planning.json    le menu de la semaine
photos/               les photos des recettes
manifest.webmanifest  + icônes : installation sur téléphone
```

Aucune dépendance, aucune compilation : ce sont des fichiers web simples.
