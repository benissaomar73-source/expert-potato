// ============================================================
// FICHIER : js/admin-stats.js
// PAGE    : admin-dashboard.html
// FEATURE : Statistiques dynamiques depuis localStorage
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    // -------------------------------------------------------
    // FONCTION : Calculer et afficher les stats
    // -------------------------------------------------------
    window.mettreAJourStats = () => {

        // On lit les membres depuis localStorage
        const membres = JSON.parse(localStorage.getItem("membres")) || [];
        const cours   = JSON.parse(localStorage.getItem("cours-admin")) || [];

        // --- Total membres ---
        const totalMembres = membres.length;
        document.getElementById("stat-membres").textContent = totalMembres;

        // --- Abonnements actifs (= total membres pour l'instant) ---
        document.getElementById("stat-abonnements").textContent = totalMembres;

        // --- Cours par semaine ---
        const totalCours = cours.length;
        document.getElementById("stat-cours").textContent = totalCours;

        // --- Plan le plus populaire ---
        let compteBronze = 0, compteSilver = 0, compteGold = 0;

        membres.forEach(m => {
            if (m.plan === "Bronze") compteBronze++;
            if (m.plan === "Silver") compteSilver++;
            if (m.plan === "Gold")   compteGold++;
        });

        let planPopulaire = "N/A";
        if (compteBronze >= compteSilver && compteBronze >= compteGold) planPopulaire = "Bronze";
        if (compteSilver >= compteBronze && compteSilver >= compteGold) planPopulaire = "Silver";
        if (compteGold   >= compteBronze && compteGold   >= compteSilver) planPopulaire = "Gold";

        document.getElementById("stat-plan-populaire").textContent = planPopulaire;

        // --- Graphique simple : barres CSS ---
        afficherGraphique(compteBronze, compteSilver, compteGold, totalMembres);
    }

    // -------------------------------------------------------
    // GRAPHIQUE EN BARRES (CSS uniquement, pas de librairie)
    // -------------------------------------------------------
    const afficherGraphique = (bronze, silver, gold, total) => {
        const conteneur = document.getElementById("graphique-plans");
        if (!conteneur) return;

        // Si 0 membres, on met 1 pour éviter division par zéro
        const base = total === 0 ? 1 : total;

        const hauteurBronze = Math.round((bronze / base) * 160); // Max 160px for better fit
        const hauteurSilver = Math.round((silver / base) * 160);
        const hauteurGold   = Math.round((gold   / base) * 160);

        conteneur.innerHTML = `
            <div class="chart-container">
                <!-- Barre Bronze -->
                <div class="chart-column">
                    <div class="chart-bar bronze" style="height:0px;" data-height="${hauteurBronze}px"></div>
                    <p class="chart-label">Bronze<br><strong>${bronze}</strong></p>
                </div>

                <!-- Barre Silver -->
                <div class="chart-column">
                    <div class="chart-bar silver" style="height:0px;" data-height="${hauteurSilver}px"></div>
                    <p class="chart-label">Silver<br><strong>${silver}</strong></p>
                </div>

                <!-- Barre Gold -->
                <div class="chart-column">
                    <div class="chart-bar gold" style="height:0px;" data-height="${hauteurGold}px"></div>
                    <p class="chart-label">Gold<br><strong>${gold}</strong></p>
                </div>
            </div>`;

        // Trigger animation
        setTimeout(() => {
            const bars = conteneur.querySelectorAll('.chart-bar');
            bars.forEach(bar => {
                bar.style.height = bar.getAttribute('data-height');
            });
        }, 50);
    }

    // -------------------------------------------------------
    // LANCER AU CHARGEMENT
    // -------------------------------------------------------
    mettreAJourStats();

});
