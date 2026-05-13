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
                </div>
            </div>
        </a>`;
        container.innerHTML += card;
    });
}

async function fetchTopRecipes() {
    try {
        // Remplace l'URL par celle de ton API réelle
        const response = await fetch(`${API_URL}/recipes/top`);

        if (!response.ok) {
            throw new Error("Route recipes introuvable");
        }

        const data = await response.json();

        // show information
        displayRecipes(data);

    } catch (error) {
        console.error("Erreur lors du chargement des recettes:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchTopRecipes();

    const loginBtn = document.getElementById("loginBtn");

    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            window.location.href = "login.html";
        });
    }
});