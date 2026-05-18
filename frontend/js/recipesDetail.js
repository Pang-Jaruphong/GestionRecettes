// const token = localStorage.getItem("jwt_token");

const urlParams = new URLSearchParams(window.location.search);

const id = urlParams.get('id');
const from = urlParams.get("from");

const backLink = document.getElementById("backLink");

if (from === "admin") {
    backLink.href = "adminDashboard.html";
} else {
    backLink.href = "dashboard.html";
}


document.addEventListener('DOMContentLoaded', async() => {

    if (!id) return;

    try {
        const reponse = await fetch(`${API_URL}/recipes/${id}`);
        const recipe = await reponse.json();

        document.getElementById('recipeTitle').innerText = recipe.title;
        document.getElementById('recipeCategoy').innerText = recipe.category;
        document.getElementById('recipePrep').innerText = recipe.prepareTime;
        document.getElementById('recipeCook').innerText = recipe.cookTime;
        document.getElementById('recipePortion').innerText = recipe.portion;
        document.getElementById('recipeDescription').innerText = recipe.description;
        document.getElementById('recipeNote').innerText = recipe.moyNote;

        console.log("photo :", recipe.photo)
        document.getElementById('recipeImage').src = `assets/images/${recipe.photo}`;

        const list = document.getElementById('ingredientsList');

        list.innerHTML = "";

        recipe.ingredients.forEach(ingredient => {
            list.innerHTML += `
                <li>
                    ${ingredient.name}
                    ${ingredient.quantity}
                    ${ingredient.unity}
                 </li>`;
        });
        console.log(recipe);
    } catch (err) {
        console.log("Erreur chargement détail",err);
    }
})

// Reviews
const avisModal = document.getElementById("avisModal");
const btnAvis = document.getElementById("btn-avis");
const closeAvis = document.getElementById("closeAvis");
const confirmAvis = document.getElementById("confirmAvis");
const stars = document.querySelectorAll("#stars span");

let selectedNote = 0;

btnAvis.addEventListener("click", () => {
    avisModal.classList.remove("hidden");
});

closeAvis.addEventListener("click", () => {
    avisModal.classList.add("hidden");
});

stars.forEach(star => {
    star.addEventListener("click", () => {
        selectedNote = Number(star.dataset.note);

        stars.forEach(s => {
            s.textContent = Number(s.dataset.note) <= selectedNote ? "★" : "☆";
        });
    });
});

confirmAvis.addEventListener("click", async () => {
    if (selectedNote === 0) {
        alert("Choisissez une note");
        return;
    }

    await fetch(`${API_URL}/recipes/${id}/reviews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            note: selectedNote
        })
    });

    avisModal.classList.add("hidden");
    location.reload();
    console.log(recipe.moyNote)
});