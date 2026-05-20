const token = localStorage.getItem("jwt_token");

if (!token) {
    window.location.href = "dashboard.html";
}

const form = document.getElementById('addRecipeForm');
const categorySelect = document.getElementById('category');
const ingredientsContainer = document.getElementById('ingredientsContainer');
const addIngredientBtn = document.getElementById('addIngredientBtn');

let ingredientsList = [];

async function loadCategories() {
    const response = await fetch(`${API_URL}/categories`);
    const categories = await response.json();

    categorySelect.innerHTML = '';

    categories.forEach(category => {
        categorySelect.innerHTML += `
            <option value="${category.id}">
                ${category.name}
            </option>`;
    });
}

async function loadIngredients() {
    const response = await fetch(`${API_URL}/ingredients`);
    ingredientsList = await response.json();
}

function addIngredientRow() {

    const row = document.createElement('div');

    row.classList.add('ingredient-row');

    let option = "";

    ingredientsList.forEach(ingredient => {
        option += `
        <option value="${ingredient.id}">
            ${ingredient.name}
        </option>`;
    });

    row.innerHTML = `
        <select class= "ingredient-select">${option}</select>
    
        <input type="number" class="ingredient-quantity" placeholder="Quantité" min ="1">
    
        <input type="text" class="ingredient-unity" placeholder="Unité">
    
        <button type="button" class="removeIngredientBtn btn-delete-small">
            -
        </button>`;

    row.querySelector(".removeIngredientBtn").addEventListener("click", () => {
        row.remove();
    });

    ingredientsContainer.appendChild(row);
}

addIngredientBtn.addEventListener('click', addIngredientRow);

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const ingredients = [];

    document.querySelectorAll(".ingredient-row").forEach(row =>{
        ingredients.push({
            ingredient_id: row.querySelector(".ingredient-select").value,
            quantity: row.querySelector(".ingredient-quantity").value,
            unity: row.querySelector(".ingredient-unity").value,
        });
    });

    // aider par ChatGPT
    // Get champ image

    // imag optional
    let photoName ="";

    const photoInput = document.getElementById("photo");
    // get file selected with the first one
    const photoFile = photoInput.files[0];


    if (photoFile) {
        const allowedExtensions = [
            ".jpeg",
            ".jpg",
            ".png"
        ];

        const fileName = photoFile.name.toLowerCase();

        const isValidExtension = allowedExtensions.some(ext =>
            fileName.endsWith(ext)
        );

        if (!isValidExtension) {
            alert("Seuls les fichiers JPG et PNG sont autorisés.");
            return;
        }

        const maxSize = 2 * 1024 * 1024;

        if (photoFile.size > maxSize) {
            alert("L'image ne doit pas dépasser 2 Mo.");
            return;
        }

        photoName = photoFile.name;
    }

    const newRecipe = {
        title: document.getElementById("title").value,
        category_id: document.getElementById("category").value,
        prepareTime: document.getElementById("prepareTime").value,
        cookTime: document.getElementById("cookTime").value,
        portion: document.getElementById("portion").value,
        photo: photoName,
        description: document.getElementById("description").value,
        ingredients: ingredients
    };

    if (ingredients.length === 0) {
        alert("Une recette doit contenir au moins un ingrédient.");
        return;
    }

    const reponse = await fetch(`${API_URL}/recipes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token
        },
        body: JSON.stringify(newRecipe)
    });

    const data = await reponse.json();

    alert(data.message);

    window.location.href = "adminRecipes.html";
});

const cancelBtn = document.getElementById("cancelBtn");

if (cancelBtn) {

    cancelBtn.addEventListener("click", () => {

        const confirmCancel = confirm(
            "Êtes-vous sûr de vouloir annuler ? Les données saisies seront perdues."
        );

        if (confirmCancel) {
            window.location.href = "adminRecipes.html";
        }
    });
}

loadCategories();
loadIngredients();
