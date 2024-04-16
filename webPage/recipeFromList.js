//Code References
// https://stackoverflow.com/questions/68102339/how-to-call-api-from-the-mealdb
//This code will take the list of items from the html webpage and send the list of food items 
//to the server. 

async function sendFoodList() {
    // Get the list of items from the textarea
    const foodList = document.getElementById('foodList').value.split('\n').map(item => item.trim()).filter(item => item !== '');

	const response = await fetch('/recipe_from_list', {
	method: 'POST',
	headers: {
	    'Content-Type': 'application/json'
	},
	    body: JSON.stringify({ items: foodList })
	});

	if (!response.ok) {
	throw new Error('Network response was not ok');
	}

	const recipeOptions = await response.json();
    
	const mealDetailsContainer = document.getElementById('mealDetails');
          mealDetailsContainer.innerHTML = ''; 

        data.meals.forEach(meal => {
            const mealElement = document.createElement('div');
            mealElement.innerHTML = `
                <h3>${meal.strMeal}</h3>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="max-width: 300px;">
                <p><strong>Category:</strong> ${meal.strCategory}</p>
                <p><strong>Area:</strong> ${meal.strArea}</p>
                <p><strong>Instructions:</strong> ${meal.strInstructions}</p>
            `;
            mealDetailsContainer.appendChild(mealElement);    
         });
}
