const searchBtn = document.getElementById('search-btn');
const mealList =document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () =>{
    mealDetailsContent.parentElement.classList.remove('showRecipe');
})

function getMealList(){
    let searchInputTxt = document.getElementById('search-input').value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
    .then(response => response.json())
    .then(data => {
        let html = "";
        if(data.meals){
            data.meals.forEach(meal => {
                html += `
                    <div class="meal-item" data-id="${meal.idMeal}">
                        <div class="meal-img">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                        </div>
                        <div class="meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href="" class="recipe-btn">Get Recipe</a>
                            <i class="fa-solid fa-bookmark save-icon"></i>
                        </div>
                    </div>
                `;
            });
            mealList.classList.remove('notFound');
        } else {
            html = "Sorry, we didn't find any meal!";
            mealList.classList.add('notFound');
        }

        mealList.innerHTML = html;
    })
}


function getMealRecipe(e){
    e.preventDefault();
    if(e.target.classList.contains('recipe-btn')){
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data.meals));
    }

    if(e.target.classList.contains('save-icon')){
        let mealItem = e.target.closest('.meal-item');
        saveRecipe(mealItem);
    }
}

function mealRecipeModal(meal){
    console.log(meal);
    meal = meal[0];
    let html = 
    `
    <h2 class="recipe-title">${meal.strMeal}</h2>
    <p class="recipe-category">${meal.strCategory}</p>
    <div class="recipe-instruct">
    <h3>Instructions:</h3>
    <p>${meal.strInstructions}</p>
    </div>
    <div class="recipe-meal-img">
    <img src="${meal.strMealThumb}" alt="">
    </div>
    <div class="recipe-link">
    <a href="${meal.strYoutube}" target= "_blank">Watch Video</a>
    </div>

    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');

};

function saveRecipe(mealItem) {
    
    const mealID = mealItem.dataset.id;
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];
            const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];

            
            if (savedRecipes.some(recipe => recipe.id === mealID)) {
                alert('Recipe is already saved!');
                return;
            }

            const recipe = {
                id: meal.idMeal,
                name: meal.strMeal,
                img: meal.strMealThumb,
                category: meal.strCategory,
                instructions: meal.strInstructions,
                youtube: meal.strYoutube
            };

            savedRecipes.push(recipe);
            localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
            alert('Recipe saved successfully!');
        })
        .catch(error => {
            console.error('Error fetching meal details:', error);
            alert('Failed to save the recipe. Please try again.');
        });
}