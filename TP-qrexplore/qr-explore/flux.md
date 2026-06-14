## FLUX COMPLET

<Navigateur>
↓ 1. requête HTTP GET (/questions/list)
<index.js>
↓ 2. appelle router(req, res)
<router.js>
↓ 3. analyse pathname, appelle pageListe(req, res, searchParams)
<pages.js>
↓ 4. appelle listerQuestions(page, limit)
<qr.service.js>
↓ 5. fetch("http://localhost:3001/questions-reponses?\_page=1&\_per_page=100")
<qr-data (json-server)>
↓ 6. répond → JSON (texte brut) : '{"data": [...]}'
<qr.service.js>
↓ 7. .json() convertit JSON → objet JS : { id: 1, question: "...", reponse: "..." }
<pages.js>
↓ 8. injecte objet JS dans le template → string HTML : "<tr><td>1</td>..."
<index.js / res.end()>
↓ 9. envoie la string HTML au navigateur
<Navigateur>
↓ 10. reçoit HTML, fait une 2e requête pour /style.css, affiche la page
