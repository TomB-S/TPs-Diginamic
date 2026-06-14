# qr-data — le serveur de données (fourni tout prêt)

## C'est quoi ?

C'est un **serveur de données** : il stocke 11 812 questions/réponses dans le fichier
`db.json` et les distribue en JSON à qui les demande par HTTP.

Il utilise **json-server**, un outil tout fait qui transforme un fichier JSON en API.
On vous le donne prêt à l'emploi parce que **ce n'est pas lui qu'on apprend à
construire aujourd'hui** : aujourd'hui, on construit le serveur qui le **consomme**
(QR Explore). C'est une situation très réaliste : dans la vraie vie, votre
application parle presque toujours à une API que quelqu'un d'autre a écrite.

```
┌──────────────────┐         fetch          ┌──────────────────┐
│    QR Explore     │ ─────────────────────► │     qr-data      │
│  (vous le codez)  │ ◄───────────────────── │  (fourni, port   │
│    port 8000      │          JSON          │      3001)       │
└──────────────────┘                        └──────────────────┘
```

## Démarrage (déjà testé la veille — cf. PREPARATION-VEILLE.md)

```bash
cd qr-data
npm start        # démarre le serveur sur le port 3001
```

Le dossier est livré avec `node_modules` inclus : pas de `npm install` nécessaire.

**Laissez ce terminal ouvert toute la journée.** Si votre application affiche
`fetch failed` ou `ECONNREFUSED`, c'est que ce serveur ne tourne plus :
revenez ici et relancez `npm start`.

## 🛟 Plan B : le serveur de secours (zéro installation)

Si `npm start` refuse de fonctionner chez vous (antivirus, npm cassé…), pas de
panique — lancez à la place :

```bash
node serveur-secours.mjs
```

C'est un mini-serveur **sans aucune dépendance** qui sert exactement les mêmes
données, aux mêmes adresses, sur le même port. Pour le cours, c'est strictement
équivalent : personne ne verra la différence, pas même votre code.

## À explorer dans votre navigateur (avant de coder !)

| URL | Ce que vous verrez |
|---|---|
| `http://localhost:3001/questions-reponses/1` | **Une** question (objet JSON) |
| `http://localhost:3001/questions-reponses/9999999` | Erreur 404 (id inexistant) |
| `http://localhost:3001/questions-reponses?_page=1&_per_page=5` | La page 1, 5 questions à la fois |

## ⚠️ La forme de la réponse paginée (important pour l'étape 5 !)

Quand on demande une page (`?_page=1&_per_page=5`), json-server ne renvoie **pas**
directement un tableau : il renvoie un **objet** qui contient le tableau dans sa
propriété `data` :

```json
{
  "first": 1, "prev": null, "next": 2, "last": 2363,
  "pages": 2363, "items": 11812,
  "data": [ { "id": 1, "question": "...", "reponse": "..." }, ... ]
}
```

→ Dans votre code, les questions seront donc dans `resultat.data`, pas dans `resultat`.

## Règles

- **Ne modifiez pas `db.json`** (c'est la base de tout le monde pour le rendu).
- Ne codez rien dans ce dossier : votre travail se passe dans `qr-explore`.
