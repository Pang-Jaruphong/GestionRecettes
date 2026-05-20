function displayIngredients(ingredients) {
    const container = document.getElementById("ingredientsList");
    container.innerHTML = "";

    ingredients.forEach(ingredient => {
        container.innerHTML += `
            <div class="ingredient-card">
                <h4>${ingredient.name}</h4>
            </div>
        `;
    });
}

async function fetchIngredients() {
    try {
        const response = await fetch(`${API_URL}/ingredients`);
        const ingredients = await response.json();

        displayIngredients(ingredients);
    } catch (error) {
        console.error("Erreur chargement ingrédients :", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchIngredients();

    const loginBtn = document.getElementById("loginBtn");

    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            window.location.href = "login.html";
        });
    }
});

const searchInput = document.getElementById("sidebarSearch");
const btnSearch = document.getElementById("btnSearch");

if (btnSearch && searchInput) {
    btnSearch.addEventListener("click", async(e) => {
        e.preventDefault();

        const keyword = searchInput.value.trim();

        if (!keyword) {
            fetchIngredients();
            return;
        }

        try {
            const response = await fetch(`${API_URL}/recipes/search/${keyword}`);

            const recipes = await response.json();

            if (!Array.isArray(recipes)) {
                console.error("Réponse inattendue :", recipes);
                return;
            }

            if (recipes.length === 0) {

                document.getElementById("recipeList").innerHTML = `
            <p>
                Aucune recette ne correspond à cette recherche.
            </p>
            `;
                return;
            }
            displayIngredients(recipes);
        } catch (err) {
            console.error("Erreur lors du chargement des ingrédients", err);
        }
    })
}