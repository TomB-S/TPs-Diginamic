//? INDEX démarre le serveur HTTP
import http from "node:http"; // module pour créer un serveur web
import { readFile } from "node:fs/promises"; // lire un fichier de facon async
import { fileURLToPath } from "node:url"; // construire le chemin absolu
import { dirname, join } from "node:path"; // construire le chemin absolu
import { router } from "./router.js"; // import de ma function pour décider quelle page à afficher

/* construit __dirname (dossier) depuis import.meta.url (URL du fichier)
fileURLToPath pour concertur le chemin en disque (/./.) */
const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 8000;

// créer le serveur en lui passant une function appelée à chaque requete
const serveur = http.createServer(async (req, res) => {
  console.log(`Requête reçue : ${req.method} ${req.url}`);

  // Cas spécial : requete direct pour le style (fichier statique)
  if (req.url === "/style.css") {
    const css = await readFile(join(__dirname, "../public/style.css"), "utf-8");
    res.writeHead(200, { "Content-Type": "text/css; charset=utf-8" });
    return res.end(css);
  }

  // toutes les autres requetes sont délégués au router
  await router(req, res);
});

// démarrer le serveur
serveur.listen(PORT, () => {
  console.log(`✅ Serveur démarré : http://localhost:${PORT}`);
});
