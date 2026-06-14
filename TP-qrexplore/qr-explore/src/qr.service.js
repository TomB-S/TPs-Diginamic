//? QR parle à l'API
/* URL de base de qr-data tourne séparément (npm start)
le mettre dans variable pour ne pas le répéter + facile à modifier si changement de port
*/
const QR_DATA_URL = "http://localhost:3001";

//? Récupérer une liste paginée depuis qr-data
/* page = n° page <> limit = nb questions par page
valeurs pas défault s'affichent si appel de la function sans arguments  
*/
export async function listerQuestions(page = 1, limit = 100) {
  // fecth() envoie requete http GET vers qr-data + await pour attendre réponse avant de continuer
  const reponse = await fetch(
    `${QR_DATA_URL}/questions-reponses?_page=${page}&_per_page=${limit}`,
  );
  // conditions avec lancement erreur
  if (!reponse.ok) throw new Error(`qr-data a répondu ${reponse.status}`);
  // .json() lit le corps de la réponse et le convertit en objet JS
  const resultat = await reponse.json();
  // retourne le tableau de questions
  return resultat.data;
}

//? Obtenir la question par don ID
// retourne l'objet question su id est trouvé
export async function obtenirQuestion(id) {
  // appel de qr-data avec l id dans l'url
  const reponse = await fetch(`${QR_DATA_URL}/questions-reponses/${id}`);
  // condition si erreur 404
  if (reponse.status === 404) return null;
  // condition pour gestion des autres erreurs
  if (!reponse.ok) throw new Error(`qr-data a répondu ${reponse.status}`);
  // on retourne la promise
  return reponse.json();
}
