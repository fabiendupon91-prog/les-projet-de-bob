
from flask import Flask, render_template, request, redirect, url_for
import sqlite3
from pathlib import Path

app = Flask(__name__)

# Emplacement de la base de données
BASE_DIR = Path(__file__).resolve().parent
DATABASE = BASE_DIR / "database.db"


# Connexion à la base de données
def connecter_db():
    connexion = sqlite3.connect(DATABASE)
    connexion.row_factory = sqlite3.Row
    return connexion


# Page d'accueil
@app.route("/", methods=["GET", "POST"])
def accueil():

    if request.method == "POST":

        titre = request.form["titre"]
        auteur = request.form["auteur"]
        partie = request.form["partie"]
        chapitre = request.form["chapitre"]
        categorie = request.form["categorie"]
        resume = request.form["resume"]
        contenu = request.form["contenu"]

        connexion = connecter_db()

        connexion.execute("""
            INSERT INTO histoires
            (titre, auteur, categorie, partie, chapitre, resume, contenu)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (titre, auteur, categorie, partie, chapitre, resume, contenu))

        connexion.commit()
        connexion.close()

        return redirect(url_for("accueil"))

    connexion = connecter_db()

    histoires = connexion.execute("""
        SELECT * FROM histoires
        ORDER BY id DESC
    """).fetchall()

    connexion.close()

    return render_template("histoires.html", histoires=histoires)


if __name__ == "__main__":
    app.run(debug=True)
