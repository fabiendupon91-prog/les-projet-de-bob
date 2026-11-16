
const URL_BASE = "./histoires/histoires.json";

const bibliotheque = document.getElementById("bibliotheque");
const listeSeries = document.getElementById("liste-series");
const listeHistoires = document.getElementById("liste-histoires");
const pageLecture = document.getElementById("page-lecture");
const recherche = document.getElementById("recherche");
const messageErreur = document.getElementById("message-erreur");

let donnees = null;

const parametres = new URLSearchParams(window.location.search);
const idSerie = parametres.get("serie");
const idHistoire = parametres.get("id");

// Créer un élément HTML sans interpréter le texte comme du HTML
function creerElement(balise, classe, texte) {
  const element = document.createElement(balise);

  if (classe) {
    element.className = classe;
  }

  if (texte !== undefined) {
    element.textContent = texte;
  }

  return element;
}

// Afficher une erreur
function afficherErreur(message) {
  bibliotheque.hidden = true;
  pageLecture.hidden = true;
  messageErreur.hidden = false;
  messageErreur.textContent = message;
}

// Retrouver une série
function trouverSerie(id) {
  return donnees.series.find(serie => serie.id === id);
}

// Formater une date sans décalage de fuseau horaire
function formaterDate(date) {
  if (!date) return "";

  const morceaux = date.split("-");

  if (morceaux.length !== 3) return date;

  return `${morceaux[2]}/${morceaux[1]}/${morceaux[0]}`;
}

// Créer une carte de série
function creerCarteSerie(serie) {
  const carte = creerElement("article", "carte");

  const titre = creerElement("h2", "", serie.titre);
  const description = creerElement("p", "", serie.description || "");

  const nombre = donnees.histoires.filter(
    histoire => histoire.serie === serie.id
  ).length;

  const compteur = creerElement(
    "p",
    "date",
    `${nombre} histoire(s)`
  );

  const lien = document.createElement("a");
  lien.href = `./histoires.html?serie=${encodeURIComponent(serie.id)}`;
  lien.textContent = "Voir la série";

  carte.append(titre, description, compteur, lien);

  return carte;
}

// Créer une carte d'histoire
function creerCarteHistoire(histoire) {
  const carte = creerElement("article", "carte");

  const titre = creerElement("h3", "", histoire.titre);
  const resume = creerElement("p", "", histoire.resume || "");

  const date = creerElement(
    "p",
    "date",
    formaterDate(histoire.date)
  );

  const lien = document.createElement("a");
  lien.href = `./histoires.html?id=${encodeURIComponent(histoire.id)}`;
  lien.textContent = "Lire l'histoire";

  carte.append(titre, resume, date, lien);

  return carte;
}

// Afficher toutes les séries
function afficherSeries(terme = "") {
  bibliotheque.hidden = false;
  pageLecture.hidden = true;
  recherche.hidden = false;
  listeSeries.hidden = false;
  listeHistoires.hidden = true;

  listeSeries.replaceChildren();

  const rechercheTexte = terme.toLowerCase().trim();

  const seriesFiltrees = donnees.series.filter(serie => {
    const histoiresSerie = donnees.histoires.filter(
      histoire => histoire.serie === serie.id
    );

    return (
      serie.titre.toLowerCase().includes(rechercheTexte) ||
      (serie.description || "").toLowerCase().includes(rechercheTexte) ||
      histoiresSerie.some(histoire =>
        histoire.titre.toLowerCase().includes(rechercheTexte) ||
        (histoire.resume || "").toLowerCase().includes(rechercheTexte)
      )
    );
  });

  seriesFiltrees.forEach(serie => {
    listeSeries.appendChild(creerCarteSerie(serie));
  });

  if (seriesFiltrees.length === 0) {
    listeSeries.appendChild(
      creerElement("p", "message", "Aucune série trouvée.")
    );
  }
}

// Afficher les histoires d'une série
function afficherHistoiresSerie(serie) {
  bibliotheque.hidden = false;
  pageLecture.hidden = true;
  recherche.hidden = false;
  listeSeries.hidden = false;
  listeHistoires.hidden = false;

  listeSeries.replaceChildren();
  listeHistoires.replaceChildren();

  const titre = creerElement("h2", "", serie.titre);
  const description = creerElement(
    "p",
    "",
    serie.description || ""
  );

  const retour = document.createElement("a");
  retour.href = "./histoires.html";
  retour.className = "retour";
  retour.textContent = "← Toutes les séries";

  listeSeries.append(titre, description, retour);

  const histoiresSerie = donnees.histoires.filter(
    histoire => histoire.serie === serie.id
  );

  const titreEpisodes = creerElement("h2", "", "Les histoires de la série");
  listeHistoires.appendChild(titreEpisodes);

  histoiresSerie.forEach(histoire => {
    listeHistoires.appendChild(creerCarteHistoire(histoire));
  });

  if (histoiresSerie.length === 0) {
    listeHistoires.appendChild(
      creerElement("p", "message", "Cette série ne contient pas encore d'histoire.")
    );
  }
}

// Afficher une histoire complète
function afficherLecture(histoire) {
  const serie = trouverSerie(histoire.serie);

  if (!serie) {
    afficherErreur("La série de cette histoire est introuvable.");
    return;
  }

  bibliotheque.hidden = true;
  pageLecture.hidden = false;
  messageErreur.hidden = true;

  document.title = `${histoire.titre} - Les projets de Bob`;

  document.getElementById("nom-serie").textContent = serie.titre;
  document.getElementById("titre-histoire").textContent = histoire.titre;

  document.getElementById("date-histoire").textContent =
    formaterDate(histoire.date);

  document.getElementById("texte-histoire").textContent =
    histoire.contenu || "Cette histoire ne contient pas encore de texte.";

  const retour = document.getElementById("retour-serie");

  retour.href =
    `./histoires.html?serie=${encodeURIComponent(serie.id)}`;
}

// Recherche
recherche.addEventListener("input", () => {
  if (!idSerie && !idHistoire) {
    afficherSeries(recherche.value);
  } else if (idSerie && !idHistoire) {
    afficherHistoiresSerieRecherche(
      trouverSerie(idSerie),
      recherche.value
    );
  }
});

// Recherche dans une série
function afficherHistoiresSerieRecherche(serie, terme = "") {
  if (!serie) return;

  afficherHistoiresSerie(serie);

  const texte = terme.toLowerCase().trim();

  if (!texte) return;

  const cartes = Array.from(
    listeHistoires.querySelectorAll("article")
  );

  let nombreTrouve = 0;

  cartes.forEach(carte => {
    const correspond = carte.textContent.toLowerCase().includes(texte);
    carte.hidden = !correspond;

    if (correspond) nombreTrouve++;
  });

  if (nombreTrouve === 0) {
    listeHistoires.appendChild(
      creerElement("p", "message", "Aucune histoire trouvée.")
    );
  }
}

// Chargement de la base JSON
async function initialiserBibliotheque() {
  try {
    const reponse = await fetch(URL_BASE);

    if (!reponse.ok) {
      throw new Error("Le fichier JSON est introuvable.");
    }

    donnees = await reponse.json();

    if (
      !Array.isArray(donnees.series) ||
      !Array.isArray(donnees.histoires)
    ) {
      throw new Error("La structure du fichier JSON est incorrecte.");
    }

    if (idHistoire) {
      const histoire = donnees.histoires.find(
        histoire => String(histoire.id) === idHistoire
      );

      if (!histoire) {
        afficherErreur("Cette histoire n'existe pas.");
        return;
      }

      afficherLecture(histoire);
      return;
    }

    if (idSerie) {
      const serie = trouverSerie(idSerie);

      if (!serie) {
        afficherErreur("Cette série n'existe pas.");
        return;
      }

      afficherHistoiresSerie(serie);
      return;
    }

    afficherSeries();

  } catch (erreur) {
    console.error("Erreur bibliothèque :", erreur);
    afficherErreur(
      "Impossible de charger les histoires. Vérifie ton fichier JSON et réessaie."
    );
  }
}

// Lancer la bibliothèque
initialiserBibliotheque();
