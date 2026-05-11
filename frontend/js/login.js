// Connexion to dashboard admin
const loginForm = document.getElementById('formLogin');

if (loginForm) {
    console.log("Formulaire de login détecté !");

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        console.log("le bouton login a été cliqué !")

        const mail = document.getElementById("inputMail").value;
        const password = document.getElementById("newPassword").value;

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    mail: mail,
                    password: password,
                })
            });
            const data = await response.json();

            console.log(data);

            if (response.ok){
                if (data.message.includes("Première connexion")) {
                    alert(data.message);
                    return;
                }
                if (data.token) {
                    localStorage.setItem('jwt_token', data.token);
                    alert("Connexion réussie !");
                    window.location.href = "/GestionRecettes/frontend/adminDashboard.html";
                }
            } else {
                alert(data.message || "Identifiants incorrects");
            }
        } catch (error) {
            console.error("Erreur login : ", error);
            alert("Impossible de connexion du serveur !");
        }
    });
}