//? PAGES construit le HTML
// importer les 2 functions qui font les appels vers qr-data
import { listerQuestions, obtenirQuestion } from "./qr.service.js";

//? Function utitaire : partagée par toutes les pages
// res = objet réponses HTTP <> tml = contenu à envoyer <> code = status HTTP
export function envoyer(res, html, code = 200) {
  // envoie les en-tetes HTTP au nav (code + contenu)
  res.writeHead(code, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html); // envoie le corps de la réponse + ferme connexion
}
//? Function template HTML partagée par toutes les pages
// titre = onglet du nav <> corps = contenu
export function layout(titre, corps) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${titre} — QR Explore</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <h1>QR Explore</h1>
  <p class="sous-titre">Exploration des questions / réponses</p>
  ${corps}
</body>
</html>`;
}

//? ------ PAGE ACCUEIL ------
// Function page d'accueil (HTML statique, no api)
export function pageAccueil(req, res) {
  // contenu de la page
  const corps = `
    <p>Bienvenue ! Cette application permet d'explorer des questions/réponses.</p>
    <a class="btn" href="/questions/list">Voir les questions</a>`;
  // envoie entete + page avec layout commun + corps du block
  envoyer(res, layout("Accueil", corps));
}

//? Function pageList
// qui récup les questions depuis qr-data et génére HTML
// params = searchparams qui contient ?page= et ?limit=
export async function pageListe(req, res, params) {
  /* params.get = lit le param page dans l'url + renvoie 1 par défault
  parseInt pour convertir en string
  math.max pour empecher valeurs 0 ou négatives 
  */
  const page = Math.max(1, parseInt(params.get("page") ?? "1"));
  // same logic mais avec la limut du nb de questions par page
  const limit = Math.max(1, parseInt(params.get("limit") ?? "100"));
  try {
    // appel vers qr-data via qr.service function, réponse sous forme tableau objet
    const questions = await listerQuestions(page, limit);

    // transfomer chaque question en ligne HTML
    const lignes = questions
      // mapper sur chaque questions dans la tableau
      .map(
        // créer lien vers la page detail avec un id en param
        (q) => `
      <tr>
        <td>${q.id}</td>
        <td><a href="/questions/details?id=${q.id}">${q.question}</a></td>
      </tr>`,
      )
      .join(""); // coller toutes les lignes ensemble en 1 string

    // Button précédent (ne s'applique pas à la page 1)
    const precedent =
      page > 1
        ? // -1 : url recalcule page -1 en gardant la limit
          `<a class="btn-view" href="/questions/list?page=${page - 1}&limit=${limit}">← Précédent</a> `
        : "";
    // Button suivant (s'affiche seulement si la page est pleine)
    const suivant =
      questions.length === limit
        ? `<a class="btn-view" href="/questions/list?page=${page + 1}&limit=${limit}">Suivant →</a>`
        : "";

    /* Ccontenu de la page 
  Condition afficher message si ligne + div pour afficher buttons
  */
    const corps = `
    <h2>Liste des questions</h2>
    <p>Page ${page} — ${questions.length} question(s) affichée(s)</p>
    <table>
      <thead><tr><th>Id</th><th>Question</th></tr></thead>
      <tbody>${lignes || '<tr><td colspan="2">Aucune question sur cette page. Status: ${}</td></tr>'}</tbody>
    </table>
    <div class="pagination">${precedent}${suivant}</div>`;
    // envoie entete + page avec layout commun + corps du block
    envoyer(res, layout("Liste des questions", corps));
  } catch (err) {
    // Si qr-data est coupé ou plante, on attrape l'erreur ici
    // On affiche une page 500 propre au lieu de crasher le serveur
    console.error("Erreur dans pageListe :", err.message);

    const corps = `
      <div class="erreur">
        <strong>500 — Erreur interne du serveur</strong>
        <p>Impossible de contacter le serveur de données.</p>
        <p>Vérifiez que qr-data tourne bien sur le port 3001.</p>
      </div>
      <a class="btn" href="/">Retour à l'accueil</a>`;

    envoyer(res, layout("Erreur serveur", corps), 500);
  }
}

//? ------ PAGE DETAIL ------
/* affiche une question complète avec sa réponse
params = searchparams qui contient ?id=
*/
export async function pageDetails(req, res, params) {
  // lire id depuis url
  const id = params.get("id");

  // validation avant appel de l'api si id absent ou nb invalide
  if (!id || isNaN(parseInt(id))) {
    const corps = `
      <div class="erreur">Paramètre <code>id</code> manquant ou invalide.</div>
      <a class="btn" href="/questions/list">Retour à la liste</a>`;
    return envoyer(res, layout("Erreur", corps), 400);
  }

  try {
    // convertir id string en number pour l'envoyer à l'API
    const question = await obtenirQuestion(parseInt(id));
    // retourne erreur si qr-data répond 404
    if (!question) {
      const corps = `
      <div class="erreur">Aucune question n'a l'id <code>${id}</code>.</div>
      <a class="btn" href="/questions/list">Retour à la liste</a>`;
      return envoyer(res, layout("Introuvable", corps), 404);
    }
    // lorsque tout s'est bien passé, on affiche question + réponse
    const corps = `
    <h2>Question n°${question.id}</h2>
    <p>${question.question}</p>
    <div class="reponse">
      <strong>Réponse</strong>
      <p>${question.reponse}</p>
    </div>
    <a class="btn" href="/questions/list">Retour à la liste</a>`;
    envoyer(res, layout(`Question n°${question.id}`, corps));
  } catch (err) {
    console.error("Erreur dans pageDetails :", err.message);

    const corps = `
      <div class="erreur">
        <strong>500 — Erreur interne du serveur</strong>
        <p>Impossible de contacter le serveur de données.</p>
        <p>Vérifiez que qr-data tourne bien sur le port 3001.</p>
      </div>
      <a class="btn" href="/">Retour à l'accueil</a>`;

    envoyer(res, layout("Erreur serveur", corps), 500);
  }
}

//? ----- PAGE 404 -----
// afficher req.url dans le message pour comprendre l"erreur
export function page404(req, res) {
  const corps = `
    <div class="erreur">
      <strong>404 — Page non trouvée</strong>
      <p>L'adresse <code>${req.url}</code> n'existe pas dans cette application.</p>
    </div>
    <a class="btn" href="/">Retour à l'accueil</a>`;
  envoyer(res, layout("Page non trouvée", corps), 404);
}
