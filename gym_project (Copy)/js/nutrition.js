// ============================================================
// FICHIER : js/nutrition.js
// FEATURE : Calculateur TDEE et Protéines
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("nutri-calc-form");
    const display = document.getElementById("calc-display");
    const placeholder = document.getElementById("calc-placeholder");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Récupération des valeurs
        const gender = document.getElementById("calc-gender").value;
        const weight = parseFloat(document.getElementById("calc-weight").value);
        const height = parseFloat(document.getElementById("calc-height").value);
        const age = parseInt(document.getElementById("calc-age").value);
        const activity = parseFloat(document.getElementById("calc-activity").value);

        // 1. Calcul du Métabolisme de Base (BMR) - Formule Mifflin-St Jeor
        let bmr;
        if (gender === "male") {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }

        // 2. Calcul de la dépense totale (TDEE)
        const tdee = Math.round(bmr * activity);

        // 3. Calcul des Protéines (Basé sur le niveau d'activité)
        // Sédentaire : 1.2g/kg | Modéré : 1.6g/kg | Intense : 2.0g/kg
        let proteinFactor = 1.6;
        if (activity <= 1.2) proteinFactor = 1.0;
        else if (activity >= 1.725) proteinFactor = 2.0;
        
        const proteinNeeded = Math.round(weight * proteinFactor);

        // 4. Calcul des Lipides (Graisses)
        // En moyenne 0.9g à 1g par kg de poids de corps pour un athlète
        const fatNeeded = Math.round(weight * 0.9);

        // 5. Calcul des Glucides (Sucres)
        // Le reste des calories (1g Prot/Glu = 4kcal, 1g Lip = 9kcal)
        const caloriesFromOthers = (proteinNeeded * 4) + (fatNeeded * 9);
        const carbsNeeded = Math.round(Math.max(0, (tdee - caloriesFromOthers) / 4));

        // Affichage des résultats
        document.getElementById("res-calories").textContent = tdee.toLocaleString();
        document.getElementById("res-protein").textContent = proteinNeeded;
        document.getElementById("res-carbs").textContent = carbsNeeded;
        document.getElementById("res-fat").textContent = fatNeeded;

        // Notes complémentaires
        const notesDiv = document.getElementById("calc-notes");
        notesDiv.innerHTML = `
            <p><strong>Note :</strong> Ces valeurs sont des estimations pour la maintenance. 
            Pour une <strong>prise de masse</strong>, ajoutez 300-500 kcal (principalement en glucides). 
            Pour une <strong>sèche</strong>, réduisez de 300 kcal. N'oubliez pas de boire au moins 3L d'eau par jour.</p>
        `;

        // Animation d'affichage
        placeholder.classList.add("d-none");
        display.classList.remove("d-none");
        
        // Petit effet visuel
        display.style.opacity = 0;
        let opacity = 0;
        const interval = setInterval(() => {
            if (opacity >= 1) clearInterval(interval);
            display.style.opacity = opacity;
            opacity += 0.1;
        }, 30);
    });
});