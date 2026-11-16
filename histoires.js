
async function chargerHistoires() {
    const liste = document.getElementById("liste-histoires");

    try {
        const reponse = await fetch("data/histoires.json");

        if (!reponse.ok) {
            throw new Error("Impossible de charger les histoires.");
        }

        const donnees = await reponse.json();
        const histoires = donnees.histoires;

        liste.innerHTML = "";

        if (!Array.isArray(histoires) || histoires.length === 0) {
            liste.textContent = "Aucune histoire pour le moment. Revenez bientôt !";
            return;
        }

        histoires.forEach(histoire => {
            const carte = document.createElement("article");
            carte.className = "card";

            const titre = document.createElement("h2");
            titre.textContent = histoire.titre;

            const description = document.createElement("p");
            description.textContent = histoire.description || "";

            carte.appendChild(titre);
            carte.appendChild(description);

            if (Array.isArray(histoire.chapitres)) {
                histoire.chapitres.forEach(chapitre => {
                    const titreChapitre = document.createElement("h3");
                    titreChapitre.textContent = chapitre.titre;

                    const contenu = document.createElement("p");
                    contenu.textContent = chapitre.contenu;

                    carte.appendChild(titreChapitre);
                    carte.appendChild(contenu);
                });
            }

            liste.appendChild(carte);
        });

    } catch (erreur) {
        console.error(erreur);
        liste.textContent = "Une erreur est survenue lors du chargement.";
    }
}

chargerHistoires();
