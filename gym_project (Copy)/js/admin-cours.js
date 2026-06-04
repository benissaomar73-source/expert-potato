// ============================================================
// FICHIER : js/admin-cours.js
// PAGE    : admin-plans.html (section cours)
// FEATURE : Gestion des cours admin (CRUD + localStorage)
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    // -------------------------------------------------------
    // COURS PAR DÉFAUT (pré-chargés si localStorage vide)
    // -------------------------------------------------------
    const coursParDefaut = [
        { id: 1, nom: "Zumba",               coach: "Sarah Benmoussa",  jour: "Lundi",    heure: "09:00", duree: 60, niveau: "Débutant",      capacite: 20 },
        { id: 2, nom: "Boxe Fitness",         coach: "Karim Hadjadj",   jour: "Lundi",    heure: "18:00", duree: 60, niveau: "Intermédiaire",  capacite: 15 },
        { id: 3, nom: "Musculation avancée",  coach: "Yacine Djellouli",jour: "Mardi",    heure: "10:00", duree: 90, niveau: "Avancé",         capacite: 12 },
        { id: 4, nom: "Yoga Matinal",         coach: "Amira Tebbal",    jour: "Mardi",    heure: "07:30", duree: 45, niveau: "Débutant",       capacite: 18 },
        { id: 5, nom: "CrossFit",             coach: "Karim Hadjadj",   jour: "Mercredi", heure: "17:00", duree: 60, niveau: "Avancé",         capacite: 10 },
    ];

    if (!localStorage.getItem("cours-admin")) {
        localStorage.setItem("cours-admin", JSON.stringify(coursParDefaut));
    }

    // -------------------------------------------------------
    // FONCTIONS UTILITAIRES
    // -------------------------------------------------------
    const lireCours = () => JSON.parse(localStorage.getItem("cours-admin")) || [];

    const sauvegarderCours = (liste) => {
        localStorage.setItem("cours-admin", JSON.stringify(liste));
    };

    // -------------------------------------------------------
    // ÉLÉMENTS HTML
    // -------------------------------------------------------
    const gridCours = document.getElementById("grid-cours-admin");
    const formulaire   = document.getElementById("form-ajouter-cours");

    // -------------------------------------------------------
    // FONCTION : Afficher les cours dans la grille
    // -------------------------------------------------------
    const afficherCours = () => {
        const liste = lireCours();
        if(!gridCours) return;
        
        gridCours.innerHTML = "";

        if (liste.length === 0) {
            gridCours.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">Aucun cours enregistré.</div>';
            return;
        }

        liste.forEach((cours) => {
            let niveauCouleur = "var(--success)";
            if(cours.niveau === "Intermédiaire") niveauCouleur = "var(--warning)";
            if(cours.niveau === "Avancé") niveauCouleur = "var(--danger)";

            let carte = `
                <div class="card stat-card" style="border-top-color: ${niveauCouleur}; position: relative; padding-bottom: 5rem;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 1rem;">
                        <h3 style="font-size: 1.5rem; margin:0;">${cours.nom}</h3>
                        <span class="badge" style="background-color: ${niveauCouleur}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem;">${cours.niveau}</span>
                    </div>
                    
                    <p style="margin-bottom: 0.5rem; color: var(--text);"><strong style="color:var(--primary); font-family: 'Oswald', sans-serif;">COACH:</strong> ${cours.coach}</p>
                    <p style="margin-bottom: 0.5rem; color: var(--text);"><strong style="color:var(--primary); font-family: 'Oswald', sans-serif;">QUAND:</strong> ${cours.jour} à ${cours.heure}</p>
                    <p style="margin-bottom: 0.5rem; color: var(--text);"><strong style="color:var(--primary); font-family: 'Oswald', sans-serif;">DURÉE:</strong> ${cours.duree} min</p>
                    <p style="margin-bottom: 1rem; color: var(--text);"><strong style="color:var(--primary); font-family: 'Oswald', sans-serif;">CAPACITÉ:</strong> ${cours.capacite} pers.</p>
                    
                    <div style="position: absolute; bottom: 1.5rem; left: 1.5rem; right: 1.5rem; display: flex; gap: 0.5rem; justify-content: center;">
                        <button class="btn-edit" onclick="modifierCours(${cours.id})" title="Modifier">✏️</button>
                        <button class="btn-delete" style="margin: 0;" onclick="supprimerCours(${cours.id})" title="Supprimer">🗑️</button>
                    </div>
                </div>
            `;
            gridCours.innerHTML += carte;
        });
    };

    // -------------------------------------------------------
    // SUPPRIMER UN COURS
    // -------------------------------------------------------
    window.supprimerCours = (id) => {
        const ok = confirm("Supprimer ce cours ?");
        if (ok) {
            const liste     = lireCours();
            const nouvelle  = liste.filter((c) => c.id !== id);
            sauvegarderCours(nouvelle);
            afficherCours();
            
            // Notifier le script de stats s'il existe
            if (window.mettreAJourStats) window.mettreAJourStats();
        }
    };

    // -------------------------------------------------------
    // MODIFIER UN COURS (Via Modal)
    // -------------------------------------------------------
    const modalEditCours  = document.getElementById("modal-modifier-cours");
    const formEditCours   = document.getElementById("form-modifier-cours");
    const btnFermerCours  = document.getElementById("fermer-modal-cours");
    const btnAnnulerCours = document.getElementById("btn-annuler-edit-cours");

    window.modifierCours = (id) => {
        const liste = lireCours();
        const cours = liste.find((c) => c.id === id);

        if (cours) {
            document.getElementById("edit-cours-id").value       = cours.id;
            document.getElementById("edit-cours-nom").value      = cours.nom;
            document.getElementById("edit-cours-coach").value    = cours.coach;
            document.getElementById("edit-cours-jour").value     = cours.jour;
            document.getElementById("edit-cours-heure").value    = cours.heure;
            document.getElementById("edit-cours-duree").value    = cours.duree;
            document.getElementById("edit-cours-niveau").value   = cours.niveau;
            document.getElementById("edit-cours-capacite").value = cours.capacite;

            modalEditCours.classList.add("active");
        }
    };

    const fermerModalCours = () => {
        modalEditCours.classList.remove("active");
    };

    if (btnFermerCours)  btnFermerCours.addEventListener("click", fermerModalCours);
    if (btnAnnulerCours) btnAnnulerCours.addEventListener("click", fermerModalCours);

    if (formEditCours) {
        formEditCours.addEventListener("submit", (e) => {
            e.preventDefault();

            const id = parseInt(document.getElementById("edit-cours-id").value);
            const liste = lireCours();
            const index = liste.findIndex((c) => c.id === id);

            if (index !== -1) {
                // Vérifier doublon (sauf soi-même)
                const coachSaisi  = document.getElementById("edit-cours-coach").value;
                const jourSaisi   = document.getElementById("edit-cours-jour").value;
                const heureSaisie = document.getElementById("edit-cours-heure").value;

                const doublon = liste.find((c) => {
                    return c.id !== id && c.coach === coachSaisi && c.jour === jourSaisi && c.heure === heureSaisie;
                });

                if (doublon) {
                    alert("⚠️ Ce coach a déjà un cours ce jour-là à cette heure !");
                    return;
                }

                liste[index].nom      = document.getElementById("edit-cours-nom").value.trim();
                liste[index].coach    = coachSaisi;
                liste[index].jour     = jourSaisi;
                liste[index].heure    = heureSaisie;
                liste[index].duree    = parseInt(document.getElementById("edit-cours-duree").value);
                liste[index].niveau   = document.getElementById("edit-cours-niveau").value;
                liste[index].capacite = parseInt(document.getElementById("edit-cours-capacite").value);

                sauvegarderCours(liste);
                fermerModalCours();
                afficherCours();
                
                // Notifier le script de stats s'il existe
                if (window.mettreAJourStats) window.mettreAJourStats();

                alert("✅ Cours mis à jour !");
            }
        });
    }

    // -------------------------------------------------------
    // AJOUTER UN COURS (Via Modal)
    // -------------------------------------------------------
    const modalAjout = document.getElementById("modal-ajouter-cours");
    const btnOuvrirAjout = document.getElementById("btn-ouvrir-ajout-cours");
    const btnFermerAjout = document.getElementById("fermer-modal-ajout-cours");
    const btnAnnulerAjout = document.getElementById("btn-annuler-ajout-cours");

    const fermerModalAjout = () => {
        if(modalAjout) modalAjout.classList.remove("active");
    };

    if (btnOuvrirAjout) {
        btnOuvrirAjout.addEventListener("click", () => {
            if(modalAjout) modalAjout.classList.add("active");
        });
    }

    if (btnFermerAjout) btnFermerAjout.addEventListener("click", fermerModalAjout);
    if (btnAnnulerAjout) btnAnnulerAjout.addEventListener("click", fermerModalAjout);

    if (formulaire) {
        formulaire.addEventListener("submit", (event) => {
            event.preventDefault();

            const liste = lireCours();

            // Vérifier doublon : même coach + même jour + même heure
            const coachSaisi  = document.getElementById("cours-coach").value;
            const jourSaisi   = document.getElementById("cours-jour").value;
            const heureSaisie = document.getElementById("cours-heure").value;

            const doublon = liste.find((c) => {
                return c.coach === coachSaisi && c.jour === jourSaisi && c.heure === heureSaisie;
            });

            if (doublon) {
                alert("⚠️ Ce coach a déjà un cours ce jour-là à cette heure !");
                return;
            }

            // Nouvel ID
            const nouvelId = liste.length > 0 ? Math.max(...liste.map((c) => c.id)) + 1 : 1;

            const nouveauCours = {
                id:       nouvelId,
                nom:      document.getElementById("cours-nom").value.trim(),
                coach:    coachSaisi,
                jour:     jourSaisi,
                heure:    heureSaisie,
                duree:    parseInt(document.getElementById("cours-duree").value),
                niveau:   document.getElementById("cours-niveau").value,
                capacite: parseInt(document.getElementById("cours-capacite").value)
            };

            liste.push(nouveauCours);
            sauvegarderCours(liste);
            formulaire.reset();
            fermerModalAjout();
            afficherCours();
            
            // Notifier le script de stats s'il existe
            if (window.mettreAJourStats) window.mettreAJourStats();

            alert("✅ Cours ajouté avec succès !");
        });
    }

    // -------------------------------------------------------
    // AFFICHAGE INITIAL
    // -------------------------------------------------------
    afficherCours();

});
