document.addEventListener('DOMContentLoaded', function() {

    function displayUserRecipes() {
        const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
        recipes.forEach((recipe, index) => createRecipeCard(recipe, index, 'user'));
    }

    function displaySavedRecipes() {
        const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
        savedRecipes.forEach((recipe, index) => createRecipeCard(recipe, index, 'saved'));
    }

    
    function createRecipeCard(recipe, index, type) {
        const recipesContainer = document.getElementById('recipesContainer');

        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');

        const deleteBtn = document.createElement('span');
        deleteBtn.classList.add('delete-recipe');
        deleteBtn.innerHTML = '&times;'; // Cross mark (×)
        deleteBtn.addEventListener('click', function() {
            if (type === 'user') {
                deleteUserRecipe(index);
            } else {
                deleteSavedRecipe(index);
            }
        });
        recipeCard.appendChild(deleteBtn);

        const recipeTitle = document.createElement('h3');
        recipeTitle.textContent = recipe.name;
        recipeCard.appendChild(recipeTitle);

        if (type === 'user') {
            const ingredientsSection = createListSection('Ingredients:', recipe.ingredients);
            recipeCard.appendChild(ingredientsSection);

            const instructionsSection = createListSection('Instructions:', recipe.instructions, 'ol');
            recipeCard.appendChild(instructionsSection);
        } else {
            const recipeCategory = document.createElement('p');
            recipeCategory.textContent = `Category: ${recipe.category}`;
            recipeCard.appendChild(recipeCategory);

            const recipeImg = document.createElement('img');
            recipeImg.src = recipe.img;
            recipeImg.alt = recipe.name;
            recipeImg.style.width = '150px';
            recipeImg.style.height = '150px';
            recipeImg.style.marginLeft = '200px';
            recipeImg.style.borderRadius = '50%';
            recipeCard.appendChild(recipeImg);

            const instructionsSection = document.createElement('div');
            instructionsSection.classList.add('instructions');

            const instructionsTitle = document.createElement('h4');
            instructionsTitle.textContent = 'Instructions:';
            instructionsSection.appendChild(instructionsTitle);

            const instructionsPara = document.createElement('p');
            instructionsPara.style.fontSize = '12px';
            instructionsPara.textContent = recipe.instructions;
            instructionsSection.appendChild(instructionsPara);
            recipeCard.appendChild(instructionsSection);

            const recipeLink = document.createElement('div');
            recipeLink.classList.add('recipe-link');

            const youtubeLink = document.createElement('a');
            youtubeLink.href = recipe.youtube;
            youtubeLink.target = '_blank';
            youtubeLink.textContent = 'Watch Video';
            recipeLink.appendChild(youtubeLink);

            recipeCard.appendChild(recipeLink);
        }

        recipesContainer.appendChild(recipeCard);
    }

    
    function createListSection(titleText, items, listType = 'ul') {
        const section = document.createElement('div');

        const title = document.createElement('h4');
        title.textContent = titleText;
        section.appendChild(title);

        const list = document.createElement(listType);
        items.forEach(function(item) {
            const listItem = document.createElement('li');
            listItem.textContent = item;
            list.appendChild(listItem);
        });
        section.appendChild(list);

        return section;
    }


    document.getElementById('recipeForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const recipeName = document.getElementById('recipeName').value.trim();
        const ingredients = getTextAreaLines('ingredients');
        const instructions = getTextAreaLines('instructions');

        if (!ingredients.length || !instructions.length) {
            alert('Please provide valid ingredients and instructions.');
            return;
        }

        const newRecipe = { name: recipeName, ingredients, instructions };

        const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
        recipes.push(newRecipe);
        localStorage.setItem('recipes', JSON.stringify(recipes));

        createRecipeCard(newRecipe, recipes.length - 1, 'user');
        document.getElementById('recipeForm').reset();

        showNotification('Yay! Your recipe is now part of our tasty collection!');
    });


    function getTextAreaLines(id) {
        return document.getElementById(id).value.trim().split('\n').map(line => line.trim()).filter(line => line);
    }

   
    function deleteUserRecipe(index) {
        const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
        recipes.splice(index, 1);
        localStorage.setItem('recipes', JSON.stringify(recipes));
        updateRecipeDisplay();
    }

    
    function deleteSavedRecipe(index) {
        const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
        savedRecipes.splice(index, 1);
        localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
        updateRecipeDisplay();
    }

   
    function updateRecipeDisplay() {
        document.getElementById('recipesContainer').innerHTML = '';
        displayUserRecipes();
        displaySavedRecipes();
    }

  
    function showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => notification.style.display = 'none', 3000);
    }

    updateRecipeDisplay();
});

