# qr-explore

Serveur HTTP Node.js natif (sans framework) — port 8000.
Consomme l'API qr-data (port 3001) pour afficher des questions/réponses.

## Démarrage

```bash
node src/index.js          # normal
node --watch src/index.js  # avec rechargement automatique
```

> qr-data doit tourner séparément sur le port 3001.

## Modules

| Fichier         | Rôle                                         |
| --------------- | -------------------------------------------- |
| `index.js`      | Crée le serveur, sert le CSS statique        |
| `router.js`     | Analyse le pathname, appelle la bonne page   |
| `pages.js`      | Génère le HTML (accueil, liste, détail, 404) |
| `qr.service.js` | fetch vers qr-data, retourne des objets JS   |
