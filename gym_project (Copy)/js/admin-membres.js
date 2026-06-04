// ============================================================
// FICHIER : js/admin-membres.js
// PAGE    : admin-dashboard.html
// FEATURE : Gestion des membres (CRUD) avec localStorage
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    // -------------------------------------------------------
    // DONNÉES PAR DÉFAUT (5 membres pré-remplis)
    // On les ajoute seulement si localStorage est vide
    // -------------------------------------------------------
    const membresParDefaut = [
        { id: 1, nom: "Ahmed Boudiaf",   email: "ahmed.b@gmail.com",  telephone: "0555123456", plan: "Gold",   dateInscription: "14/03/2025" },
        { id: 2, nom: "Fatima Zouaoui",  email: "fatima.z@gmail.com", telephone: "0661234567", plan: "Silver", dateInscription: "13/03/2025" },
        { id: 3, nom: "Mohamed Kerri",   email: "m.kerri@yahoo.fr",   telephone: "0772345678", plan: "Bronze", dateInscription: "12/03/2025" },
        { id: 4, nom: "Nour Hamoud",     email: "nour.h@gmail.com",   telephone: "0553456789", plan: "Silver", dateInscription: "11/03/2025" },
        { id: 5, nom: "Youssef Bentahar",email: "y.bentahar@gmail.com",telephone: "0664567890", plan: "Gold",   dateInscription: "10/03/2025" },
    ];

    // Si localStorage est vide → on met les membres par défaut
    if (!localStorage.getItem("membres")) {
        localStorage.setItem("membres", JSON.stringify(membresParDefaut));
    }

    // -------------------------------------------------------
    // FONCTIONS UTILITAIRES : Lire et Écrire dans localStorage
    // -------------------------------------------------------
    const lireMembres = () => JSON.parse(localStorage.getItem("membres")) || [];

    const sauvegarderMembres = (liste) => {
        localStorage.setItem("membres", JSON.stringify(liste));
    };

    // -------------------------------------------------------
    // RÉCUPÉRATION DES ÉLÉMENTS HTML
    // -------------------------------------------------------
    const tableauMembres = document.getElementById("tableau-membres");
    const champRecherche = document.getElementById("recherche-membre");
    const filtrePlan     = document.getElementById("filtre-plan-membre");
    const compteurTotal  = document.getElementById("compteur-membres");
    const formulaireAdd  = document.getElementById("form-ajouter-membre");

    // -------------------------------------------------------
    // FONCTION : Afficher les membres dans le tableau
    // -------------------------------------------------------
    const afficherMembres = (liste) => {
        tableauMembres.innerHTML = "";

        // Mettre à jour le compteur
        compteurTotal.textContent = `Total : ${liste.length} membre(s)`;

        if (liste.length === 0) {
            tableauMembres.innerHTML = '<tr><td colspan="6" class="text-center color-light-gray p-20">Aucun membre trouvé.</td></tr>';
            return;
        }

        liste.forEach((membre, index) => {
            const isLast = index === liste.length - 1;
            const borderStyle = isLast ? "border-bottom: none;" : "";
            
            let ligne = "<tr>";
            ligne += `<td style="padding: 1.25rem 1.5rem; ${borderStyle}">${membre.id}</td>`;
            ligne += `<td style="padding: 1.25rem 1.5rem; font-weight: 600; ${borderStyle}">${membre.nom}</td>`;
            ligne += `<td style="padding: 1.25rem 1.5rem; ${borderStyle}">${membre.email}</td>`;
            ligne += `<td style="padding: 1.25rem 1.5rem; ${borderStyle}">${membre.telephone}</td>`;
            ligne += `<td style="padding: 1.25rem 1.5rem; font-weight: 600; color: var(--accent); ${borderStyle}">${membre.plan}</td>`;
            ligne += `<td style="padding: 1.25rem 1.5rem; ${borderStyle}">${membre.dateInscription}</td>`;
            ligne += `<td style="padding: 1.25rem 1.5rem; text-align: right; white-space: nowrap; ${borderStyle}">`;
            ligne += `<button class="btn-edit" onclick="modifierMembre(${membre.id})" title="Modifier">✏️</button> `;
            ligne += `<button class="btn-delete" onclick="supprimerMembre(${membre.id})" title="Supprimer">🗑️</button>`;
            ligne += '</td>';
            ligne += "</tr>";

            tableauMembres.innerHTML += ligne;
        });
    };

    // -------------------------------------------------------
    // FONCTION : Filtrer et Rechercher
    // -------------------------------------------------------
    const filtrerMembres = () => {
        const texte = champRecherche.value.toLowerCase();
        const plan  = filtrePlan.value;
        const liste = lireMembres();

        const resultat = liste.filter((membre) => {
            const okTexte = membre.nom.toLowerCase().includes(texte) ||
                          membre.email.toLowerCase().includes(texte);
            const okPlan  = (plan === "" || membre.plan === plan);
            return okTexte && okPlan;
        });

        afficherMembres(resultat);
    };

    // -------------------------------------------------------
    // ÉCOUTER LES FILTRES
    // -------------------------------------------------------
    if (champRecherche) champRecherche.addEventListener("input", filtrerMembres);
    if (filtrePlan)     filtrePlan.addEventListener("change", filtrerMembres);

    // -------------------------------------------------------
    // SUPPRIMER UN MEMBRE (accessible globalement)
    // -------------------------------------------------------
    window.supprimerMembre = (id) => {
        const confirmation = confirm("Voulez-vous vraiment supprimer ce membre ?");

        if (confirmation) {
            const liste = lireMembres();
            const nouvelListe = liste.filter((m) => m.id !== id);
            sauvegarderMembres(nouvelListe);
            filtrerMembres(); // Réafficher
            
            // Notifier le script de stats s'il existe
            if (window.mettreAJourStats) window.mettreAJourStats();
        }
    };

    // -------------------------------------------------------
    // MODIFIER UN MEMBRE (Via Modal)
    // -------------------------------------------------------
    const modalEdit     = document.getElementById("modal-modifier-membre");
    const formEdit      = document.getElementById("form-modifier-membre");
    const btnFermer     = document.getElementById("fermer-modal-membre");
    const btnAnnuler    = document.getElementById("btn-annuler-edit");

    window.modifierMembre = (id) => {
        const liste  = lireMembres();
        const membre = liste.find((m) => m.id === id);

        if (membre) {
            // Remplir le formulaire
            document.getElementById("edit-id").value    = membre.id;
            document.getElementById("edit-nom").value   = membre.nom;
            document.getElementById("edit-email").value  = membre.email;
            document.getElementById("edit-telephone").value = membre.telephone;
            document.getElementById("edit-plan").value   = membre.plan;

            // Afficher le modal
            modalEdit.classList.add("active");
        }
    };

    const fermerModal = () => {
        modalEdit.classList.remove("active");
    };

    if (btnFermer)  btnFermer.addEventListener("click", fermerModal);
    if (btnAnnuler) btnAnnuler.addEventListener("click", fermerModal);

    // Enregistrer les modifications
    if (formEdit) {
        formEdit.addEventListener("submit", (e) => {
            e.preventDefault();

            const id = parseInt(document.getElementById("edit-id").value);
            const liste = lireMembres();
            const index = liste.findIndex((m) => m.id === id);

            if (index !== -1) {
                liste[index].nom       = document.getElementById("edit-nom").value.trim();
                liste[index].email     = document.getElementById("edit-email").value.trim();
                liste[index].telephone = document.getElementById("edit-telephone").value.trim();
                liste[index].plan      = document.getElementById("edit-plan").value;

                sauvegarderMembres(liste);
                fermerModal();
                filtrerMembres();
                
                // Notifier le script de stats s'il existe
                if (window.mettreAJourStats) window.mettreAJourStats();
                
                alert("Membre mis à jour avec succès !");
            }
        });
    }

    // -------------------------------------------------------
    // AJOUTER UN NOUVEAU MEMBRE (Via Modal)
    // -------------------------------------------------------
    const modalAjout = document.getElementById("modal-ajouter-membre");
    const btnOuvrirAjout = document.getElementById("btn-ouvrir-ajout");
    const btnFermerAjout = document.getElementById("fermer-modal-ajout");
    const btnAnnulerAjout = document.getElementById("btn-annuler-ajout");

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

    if (formulaireAdd) {
        formulaireAdd.addEventListener("submit", (event) => {
            event.preventDefault();

            const liste = lireMembres();

            // On génère un nouvel ID (max existant + 1)
            let nouvelId = 1;
            if (liste.length > 0) {
                nouvelId = Math.max(...liste.map((m) => m.id)) + 1;
            }

            // Date du jour
            const maintenant = new Date();
            const dateAujourdHui = `${maintenant.getDate().toString().padStart(2, '0')}/${(maintenant.getMonth() + 1).toString().padStart(2, '0')}/${maintenant.getFullYear()}`;

            // Nouveau membre
            const nouveauMembre = {
                id:              nouvelId,
                nom:             document.getElementById("new-nom").value.trim(),
                email:           document.getElementById("new-email").value.trim(),
                telephone:       document.getElementById("new-telephone").value.trim(),
                plan:            document.getElementById("new-plan").value,
                dateInscription: dateAujourdHui
            };

            liste.push(nouveauMembre);
            sauvegarderMembres(liste);

            // Réinitialiser le formulaire
            formulaireAdd.reset();
            fermerModalAjout();

            // Réafficher
            filtrerMembres();

            // Notifier le script de stats
            if (window.mettreAJourStats) window.mettreAJourStats();

            alert("Membre ajouté avec succès !");
        });
    }

    // -------------------------------------------------------
    // AFFICHAGE INITIAL
    // -------------------------------------------------------
    filtrerMembres();

});
