const apikey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiZXF0dG5rY25lcmZsbmZ1aGp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NzI4MjcsImV4cCI6MjA3NDQ0ODgyN30.vhHrJL1mxnCa7jkt1Kv4xmHmINH1Vf8cnyJHradb_qk'
const apikey_url = 'https://hbeqttnkcnerflnfuhjw.supabase.co'


const supabase = window.supabase.createClient(apikey_url, apikey)


async function creerUser(mail, password) {
    showLoader();

    const { data, error } = await supabase.auth.signUp({
        email: mail,
        password: password,
    });

    hideLoader();
    console.log(error);
    if (error) {
        // Vérifie si l'erreur vient d'un email déjà enregistré
        if (error.message.includes("User already registered")) {
            showPopup("Cet email existe déjà. Veuillez en choisir un autre ou vous connecter.", "error");
        } else {
            showPopup("Erreur : " + error.message, "error");
        }
        return;
    }

    // Si pas d'erreur, alors inscription réussie
    showPopup(
        "Inscription réussie ! Veuillez vérifier votre email pour confirmer votre compte.",
        "success",
        "login.html" // redirection après confirmation
    );
}


// Écoute du bouton de créationT 
btncrer = document.getElementById('btnCreation')

// Écoute du bouton de créationT 
btncrer = document.getElementById('btnCreation')

if (btncrer) {
  
    btncrer.addEventListener('click', async (e) => {
        e.preventDefault();
        const mail = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!mail || !password || password !== confirmPassword) {
            showPopup("Veuillez remplir tous les champs correctement.", "error");
            return;
        }

        await creerUser(mail, password);
    });
}



// Fonction pour connecter un utilisateur

async function connecterUser(mail, password) {
    showLoader();

    // Tentative de connexion
    const { data, error } = await supabase.auth.signInWithPassword({
        email: mail,
        password: password,
    });

    hideLoader();

    if (error) {
        showPopup("Email ou mot de passe incorrect", "error");

        return;
    }

    const userId = data.user.id;
    // Vérifier si l'utilisateur a déjà un profile
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single(); // on récupère un seul profile

    if (profileError && profileError.code !== 'PGRST116') { // ignore "No rows found"
        showPopup("Erreur lors de la vérification du profile : " + profileError.message, "error");
        return;
    }

    if (profile) {
        // Profile existant → redirection vers accueil

        window.location.href = "index.html";
        ;
    } else {
        // Pas de profile → redirection vers création de profile

        window.location.href = "profile.html";
        console.log(data.user.id);
    }
}

// Écoute du bouton connexion
const btnConnexion = document.getElementById('btnconnecter');
if (btnConnexion) {
    btnConnexion.addEventListener('click', async function (e) {
        e.preventDefault();
        const mail = document.getElementById('emailc').value;
        const password = document.getElementById('passwordc').value;

        await connecterUser(mail, password);
    });
}

async function initProfilePage() {
    // Vérifier que nous sommes bien sur la page profile
    if (!document.getElementById('profilecreation')) return;

    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
        // Rediriger vers login seulement si on n'est pas déjà sur login
        if (window.location.pathname !== '/login.html') {
            window.location.href = "login.html";
        }
        return;
    }

    const userId = session.user.id;

    // Écoute du bouton de création de profile
    profileCreation = document.getElementById('profilecreation');
    if (profileCreation) {
        profileCreation.addEventListener('click', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const bio = document.getElementById('bio').value;

            if (!username || !bio) {
                console.log("Veuillez remplir tous les champs.");
                showPopup("Veuillez remplir tous les champs.", "error");
                return;
            } else {
                await ajouterProfile(userId, username, bio);
            }

        });
    }
}




async function ajouterProfile(userId, username, bio) {
    const { data, error } = await supabase
        .from('profiles')
        .insert([{ id: userId, username, bio }])
        .select();

    if (error) {
        showPopup("Erreur lors de la création du profile : ", "error");
        return;
    }

    // Profile créé → redirection vers accueil
    showPopup("Profile ajouté avec succès !", "success", "index.html");
}


//Fonction supprimer proifle
async function supprimerProfile(userId) {
    const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
    if (error) {
        return;
    }
    showPopup("Profile supprimé avec succès!", "success", "login.html");


}

function showLoader() {
    document.getElementById("loader").style.display = "block";
}

//Masquer le loader barner
function hideLoader() {
    document.getElementById("loader").style.display = "none";
}
function showPopup(message, type = 'error', redirectUrl = null) {
    const overlay = document.getElementById("popup-overlay");
    const popup = document.getElementById("popup-card");
    const popupMessage = document.getElementById("popup-message");
    const okLink = document.getElementById("popup-ok");


    // Mettre le message
    popupMessage.textContent = message;

    // Supprimer toutes les classes de type
    popup.classList.remove('popup-error', 'popup-success', 'popup-info');

    // Ajouter la classe correspondant au type
    if (type === 'error') popup.classList.add('popup-error');
    else if (type === 'success') popup.classList.add('popup-success');
    else if (type === 'info') popup.classList.add('popup-info');

    // Afficher le popup
    overlay.style.display = 'block';

    // Fermer avec le lien OK
    okLink.onclick = (e) => {
        e.preventDefault();
        closePopup();

        // Redirection seulement après clic sur OK
        if (redirectUrl) {
            window.location.replace(redirectUrl);
        }
    };
}
btnAnnuler = document.getElementById('btnAnnuler');
if (btnAnnuler) {
    btnAnnuler.onclick = (e) => {
        e.preventDefault();
        document.getElementById("modalModifier").style.display = 'none';
    };
}
if (window.location.pathname.includes("index.html")) {
    recupererProfile();
    const deconexionbtn = document.getElementById('deconnexion');
    if (deconexionbtn) {
        deconexionbtn.addEventListener('click', async function (e) {
            e.preventDefault();
            await supabase.auth.signOut();
            window.location.replace("login.html");
        });
    }
    // Supprimer le profile
    const supprimerbtn = document.getElementById("delete-btn");
    if (supprimerbtn) {
        console.log(supprimerbtn)
        supprimerbtn.addEventListener('click', async function (e) {
            e.preventDefault();
            const { data: { user, error } } = await supabase.auth.getUser()
            if (error || !user) {
                return null;
            }
            console.log(user.id);
            await supprimerProfile(user.id);

        });
    }

    const btnmodifier = document.getElementById("btnmodifier");
    if (btnmodifier) {
        btnmodifier.addEventListener('click', async (e) => {
            e.preventDefault();
            const { data: { user, error } } = await supabase.auth.getUser()
            if (error || !user) {
                return null;
            }
            const { data: profile, erro } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            console.log(profile);
            if (erro) {
                console.log('Erreur lors de la récupération du profile :');
                return;
            }
            console.log(profile);
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
}
function closePopup() {
    document.getElementById("popup-overlay").style.display = 'none';
}



async function recupererProfile() {
    const { data: { user, error } } = await supabase.auth.getUser()
    if (error || !user) {
        return null;
    }
    const { data: profile, erro } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
   
    if (erro) {
        
        return;
    }
    afficageProfile(profile);
}

btnsave = document.getElementById('btnsave');
if (btnsave) {
    btnsave.addEventListener('click', async (e) => {
        e.preventDefault();
        const { data: { user, error } } = await supabase.auth.getUser()
        if (error || !user) {
            return null;
        }
        const username = document.getElementById('editusername').value;
        const bio = document.getElementById('editbio').value;
        if (!username || !bio) {
            
            showPopup("Veuillez remplir tous les champs.", "error");
            return;
        } else {
            await modifierProfile(user.id, username, bio);
            document.getElementById("modalModifier").style.display = 'none';
        }
        showPopup("Profile modifié avec succès!", "success");
        window.location.replace("index.html");
        
    });
}


async function modifierProfile(userId, username, bio) {
    const { data, error } = await supabase
        .from('profiles')
        .update({ username, bio })
        .eq('id', userId);
    if (error) {
       
        return;
    }
}

function afficageProfile(profile) {
    if (!profile) return;
    const usernameElement = document.getElementById('username');
    const bioElement = document.getElementById('bio');
    usernameElement.textContent = profile.username;
    bioElement.textContent = profile.bio;
}
if (window.location.pathname.includes("index.html")) {
    recupererProfile();
    deconexionbtn = document.getElementById('deconnexion');
    if (deconexionbtn) {
        deconexionbtn.addEventListener('click', async function (e) {
            e.preventDefault();
            await supabase.auth.signOut();
            window.location.replace("login.html");
        });
    }
    // Supprimer le profile
    supprimerbtn = document.getElementById("delete-btn");
    if (supprimerbtn) {
        console.log(supprimerbtn)
        supprimerbtn.addEventListener('click', async function (e) {
            e.preventDefault();
            const { data: { user, error } } = await supabase.auth.getUser()
            if (error || !user) {
                return null;
            }
            console.log(user.id);
            await supprimerProfile(user.id);

        });
    }
}


// document.addEventListener("DOMContentLoaded", async () => {
//     const page = window.location.pathname.split("/").pop();
//     const protectedPages = ["index.html", "profile.html"];

//     if (protectedPages.includes(page)) {
//         const { data: { session } } = await supabase.auth.getSession();

//         if (!session) {
//             window.location.replace("login.html");
//             return;
//         }
//     }
//     if (window.location.pathname.includes("index.html")) {
//         document.body.style.display = "block";
//     }

//     // Si on arrive ici → utilisateur autorisé

// });


// Initialisation de la page profile
initProfilePage();