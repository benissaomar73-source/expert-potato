// ============================================================
// FICHIER : js/inscription.js
// PAGE    : membership.html
// FEATURE : Validation du formulaire d'inscription
// ============================================================

// On attend que la page soit complètement chargée
document.addEventListener("DOMContentLoaded", () => {

    // On récupère le formulaire
    const formulaire = document.getElementById("form-inscription");

    // On récupère chaque champ du formulaire
    const champNom       = document.getElementById("nom");
    const champEmail     = document.getElementById("email");
    const champTelephone = document.getElementById("telephone");
    const champDob       = document.getElementById("dob");
    const champConditions = document.getElementById("conditions");

    // -------------------------------------------------------
    // FONCTION : afficher un message d'erreur sous un champ
    // -------------------------------------------------------
    const afficherErreur = (champ, message) => {
        // On met une bordure rouge sur le champ
        champ.style.borderColor = "red";

        // On cherche s'il y a déjà un message d'erreur après ce champ
        const ancienMessage = champ.parentElement.querySelector(".erreur");

        // Si pas encore de message, on en crée un
        if (!ancienMessage) {
            const msgElement = document.createElement("p");
            msgElement.classList.add("erreur");
            msgElement.style.color = "red";
            msgElement.style.fontSize = "0.85rem";
            msgElement.style.marginTop = "4px";
            msgElement.textContent = message;
            // On ajoute le message après le champ
            champ.parentElement.appendChild(msgElement);
        } else {
            // Sinon on met à jour le texte
            ancienMessage.textContent = message;
        }
    }

    // -------------------------------------------------------
    // FONCTION : effacer le message d'erreur d'un champ
    // -------------------------------------------------------
    const effacerErreur = champ => {
        // Bordure verte = champ valide
        champ.style.borderColor = "green";

        // On cherche et supprime le message d'erreur
        const ancienMessage = champ.parentElement.querySelector(".erreur");
        if (ancienMessage) {
            ancienMessage.remove();
        }
    }

    // -------------------------------------------------------
    // VALIDATION EN TEMPS REEL (quand l'utilisateur quitte un champ)
    // "blur" = l'utilisateur a cliqué ailleurs
    // -------------------------------------------------------

    // Validation du Nom
    champNom.addEventListener("blur", () => {
        // On supprime les espaces inutiles
        const valeur = champNom.value.trim();

        if (valeur === "") {
            afficherErreur(champNom, "Le nom est obligatoire.");
        } else if (valeur.length < 3) {
            afficherErreur(champNom, "Le nom doit avoir au moins 3 caractères.");
        } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(valeur)) {
            // Cette regex vérifie que le nom contient seulement des lettres
            afficherErreur(champNom, "Le nom doit contenir seulement des lettres.");
        } else {
            effacerErreur(champNom);
        }
    });

    // Validation de l'Email
    champEmail.addEventListener("blur", () => {
        const valeur = champEmail.value.trim();

        // Regex simple pour vérifier le format email : xxx@xxx.xx
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (valeur === "") {
            afficherErreur(champEmail, "L'email est obligatoire.");
        } else if (!regexEmail.test(valeur)) {
            afficherErreur(champEmail, "Format email invalide. Ex: nom@gmail.com");
        } else {
            effacerErreur(champEmail);
        }
    });

    // Validation du Téléphone
    champTelephone.addEventListener("blur", () => {
        const valeur = champTelephone.value.trim();

        // Regex : seulement des chiffres, entre 9 et 10 caractères (numéro algérien)
        const regexTel = /^[0-9]{9,10}$/;

        if (valeur === "") {
            afficherErreur(champTelephone, "Le téléphone est obligatoire.");
        } else if (!regexTel.test(valeur)) {
            afficherErreur(champTelephone, "Numéro invalide. Ex: 0555123456 (9-10 chiffres)");
        } else {
            effacerErreur(champTelephone);
        }
    });

    // Validation de la Date de Naissance (âge minimum 16 ans)
    champDob.addEventListener("blur", () => {
        const valeur = champDob.value;

        if (valeur === "") {
            afficherErreur(champDob, "La date de naissance est obligatoire.");
        } else {
            // On calcule l'âge
            const dateNaissance = new Date(valeur);
            const aujourdhui    = new Date();

            // Différence en années
            const age = aujourdhui.getFullYear() - dateNaissance.getFullYear();

            if (age < 16) {
                afficherErreur(champDob, "Vous devez avoir au moins 16 ans.");
            } else {
                effacerErreur(champDob);
            }
        }
    });

    // -------------------------------------------------------
    // VALIDATION A LA SOUMISSION DU FORMULAIRE
    // -------------------------------------------------------
    formulaire.addEventListener("submit", event => {
        // On empêche l'envoi du formulaire par défaut
        event.preventDefault();

        // On va vérifier chaque champ
        let formulaireValide = true;

        // --- Vérification Nom ---
        const nom = champNom.value.trim();
        if (nom === "" || nom.length < 3 || !/^[a-zA-ZÀ-ÿ\s]+$/.test(nom)) {
            afficherErreur(champNom, "Nom invalide (min 3 lettres, pas de chiffres).");
            formulaireValide = false;
        } else {
            effacerErreur(champNom);
        }

        // --- Vérification Email ---
        const email = champEmail.value.trim();
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === "" || !regexEmail.test(email)) {
            afficherErreur(champEmail, "Email invalide.");
            formulaireValide = false;
        } else {
            effacerErreur(champEmail);
        }

        // --- Vérification Téléphone ---
        const tel = champTelephone.value.trim();
        const regexTel = /^[0-9]{9,10}$/;
        if (tel === "" || !regexTel.test(tel)) {
            afficherErreur(champTelephone, "Téléphone invalide.");
            formulaireValide = false;
        } else {
            effacerErreur(champTelephone);
        }

        // --- Vérification Date de Naissance ---
        const dob = champDob.value;
        if (dob === "") {
            afficherErreur(champDob, "Date de naissance obligatoire.");
            formulaireValide = false;
        } else {
            const age = new Date().getFullYear() - new Date(dob).getFullYear();
            if (age < 16) {
                afficherErreur(champDob, "Vous devez avoir au moins 16 ans.");
                formulaireValide = false;
            } else {
                effacerErreur(champDob);
            }
        }

        // --- Vérification Plan sélectionné ---
        const planChoisi = document.querySelector('input[name="plan"]:checked');
        const erreurPlan = document.getElementById("erreur-plan");
        if (!planChoisi) {
            erreurPlan.style.display = "block";
            formulaireValide = false;
        } else {
            erreurPlan.style.display = "none";
        }

        // --- Vérification des Conditions ---
        if (!champConditions.checked) {
            afficherErreur(champConditions, "Vous devez accepter les conditions.");
            formulaireValide = false;
        } else {
            effacerErreur(champConditions);
        }

        // --- Si tout est valide : afficher message de succès ---
        if (formulaireValide) {
            // --- AFFICHER LE MODAL DE SUCCÈS ---
            const modal = document.getElementById("success-modal");
            const btnClose = document.getElementById("btn-close-modal");
            
            modal.classList.add("active");

            // Fermer le modal
            const closeModal = () => {
                modal.classList.remove("active");
                // On peut réinitialiser ou rediriger ici si besoin
                formulaire.reset();
                // Remettre les bordures en gris
                [champNom, champEmail, champTelephone, champDob].forEach(champ => {
                    champ.style.borderColor = "";
                });
            };

            btnClose.onclick = closeModal;
            window.onclick = (e) => {
                if (e.target === modal) closeModal();
            };
        }
    });

});
