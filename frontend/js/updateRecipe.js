const token = localStorage.getItem("jwt_token");

if (!token) {
    window.location.href = "dashboard.html";
}

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

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

function addIngredientRow(ingredientData = null) {

    const row = document.createElement('div');

    row.classList.add('ingredient-row');

    let option = "";

    ingredientsList.forEach(ingredient => {

        const selected =
            ingredientData && Number(ingredient.id) === Number(ingredientData.ingredient_id)
                ? "selected" : "";

        option += `
        <option value="${ingredient.id}" ${selected}>
            ${ingredient.name}
        </option>`;
    });

    row.innerHTML = `
        <select class= "ingredient-select">${option}</select>
    
        <input type="number" class="ingredient-quantity" placeholder="Quantité" min ="1"
            value="${ingredientData && ingredientData.quantity ? ingredientData.quantity : ""}">
    
        <input type="text" class="ingredient-unity" placeholder="Unité"
            value="${ingredientData && ingredientData.unity ? ingredientData.unity : ""}">
    
        <button type="button" class="removeIngredientBtn btn-delete-small">
            -
        </button>`;

    row.querySelector(".removeIngredientBtn").addEventListener("click", () => {
        row.remove();
    });

    ingredientsContainer.appendChild(row);
}

function hasDuplicateIngredients() {
    const selectedIds = [];

    document.querySelectorAll(".ingredient-select").forEach(select => {
        selectedIds.push(select.value);
    });

    const uniqueIds = new Set(selectedIds);

    return uniqueIds.size !== selectedIds.length;
}

async function loadRecipe() {
    const response = await fetch(`${API_URL}/recipes/${id}`);
    const recipe = await response.json();

    document.getElementById("title").value = recipe.title;
    document.getElementById("category").value = recipe.category_id;
    document.getElementById("prepareTime").value = recipe.prepareTime;
    document.getElementById("cookTime").value = recipe.cookTime;
    document.getElementById("portion").value = recipe.portion;
    document.getElementById("description").value = recipe.description;
    document.getElementById("photo").value = recipe.photo || "";

    console.log("Recette reçue :", recipe);
    console.log("Ingrédients de la recette :", recipe.ingredients);

    recipe.ingredients.forEach(ingredient => {
        console.log("Ingrédient chargé :", ingredient);
        addIngredientRow(ingredient);
    });
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

    const updateRecipe = {
        title: document.getElementById("title").value,
        category_id: document.getElementById("category").value,
        prepareTime: document.getElementById("prepareTime").value,
        cookTime: document.getElementById("cookTime").value,
        portion: document.getElementById("portion").value,
        photo: document.getElementById("photo").value,
        description: document.getElementById("description").value,
        ingredients: ingredients
    };

    if (hasDuplicateIngredients()) {
        alert("Vous ne pouvez pas ajouter deux fois le même ingrédient dans une recette.")
        return;
    }

    const response = await fetch(`${API_URL}/recipes/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: token
        },
        body: JSON.stringify(updateRecipe)
    });

    const data = await response.json();

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

async function init() {
    await loadCategories();
    await loadIngredients();
    await loadRecipe();
}
init();
