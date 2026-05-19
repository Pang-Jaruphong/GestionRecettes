const changeForm = document.getElementById("changePasswordForm");

if (changeForm) {
    changeForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const mail = document.getElementById("mail").value;
        const oldPassword = document.getElementById("oldPassword").value;
        const newPassword = document.getElementById("newPassword").value;
        const confirmNewPassword = document.getElementById("confirmNewPassword").value;
        try {
            if (newPassword !== confirmNewPassword) {
                alert("Les mots de passe ne correspondent pas.");
                return;
            }

            const response = await fetch(`${API_URL}/auth/changePassword`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mail,
                    oldPassword,
                    newPassword,
                    confirmNewPassword
                })
            });

            const data = await response.json();
            alert(data.message);

            if (response.ok) {
                window.location.href = "login.html";
            }
        } catch (err) {
            console.error(err);
            alert("Erreur de connexion au serveur");
        }

    });
}