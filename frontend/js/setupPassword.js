
const params = new URLSearchParams(window.location.search);
const token = params.get("token");

// create password and check id HTML page
const passwordForm = document.getElementById('formLogin');

// hostname != pathname
if (passwordForm && window.location.pathname.includes('setupPassword.html')) {
    passwordForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const newPassword = document.getElementById("newPassword").value;
        const confirmNewPassword = document.getElementById("confirmNewPassword").value;

        if (!token) {
            alert("Erreur : aucun jeton de sécurité trouvé. Veuillez utiliser le lien reçu")
            return;
        }

        if (newPassword !== confirmNewPassword) {
            alert("Les mot de passe ne correspond pas !");
            return;
        }

        if (newPassword.length < 8){
            alert("Le mot de passe doit faire au moins 8 caractères");
            return;
        }

        try {
            // send to backend with fetch
            const reponse = await fetch(`${API_URL}/auth/changePassword`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    token: token,
                    newPassword: newPassword,
                    confirmNewPassword: confirmNewPassword,
                })
            });

            const data = await reponse.json();

            if (reponse.ok) {
                alert("Mot de passe créé avec succès ! Vous pouvez se connecter");
                window.location.href = "login.html";
            } else {
                alert("Erreur venant du serveur !");
            }
        } catch (err) {
            console.error("Erreur technique : ", err);
            alert("Impossible de connexion du serveur !");
        }
    });
}