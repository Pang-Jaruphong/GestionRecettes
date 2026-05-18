const token = localStorage.getItem("jwt_token");

if (!token) {
    window.location.href = "dashboard.html";
}

function displayRecipes(recipes) {
    const container = document.getElementById('recipeList');
    container.innerHTML = '';

    recipes.forEach(recipe => {
        const card = `
        <div class="recipe-card shadow-sm admin-recipe-card">
            <a href="recipeDetail.html?id=${recipe.id}&from=admin" class="text-decoration-none text-dark">
            
                <img src="assets/images/${recipe.photo}" alt="${recipe.title}" class="recipe-img">
                
                <div class="recipe-details p-3">
                    <h4 class="fw-bold">${recipe.title}</h4>
                    <span class="badge bg-success mb-2">${recipe.category}</span>    
                       
                       <div class="text-warning">
                            ${"★".repeat(recipe.moyNote)} <span class="text-muted small">(${recipe.moyNote}/5)</span>
                       </div>
                </div>
            </a>
                
            <div class="admin-actions p-3 border-top">
                 <button onclick="editRecipe(${recipe.id})" class="btn-edit">Modifier</button>
                 <button onclick="deleteRecipe(${recipe.id}, '${recipe.title}')" class="btn-delete">Supprimer</button>
            </div>
        </div>`
        container.innerHTML += card;
    });
}

// Load top rate form BE
async function fetchTopRecipes() {
    try {
        // Remplace URL
        const response = await fetch(`${API_URL}/recipes/top`);
        const data = await response.json();

        // Show information
        displayRecipes(data);
    } catch (error) {
        console.error("Erreur lors du chargement des recettes:", error);
    }
}

async function deleteRecipe(id, title) {
    if (confirm(`Voulez-vous vraiment supprimer cette recette : ${title}`)) {
        try {
            const response = await fetch(`${API_URL}/recipes/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token
                }
            });
            if (response.ok) {
                alert( `La recette ${title} est supprimée avec succès`)
                fetchTopRecipes();
            } else {
                alert("Erreur lors de la suppression")
            }
        } catch (error) {
            console.error("Erreur lors du chargement des recettes");
        }
    }
}

async function editRecipe(id) {
    window.location.href = `updateRecipe.html?id=${id}`;
}

document.addEventListener('DOMContentLoaded', () => {
    fetchTopRecipes();

    document.getElementById("addRecipeBtn").addEventListener("click", async e => {
        window.location.href = "addRecipe.html";
    });

    /*
    document.getElementById("modifyRecipeBtn").addEventListener("click", async e => {
        window.location.href = "modifyRecipe.html";
    });
*/

    document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("jwt_token");
        window.location.href = "login.html";
    });
})
