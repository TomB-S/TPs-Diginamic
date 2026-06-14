# QR Explore

Application web Node.js permettant d'explorer 11 812 questions/réponses.

## Démarrage

**Terminal 1 — serveur de données**

```bash
cd qr-data
npm start
```

**Terminal 2 — serveur principal**

```bash
cd qr-explore
node --watch src/index.js
```

Ouvrir http://localhost:8000

## Structure

TP-qrexplore/

├── qr-data/ → serveur de données (json-server, port 3001) — fourni

└── qr-explore/ → notre serveur (Node.js natif, port 8000)

├── public/

│ └── style.css

└── src/

├── index.js → démarre le serveur

├── router.js → analyse l'URL et dispatche

├── pages.js → génère le HTML

└── qr.service.js → appels fetch vers qr-data

## Routes

| URL                               | Description           | Status |
| --------------------------------- | --------------------- | ------ |
| `/`                               | Page d'accueil        | 200    |
| `/questions/list`                 | Liste paginée         | 200    |
| `/questions/list?page=2&limit=10` | Pagination            | 200    |
| `/questions/details?id=42`        | Détail d'une question | 200    |
| `/questions/details?id=abc`       | Id invalide           | 400    |
| `/questions/details?id=999999`    | Id inexistant         | 404    |
