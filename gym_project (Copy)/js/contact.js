// ============================================================
// FICHIER : js/contact.js
// PAGE    : contact.html
// FEATURE : Validation formulaire contact + notification toast
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    const formulaire = document.getElementById("form-contact");
    const champNom     = document.getElementById("nom");
    const champEmail   = document.getElementById("email");
    const champSujet   = document.getElementById("sujet");
    const champMessage = document.getElementById("message");
    const compteurMsg  = document.getElementById("compteur-message");

    // -------------------------------------------------------
    // COMPTEUR DE CARACTÈRES pour le champ message
    // -------------------------------------------------------
    champMessage.addEventListener("input", () => {
        const nbCaracteres = champMessage.value.length;
        compteurMsg.textContent = `${nbCaracteres} / 20 caractères minimum`;

        // Si moins de 20 caractères → rouge, sinon vert
        if (nbCaracteres < 20) {
            compteurMsg.style.color = "red";
        } else {
            compteurMsg.style.color = "green";
        }
    });

    // -------------------------------------------------------
    // FONCTIONS : afficher / effacer erreur (identiques à inscription.js)
    // -------------------------------------------------------
    const afficherErreur = (champ, message) => {
        champ.style.borderColor = "red";
        const ancien = champ.parentElement.querySelector(".erreur");
        if (!ancien) {
            const msg = document.createElement("p");
            msg.classList.add("erreur");
            msg.style.color = "red";
            msg.style.fontSize = "0.85rem";
            msg.style.marginTop = "4px";
            msg.textContent = message;
            champ.parentElement.appendChild(msg);
        } else {
            ancien.textContent = message;
        }
    }

    const effacerErreur = champ => {
        champ.style.borderColor = "green";
        const ancien = champ.parentElement.querySelector(".erreur");
        if (ancien) ancien.remove();
    }

    // -------------------------------------------------------
    // VALIDATION À LA SOUMISSION
    // -------------------------------------------------------
    formulaire.addEventListener("submit", event => {
        event.preventDefault();

        let ok = true; // sera false si un champ est invalide

        // Vérification Nom (min 2 lettres)
        if (champNom.value.trim().length < 2) {
            afficherErreur(champNom, "Le nom doit avoir au moins 2 caractères.");
            ok = false;
        } else {
            effacerErreur(champNom);
        }

        // Vérification Email
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(champEmail.value.trim())) {
            afficherErreur(champEmail, "Email invalide. Ex: nom@gmail.com");
            ok = false;
        } else {
            effacerErreur(champEmail);
        }

        // Vérification Sujet (min 5 caractères)
        if (champSujet.value.trim().length < 5) {
            afficherErreur(champSujet, "Le sujet doit avoir au moins 5 caractères.");
            ok = false;
        } else {
            effacerErreur(champSujet);
        }

        // Vérification Message (min 20 caractères)
        if (champMessage.value.trim().length < 20) {
            afficherErreur(champMessage, "Le message doit avoir au moins 20 caractères.");
            ok = false;
        } else {
            effacerErreur(champMessage);
        }

        // -------------------------------------------------------
        // SI TOUT EST VALIDE
        // -------------------------------------------------------
        if (ok) {
            // On crée un objet avec les données du formulaire
            const nouveauMessage = {
                nom:     champNom.value.trim(),
                email:   champEmail.value.trim(),
                sujet:   champSujet.value.trim(),
                message: champMessage.value.trim(),
                date:    new Date().toLocaleString("fr-DZ") // date algérienne
            };

            // --- SAUVEGARDER DANS LOCALSTORAGE ---
            // localStorage = mémoire permanente du navigateur
            // On récupère la liste existante (ou tableau vide si première fois)
            const messagesExistants = localStorage.getItem("messages-contact");
            let listeMessages;

            if (messagesExistants) {
                listeMessages = JSON.parse(messagesExistants);
            } else {
                listeMessages = [];
            }

            // On ajoute le nouveau message à la liste
            listeMessages.push(nouveauMessage);

            // On sauvegarde la liste mise à jour
            localStorage.setItem("messages-contact", JSON.stringify(listeMessages));

            // --- AFFICHER LE MODAL DE SUCCÈS ---
            const modal = document.getElementById("success-modal");
            const btnClose = document.getElementById("btn-close-modal");
            
            modal.classList.add("active");

            // Fermer le modal
            const closeModal = () => {
                modal.classList.remove("active");
            };

            btnClose.onclick = closeModal;
            window.onclick = (e) => {
                if (e.target === modal) closeModal();
            };

            // --- RÉINITIALISER LE FORMULAIRE ---
            formulaire.reset();
            compteurMsg.textContent = "0 / 20 caractères minimum";
            compteurMsg.style.color = "";

            // Remettre les bordures en gris
            [champNom, champEmail, champSujet, champMessage].forEach(champ => {
                champ.style.borderColor = "";
            });
        }
    });

});
