// Initialisation du client Supabase
const apikey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiZXF0dG5rY25lcmZsbmZ1aGp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NzI4MjcsImV4cCI6MjA3NDQ0ODgyN30.vhHrJL1mxnCa7jkt1Kv4xmHmINH1Vf8cnyJHradb_qk'
const apikey_url = 'https://hbeqttnkcnerflnfuhjw.supabase.co'
const supabase = window.supabase.createClient(apikey_url, apikey)

// --- Fonctions d'aide ---

function showLoader() {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "block";
}

function hideLoader() {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "none";
}

function showPopup(message, type = 'error', redirectUrl = null) {
    const overlay = document.getElementById("popup-overlay");
    const popup = document.getElementById("popup-card");
    const popupMessage = document.getElementById("popup-message");
    const okLink = document.getElementById("popup-ok");

    if (!overlay || !popup || !popupMessage || !okLink) return;

    popupMessage.textContent = message;
    popup.classList.remove('popup-error', 'popup-success', 'popup-info');

    if (type === 'error') popup.classList.add('popup-error');
    else if (type === 'success') popup.classList.add('popup-success');
    else if (type === 'info') popup.classList.add('popup-info');

    overlay.style.display = 'block';

    okLink.onclick = (e) => {
        e.preventDefault();
        closePopup();
        if (redirectUrl) {
            window.location.replace(redirectUrl);
        }
    };
}

function closePopup() {
    const overlay = document.getElementById("popup-overlay");
    if (overlay) overlay.style.display = 'none';
}

// --- Fonctions de gestion des utilisateurs ---

/**
 * Crée un nouvel utilisateur.
 */
async function creerUser(mail, password) {
    showLoader();
    const { error } = await supabase.auth.signUp({ email: mail, password: password });
    hideLoader();

    if (error) {
        if (error.message.includes("User already registered")) {
            showPopup("Cet email existe déjà. Veuillez en choisir un autre ou vous connecter.", "error");
        } else {
            showPopup("Erreur : " + error.message, "error");
        }
        return;
    }

    showPopup("Inscription réussie ! Veuillez vérifier votre email pour confirmer votre compte.", "success", "index.html");
}

/**
 * Connecte un utilisateur.
 */
async function connecterUser(mail, password) {
    showLoader();
    if(!password || !mail) {
        showPopup("Veuillez renseigner tous les champs", "error");
        hideLoader();
        return;
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email: mail, password: password });
    hideLoader();
 
    if (error) {
        showPopup("Email ou mot de passe incorrect", "error");
        return;
    }
    if (!data.user) {
        showPopup("Utilisateur non trouvé", "error");
        return;
    }

    const userId = data.user.id;
    const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', userId).single();

    if (profileError && profileError.code !== 'PGRST116') {
        showPopup("Erreur lors de la vérification du profile : " + profileError.message, "error");
        return;
    }

    if (profile) {
        window.location.href = "accueil.html";
    } else {
        window.location.href = "profile.html";
    }
}

/**
 * Ajoute un nouveau profil utilisateur.
 */
async function ajouterProfile(userId, username, bio) {
    showLoader();
    const { error } = await supabase.from('profiles').insert([{ id: userId, username, bio }]);
    hideLoader();

    if (error) {
        showPopup("Erreur lors de la création du profile.", "error");
        return;
    }

    showPopup("Profile ajouté avec succès !", "success", "accueil.html");
}

/**
 * Supprime un profil utilisateur.
 */
async function supprimerProfile(userId) {
    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    if (error) {
        console.error("Error deleting profile:", error);
        return;
    }
    showPopup("Profile supprimé avec succès!", "success", "index.html");
}

/**
 * Modifie un profil utilisateur existant.
 */
async function modifierProfile(userId, username, bio) {
    const { error } = await supabase.from('profiles').update({ username, bio }).eq('id', userId);
    if (error) {
        console.error('Erreur lors de la modification du profile:', error);
    }
}

// --- Manipulation du DOM et écouteurs d'événements ---

/**
 * Affiche les informations du profil sur la page.
 */
function afficageProfile(profile) {
    if (!profile) return;
    const usernameElement = document.getElementById('username');
    const bioElement = document.getElementById('bio');
    if (usernameElement) usernameElement.textContent = profile.username;
    if (bioElement) bioElement.textContent = profile.bio;
}

/**
 * Récupère et affiche le profil de l'utilisateur.
 */
/**
 * Récupère et affiche le profil de l'utilisateur.
 */
async function recupererProfile() {
    // Récupérer l'utilisateur actuel
    const { data: { user } } = await supabase.auth.getUser();

    // S'il n'y a pas d'utilisateur, rediriger vers la page de connexion
    if (!user) {
        window.location.replace("index.html");
        return;
    }

    // Tenter de récupérer le profil de l'utilisateur
    const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();

    // Vérifier l'erreur. Si c'est une erreur "aucune ligne trouvée" (code PGRST116)
    // rediriger l'utilisateur vers la page de création de profil.
    if (error && error.code === 'PGRST116') {
        window.location.replace("profile.html");
        return;
    }

    // Gérer les autres types d'erreurs
    if (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        return;
    }
    
    // Si le profil est trouvé, l'afficher
    afficageProfile(profile);
}

// Écouteur d'événement pour le chargement du DOM
document.addEventListener("DOMContentLoaded", async () => {
    const page = window.location.pathname.split("/").pop();
    const protectedPages = ["accueil.html", "profile.html"];

    // Vérification de l'authentification sur les pages protégées
    if (protectedPages.includes(page)) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            window.location.replace("index.html");
            return;
        }
        document.body.style.display = "block";
    }

    // Initialisation du contenu selon la page actuelle
    if (page === "signup.html") {
        const btncrer = document.getElementById('btnCreation');
        if (btncrer) {
            btncrer.addEventListener('click', async (e) => {
                e.preventDefault();
                const mail = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirmPassword').value;

                if (!mail || !password || !confirmPassword) {
                    showPopup("Tous les champs sont obligatoires", "error");
                    return;
                }
                if (password!== confirmPassword) {
                    showPopup("Les mots de passe ne sont pas identiques.", "error");
                    return;
                }
                await creerUser(mail, password);
            });
        }
    } else if (page === "index.html") {
        const btnConnexion = document.getElementById('btnconnecter');
        if (btnConnexion) {
            btnConnexion.addEventListener('click', async (e) => {
                e.preventDefault();
                const mail = document.getElementById('emailc').value;
                const password = document.getElementById('passwordc').value;
                
                await connecterUser(mail, password);
            });
        }
    } else if (page === "profile.html") {
        const profileCreation = document.getElementById('profilecreation');
        if (profileCreation) {
            profileCreation.addEventListener('click', async (e) => {
                e.preventDefault();
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    showPopup("Erreur de session.", "error");
                    return;
                }
                const userId = session.user.id;
                const username = document.getElementById('username').value;
                const bio = document.getElementById('bio').value;

                if (!username || !bio) {
                    showPopup("Veuillez remplir tous les champs.", "error");
                    return;
                }
                await ajouterProfile(userId, username, bio);
            });
        }
    } else if (page === "accueil.html") {

        
        recupererProfile();
        console.log(recupererProfile());
        const deconexionbtn = document.getElementById('deconnexion');
        if (deconexionbtn) {
            deconexionbtn.addEventListener('click', async (e) => {
                e.preventDefault();
                await supabase.auth.signOut();
                window.location.replace("index.html");
            });
        }

        const supprimerbtn = document.getElementById("delete-btn");
        if (supprimerbtn) {
            supprimerbtn.addEventListener('click', async (e) => {
                e.preventDefault();
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;
                await supprimerProfile(user.id);
            });
        }

        const btnmodifier = document.getElementById("btnmodifier");
        if (btnmodifier) {
            btnmodifier.addEventListener('click', async (e) => {
                e.preventDefault();
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;
                const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                if (profile) {
                    document.getElementById("editusername").value = profile.username;
                    document.getElementById("editbio").value = profile.bio;
                    document.getElementById("modalModifier").style.display = 'flex';
                }
            });
        }

        const btnAnnuler = document.getElementById("btnAnnuler");
        if (btnAnnuler) {
            btnAnnuler.onclick = (e) => {
                e.preventDefault();
                document.getElementById("modalModifier").style.display = 'none';
            };
        }

        const btnsave = document.getElementById('btnsave');
        if (btnsave) {
            btnsave.addEventListener('click', async (e) => {
                e.preventDefault();
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const username = document.getElementById('editusername').value;
                const bio = document.getElementById('editbio').value;

                if (!username || !bio) {
                    showPopup("Veuillez remplir tous les champs.", "error");
                    return;
                }

                await modifierProfile(user.id, username, bio);
                document.getElementById("modalModifier").style.display = 'none';
                showPopup("Profile modifié avec succès!", "success", "accueil.html");
            });
        }
    }
});

