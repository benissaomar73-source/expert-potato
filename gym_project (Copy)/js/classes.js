// ============================================================
// FICHIER : js/classes.js
// PAGE    : classes.html
// FEATURE : Filtrage et tri des cours
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    // -------------------------------------------------------
    // DONNÉES : tableau de tous les cours
    // (En partie 4, ces données viendront de la base de données)
    // -------------------------------------------------------
    const tousLesCours = [
        { nom: "Zumba",               coach: "Sarah Benmoussa",  jour: "Lundi",    heure: "09:00", duree: 60, niveau: "Débutant" },
        { nom: "Boxe Fitness",        coach: "Karim Hadjadj",    jour: "Lundi",    heure: "18:00", duree: 60, niveau: "Intermédiaire" },
        { nom: "Musculation avancée", coach: "Yacine Djellouli", jour: "Mardi",    heure: "10:00", duree: 90, niveau: "Avancé" },
        { nom: "Yoga Matinal",        coach: "Amira Tebbal",     jour: "Mardi",    heure: "07:30", duree: 45, niveau: "Débutant" },
        { nom: "CrossFit",            coach: "Karim Hadjadj",    jour: "Mercredi", heure: "17:00", duree: 60, niveau: "Avancé" },
        { nom: "Pilates",             coach: "Amira Tebbal",     jour: "Jeudi",    heure: "10:00", duree: 60, niveau: "Intermédiaire" },
        { nom: "Natation",            coach: "Sofiane Bouzid",   jour: "Jeudi",    heure: "08:00", duree: 45, niveau: "Débutant" },
        { nom: "HIIT Intensif",       coach: "Yacine Djellouli", jour: "Vendredi", heure: "19:00", duree: 45, niveau: "Avancé" },
        { nom: "Stretching & Récup",  coach: "Sarah Benmoussa",  jour: "Samedi",   heure: "11:00", duree: 30, niveau: "Débutant" },
        { nom: "Spinning",            coach: "Sofiane Bouzid",   jour: "Samedi",   heure: "09:00", duree: 60, niveau: "Intermédiaire" },
    ];

    // -------------------------------------------------------
    // ON RÉCUPÈRE LES ÉLÉMENTS DE FILTRE ET LE TABLEAU
    // -------------------------------------------------------
    const filtreCoach   = document.getElementById("filtre-coach");
    const filtreJour    = document.getElementById("filtre-jour");
    const filtreNiveau  = document.getElementById("filtre-niveau");
    const corpsTableau  = document.getElementById("corps-tableau");

    // Variable pour savoir par quelle colonne on trie
    let colonneTri    = "";    // nom de la colonne active
    let sensTriCroissant = true; // true = croissant, false = décroissant

    // -------------------------------------------------------
    // FONCTION : Afficher les cours dans le tableau
    // On lui passe un tableau de cours à afficher
    // -------------------------------------------------------
    const afficherCours = listeCours => {

        // On vide le tableau d'abord
        corpsTableau.innerHTML = "";

        // Si aucun cours trouvé
        if (listeCours.length === 0) {
            corpsTableau.innerHTML = '<tr><td colspan="7" class="table-empty-msg">Aucun cours trouvé.</td></tr>';
            return;
        }

        // Pour chaque cours, on crée une ligne dans le tableau
        listeCours.forEach(cours => {

            // On choisit la couleur du badge selon le niveau
            let classeBadge = "";
            if (cours.niveau === "Débutant")       classeBadge = "badge-debutant";
            if (cours.niveau === "Intermédiaire")  classeBadge = "badge-intermediaire";
            if (cours.niveau === "Avancé")         classeBadge = "badge-avance";

            // On crée la ligne HTML
            const ligne = `
                <tr>
                    <td>${cours.nom}</td>
                    <td>${cours.coach}</td>
                    <td>${cours.jour}</td>
                    <td>${cours.heure}</td>
                    <td>${cours.duree} min</td>
                    <td><span class="badge ${classeBadge}">${cours.niveau}</span></td>
                    <td><a href="#">Voir détails</a></td>
                </tr>`;

            corpsTableau.innerHTML += ligne;
        });
    }

    // -------------------------------------------------------
    // FONCTION : Filtrer et afficher
    // Elle lit les filtres choisis et filtre le tableau
    // -------------------------------------------------------
    const filtrerEtAfficher = () => {

        const coachChoisi  = filtreCoach.value;   // ex: "Karim Hadjadj" ou ""
        const jourChoisi   = filtreJour.value;    // ex: "Lundi" ou ""
        const niveauChoisi = filtreNiveau.value;  // ex: "Débutant" ou ""

        // On filtre le tableau de cours
        let coursFiltres = tousLesCours.filter(cours => {

            // On vérifie chaque filtre (si filtre vide = on accepte tout)
            const okCoach  = (coachChoisi === ""  || cours.coach  === coachChoisi);
            const okJour   = (jourChoisi  === ""  || cours.jour   === jourChoisi);
            const okNiveau = (niveauChoisi === "" || cours.niveau === niveauChoisi);

            // On garde le cours seulement si les 3 conditions sont vraies
            return okCoach && okJour && okNiveau;
        });

        // Si un tri est actif, on trie aussi
        if (colonneTri !== "") {
            coursFiltres = trierCours(coursFiltres);
        }

        // On affiche les résultats
        afficherCours(coursFiltres);
    }

    // -------------------------------------------------------
    // FONCTION : Trier les cours selon une colonne
    // -------------------------------------------------------
    const trierCours = liste => {
        return liste.sort((a, b) => {
            const valeurA = a[colonneTri];
            const valeurB = b[colonneTri];

            // Comparaison (fonctionne pour texte et nombres)
            if (valeurA < valeurB) return sensTriCroissant ? -1 : 1;
            if (valeurA > valeurB) return sensTriCroissant ? 1 : -1;
            return 0;
        });
    }

    // -------------------------------------------------------
    // ÉCOUTER LES CHANGEMENTS DE FILTRES
    // -------------------------------------------------------
    filtreCoach.addEventListener("change",  filtrerEtAfficher);
    filtreJour.addEventListener("change",   filtrerEtAfficher);
    filtreNiveau.addEventListener("change", filtrerEtAfficher);

    // -------------------------------------------------------
    // TRI PAR CLIC SUR LES EN-TÊTES DU TABLEAU
    // -------------------------------------------------------
    const enTetes = document.querySelectorAll("th[data-colonne]");

    enTetes.forEach(th => {
        th.classList.add("cursor-pointer"); // curseur main au survol

        th.addEventListener("click", () => {
            const colonneCliquee = th.getAttribute("data-colonne");

            // Si on reclique sur la même colonne → on inverse le sens
            if (colonneTri === colonneCliquee) {
                sensTriCroissant = !sensTriCroissant;
            } else {
                colonneTri = colonneCliquee;
                sensTriCroissant = true;
            }

            // On met à jour l'icône de tri sur toutes les colonnes
            enTetes.forEach(autreHeader => {
                autreHeader.textContent = autreHeader.textContent.replace(" ▲", "").replace(" ▼", "");
            });
            th.textContent += sensTriCroissant ? " ▲" : " ▼";

            // On réaffiche avec le tri
            filtrerEtAfficher();
        });
    });

    // -------------------------------------------------------
    // AFFICHAGE INITIAL (tous les cours, sans filtre)
    // -------------------------------------------------------
    afficherCours(tousLesCours);

});
