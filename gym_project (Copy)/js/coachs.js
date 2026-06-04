// ============================================================
// FICHIER : js/coachs.js
// PAGE    : trainers.html
// FEATURE : Recherche en temps réel + Modal détail coach
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    // -------------------------------------------------------
    // DONNÉES : liste des coachs
    // -------------------------------------------------------
    const tousLesCoachs = [
        {
            id: 1,
            nom: "Karim Hadjadj",
            specialite: "Boxe, CrossFit, MMA",
            experience: 8,
            bio: "Ancien champion régional de boxe, Karim est passionné par le fitness fonctionnel et les arts martiaux. Il accompagne ses élèves vers la performance physique et mentale.",
            cours: "Boxe Fitness (Lundi 18h), CrossFit (Mercredi 17h)",
            email: "k.hadjadj@powerfitdz.com",
            photo: "https://ui-avatars.com/api/?name=M&background=0f172a&color=fff&size=256"
        },
        {
            id: 2,
            nom: "Sarah Benmoussa",
            specialite: "Zumba, Stretching, Pilates",
            experience: 5,
            bio: "Diplômée en kinésiologie, Sarah spécialise dans les cours de groupe pour débutants et remise en forme. Sa bonne humeur est contagieuse !",
            cours: "Zumba (Lundi 9h), Stretching (Samedi 11h)",
            email: "s.benmoussa@powerfitdz.com",
            photo: "https://ui-avatars.com/api/?name=F&background=e94560&color=fff&size=256"
        },
        {
            id: 3,
            nom: "Yacine Djellouli",
            specialite: "Musculation, HIIT, Nutrition",
            experience: 10,
            bio: "Yacine est certifié IFBB et spécialisé en hypertrophie musculaire et préparation physique avancée. Il crée des programmes sur mesure.",
            cours: "Musculation avancée (Mardi 10h), HIIT (Vendredi 19h)",
            email: "y.djellouli@powerfitdz.com",
            photo: "https://ui-avatars.com/api/?name=M&background=0f172a&color=fff&size=256"
        },
        {
            id: 4,
            nom: "Amira Tebbal",
            specialite: "Yoga, Pilates, Méditation",
            experience: 6,
            bio: "Amira est certifiée yoga RYT-200 et aide ses élèves à trouver l'équilibre entre corps et esprit. Elle propose aussi des séances de relaxation.",
            cours: "Yoga Matinal (Mardi 7h30), Pilates (Jeudi 10h)",
            email: "a.tebbal@powerfitdz.com",
            photo: "https://ui-avatars.com/api/?name=F&background=e94560&color=fff&size=256"
        },
        {
            id: 5,
            nom: "Sofiane Bouzid",
            specialite: "Natation, Spinning, Aquagym",
            experience: 7,
            bio: "Ancien nageur compétiteur, Sofiane propose des cours pour tous niveaux et toutes tranches d'âge. Il adore motiver ses élèves.",
            cours: "Natation (Jeudi 8h), Spinning (Samedi 9h)",
            email: "s.bouzid@powerfitdz.com",
            photo: "https://ui-avatars.com/api/?name=M&background=0f172a&color=fff&size=256"
        },
        {
            id: 6,
            nom: "Lyna Mansouri",
            specialite: "Nutrition sportive, Remise en forme",
            experience: 4,
            bio: "Lyna est diététicienne diplômée et accompagne les membres dans leurs objectifs de perte de poids ou de prise de masse musculaire.",
            cours: "Consultation nutrition (Sur rendez-vous)",
            email: "l.mansouri@powerfitdz.com",
            photo: "https://ui-avatars.com/api/?name=F&background=e94560&color=fff&size=256"
        }
    ];

    // -------------------------------------------------------
    // ON RÉCUPÈRE LES ÉLÉMENTS HTML
    // -------------------------------------------------------
    const champRecherche = document.getElementById("recherche-coach");
    const grilleCoach    = document.getElementById("grille-coachs");
    const messageVide    = document.getElementById("aucun-coach");
    const modal          = document.getElementById("modal-coach");
    const contenuModal   = document.getElementById("contenu-modal");
    const btnFermer      = document.getElementById("fermer-modal");

    // -------------------------------------------------------
    // FONCTION : Afficher les cartes des coachs
    // -------------------------------------------------------
    const afficherCoachs = liste => {
        // On vide la grille
        grilleCoach.innerHTML = "";

        // Si liste vide → message
        if (liste.length === 0) {
            messageVide.classList.add("d-block");
            messageVide.classList.remove("d-none");
            return;
        }

        messageVide.classList.add("d-none");
        messageVide.classList.remove("d-block");

        // Pour chaque coach, on crée sa carte
        liste.forEach(coach => {
            const carte = document.createElement("article");
            carte.classList.add("trainer-card", "cursor-pointer");

            carte.innerHTML = `
                <div class="trainer-card-inner">
                    <figure>
                        <img src="${coach.photo}" alt="${coach.nom}">
                    </figure>
                    <h3>${coach.nom}</h3>
                    <p class="specialty">${coach.specialite}</p>
                    <p class="experience">🏅 ${coach.experience} ans d'expérience</p>
                    <p class="modal-profile-text">Voir le profil complet →</p>
                </div>`;


            // Clic sur la carte → ouvrir le modal
            carte.addEventListener("click", () => {
                ouvrirModal(coach);
            });

            grilleCoach.appendChild(carte);
        });
    }

    // -------------------------------------------------------
    // FONCTION : Ouvrir le modal avec les détails du coach
    // -------------------------------------------------------
    const ouvrirModal = coach => {
        // On remplit le contenu du modal
        contenuModal.innerHTML = `
            <div class="modal-profile-header">
                <img src="${coach.photo}" alt="${coach.nom}" class="modal-profile-img">
            </div>
            <h2 class="modal-profile-name">${coach.nom}</h2>
            <p class="modal-profile-specialty">🏅 ${coach.specialite}</p>
            <p><strong>Expérience :</strong> ${coach.experience} ans</p>
            <p class="modal-profile-text"><strong>Bio :</strong><br>${coach.bio}</p>
            <p class="modal-profile-text"><strong>Cours animés :</strong><br>${coach.cours}</p>
            <p class="modal-profile-text"><strong>Email :</strong> <a href="mailto:${coach.email}">${coach.email}</a></p>`;

        // On affiche le modal
        modal.classList.add("d-flex");
    }

    // -------------------------------------------------------
    // FERMER LE MODAL
    // -------------------------------------------------------

    // Clic sur le bouton ×
    btnFermer.addEventListener("click", () => {
        modal.classList.remove("d-flex");
    });

    // Clic en dehors du modal (sur le fond sombre)
    modal.addEventListener("click", event => {
        // Si on clique sur le fond (pas sur la boîte)
        if (event.target === modal) {
            modal.classList.remove("d-flex");
        }
    });

    // Touche Échap (Escape) pour fermer
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            modal.classList.remove("d-flex");
        }
    });

    // -------------------------------------------------------
    // RECHERCHE EN TEMPS RÉEL
    // -------------------------------------------------------
    champRecherche.addEventListener("input", () => {
        // On récupère ce que l'utilisateur tape (en minuscules)
        const texte = champRecherche.value.toLowerCase().trim();

        // On filtre les coachs dont le nom OU la spécialité contient le texte
        const coachsFiltres = tousLesCoachs.filter(coach => {
            const nomEnMinuscule       = coach.nom.toLowerCase();
            const specialiteEnMinuscule = coach.specialite.toLowerCase();

            return nomEnMinuscule.includes(texte) || specialiteEnMinuscule.includes(texte);
        });

        // On réaffiche
        afficherCoachs(coachsFiltres);
    });

    // -------------------------------------------------------
    // AFFICHAGE INITIAL
    // -------------------------------------------------------
    afficherCoachs(tousLesCoachs);

});
