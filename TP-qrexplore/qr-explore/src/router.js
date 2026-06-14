//? ROUTER dispatche les requetes HTTP
// importer 4 functions qui génèrent le HTML de chaque page
import { pageAccueil, pageListe, pageDetails, page404 } from "./pages.js";

// créer la function router
export async function router(req, res) {
  /* parser l'URL pour la découpter en morceaux exploitables
  req.url = le chemin ajouté à <> localhost = la base */
  const url = new URL(req.url, "http://localhost");
  /* pathame = chemin sans les params
  searchParams = les params après le ?  */
  const { pathname, searchParams } = url;

  // Logique pour déléguer les requetes
  if (pathname === "/") return pageAccueil(req, res); // page accueil
  if (pathname === "/questions/list") return pageListe(req, res, searchParams); // pageList
  if (pathname === "/questions/details")
    return pageDetails(req, res, searchParams); // détails d'une question
  return page404(req, res); // si aucune route trouvée
}
