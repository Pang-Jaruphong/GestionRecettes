function displayRecipes(recipes) {
    const container = document.getElementById('recipeList');
    container.innerHTML = '';

    recipes.forEach(recipe => {
        const card = `
        <div class="recipe-card shadow-sm">
            <img src="../assets/images/${recipe.photo}" alt="${recipe.title}" class="recipe-img">
            <div class="recipe-details p-3">
                <h4 class="fw-bold">${recipe.title}</h4>
                <span class="badge bg-success mb-2">${recipe.category}</span>    
                    <div class="text-warning">
                        ${"★".repeat(recipe.moyNote)} <span class="text-muted small">(${recipe.moyNote}/5)</span>
                    </div>
            </div>
        </div>`;
        container.innerHTML += card;
    });
}

// Function to charge information form backend
async function fetchAllRecipes() {
    try {
        // Remplace URL to real one
        const response = await fetch('http://localhost:5000/recipes');
        const data = await response.json();

        // Call function to show info
        displayRecipes(data);
    } catch (error) {
        console.error("Erreur lors du chargement des recettes:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchAllRecipes();
    const loginBtn = document.getElementById('loginBtn');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            window.location.href = '../login/login.html';
        })
    }
})