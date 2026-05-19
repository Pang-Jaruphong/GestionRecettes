const params = new URLSearchParams(window.location.search);
const token = params.get("token");

const passwordForm = document.getElementById("formLogin");

if (passwordForm) {
    passwordForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const newPassword = document.getElementById("newPassword").value;
        const confirmNewPassword = document.getElementById("confirmNewPassword").value;

        if (!token) {
            alert("Erreur : aucun jeton de sécurité trouvé. Veuillez utiliser le lien reçu par mail.");
            return;
        }

        if (newPassword.length < 8) {
            alert("Le mot de passe doit contenir au moins 8 caractères.");
            return;
        }

        if (newPassword !== confirmNewPassword) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/setupPassword`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    token,
                    newPassword,
                    confirmNewPassword
                })
            });

            console.log("Token reçu :", token);

            const data = await response.json();

            alert(data.message);

            if (response.ok) {
                window.location.href = "login.html";
            }

        } catch (err) {
            console.error("Erreur createPassword :", err);
            alert("Impossible de se connecter au serveur.");
        }
    });
}