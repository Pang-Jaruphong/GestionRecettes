const token = localStorage.getItem("jwt_token");

if (!token) {
    window.location.href = "login.html";
}

function displayRecipes(recipes) {
    const container = document.getElementById('recipeList');
    container.innerHTML = '';

    recipes.forEach(recipe => {
        const card = `
        <a href="recipeDetail.html?id=${recipe.id}" class="text-decoration-none text-dark">
            <div class="recipe-card shadow-sm">
                <img src="assets/images/${recipe.photo}" alt="${recipe.title}" class="recipe-img">
                <div class="recipe-details p-3">
                    <h4 class="fw-bold">${recipe.title}</h4>
                    <span class="badge bg-success mb-2">${recipe.category}</span>    
                        <div class="text-warning">
                            ${"★".repeat(recipe.moyNote)} <span class="text-muted small">(${recipe.moyNote}/5)</span>
                        </div>
                <button onclick="editRecipe(${recipe.id})">Modifier</button>
                <button onclick="deleteRecipe(${recipe.id})">Supprimer</button>
                </div>
            </div>`;

        container.innerHTML += card;
    });
}

// Load top rate form BE
async function fetchTopRecipes() {
    try {
        // Remplace URL
        const response = await fetch(`${API_URL}recipes/top`);
        const data = await response.json();

        // Show informations
        displayRecipes(data);
    } catch (error) {
        console.error("Erreur lors du chargement des recettes:", error);
    }
}

async function deleteRecipe(id) {
    await fetch(`http://localhost:5000/recipes/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: token
        }
    });

    loadRecipes();
}

async function editRecipe(id) {
    const title = prompt("Nouveau titre");
    const category = prompt("Nouvelle catégorie");
    const photo = prompt("Nouvelle image");

    await fetch(`${API_URL}/recipes/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: token
        },
        body: JSON.stringify({
            title,
            category,
            photo
        })
    });

    loadRecipes();
}

document.addEventListener('DOMContentLoaded', () => {
    fetchTopRecipes();
    const loginBtn = document.getElementById('loginBtn');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            window.location.href = '/GestionRecettes/frontend/login.html';
        })
    }
})

document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
});

loadRecipes();