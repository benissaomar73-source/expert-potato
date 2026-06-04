// ============================================================
// FICHIER : js/panier.js
// PAGE    : membership.html
// FEATURE : Sélection d'un plan (mini panier)
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    // -------------------------------------------------------
    // ON RÉCUPÈRE LES BOUTONS "Choisir" ET LA BARRE DU PANIER
    // -------------------------------------------------------
    const boutonsChoisir = document.querySelectorAll(".btn-choisir-plan");
    const barrePanier    = document.getElementById("barre-panier");
    const nomPlanAffiche = document.getElementById("panier-nom-plan");
    const prixPlanAffiche = document.getElementById("panier-prix");
    const btnProceder    = document.getElementById("btn-proceder");
    const btnViderPanier = document.getElementById("btn-vider-panier");

    // -------------------------------------------------------
    // FONCTION : Afficher le panier depuis sessionStorage
    // sessionStorage = mémoire temporaire (se vide à la fermeture du navigateur)
    // -------------------------------------------------------
    const afficherPanier = () => {
        // On lit ce qui est stocké dans la mémoire temporaire
        const planStocke = sessionStorage.getItem("planChoisi");

        if (planStocke) {
            // On convertit le texte JSON en objet JavaScript
            const plan = JSON.parse(planStocke);

            // On affiche la barre du panier
            barrePanier.classList.add("d-flex");
            barrePanier.classList.remove("d-none");
            nomPlanAffiche.textContent = plan.nom;
            prixPlanAffiche.textContent = plan.prix;
        } else {
            // Aucun plan → on cache la barre
            barrePanier.classList.add("d-none");
            barrePanier.classList.remove("d-flex");
        }
    }

    // -------------------------------------------------------
    // QUAND L'UTILISATEUR CLIQUE SUR "Choisir"
    // -------------------------------------------------------
    boutonsChoisir.forEach(bouton => {
        bouton.addEventListener("click", () => {

            // On lit le nom et le prix depuis les attributs du bouton
            const nomPlan  = bouton.getAttribute("data-nom");
            const prixPlan = bouton.getAttribute("data-prix");

            // On crée un objet avec ces infos
            const plan = {
                nom:  nomPlan,
                prix: prixPlan
            };

            // On sauvegarde dans sessionStorage (remplace l'ancien plan)
            sessionStorage.setItem("planChoisi", JSON.stringify(plan));

            // On met à jour l'affichage
            afficherPanier();

            // On fait défiler vers le bas vers le formulaire
            document.getElementById("inscription").scrollIntoView({ behavior: "smooth" });

            // On pré-sélectionne le bon bouton radio dans le formulaire
            const nomPlanMinuscule = nomPlan.toLowerCase().replace("🥉 ", "").replace("🥈 ", "").replace("🥇 ", "");
            const radioCorrespondant = document.querySelector(`input[name="plan"][value="${nomPlanMinuscule}"]`);
            if (radioCorrespondant) {
                radioCorrespondant.checked = true;
            }
        });
    });

    // -------------------------------------------------------
    // BOUTON "Procéder à l'inscription"
    // -------------------------------------------------------
    if (btnProceder) {
        btnProceder.addEventListener("click", () => {
            document.getElementById("inscription").scrollIntoView({ behavior: "smooth" });
        });
    }

    // -------------------------------------------------------
    // BOUTON "Vider" le panier
    // -------------------------------------------------------
    if (btnViderPanier) {
        btnViderPanier.addEventListener("click", () => {
            // On supprime le plan de la mémoire
            sessionStorage.removeItem("planChoisi");
            afficherPanier();
        });
    }

    // -------------------------------------------------------
    // AU CHARGEMENT : on affiche le panier s'il y en a un
    // -------------------------------------------------------
    afficherPanier();

});
