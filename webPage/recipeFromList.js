//Code References
5// https://stackoverflow.com/questions/68102339/how-to-call-api-from-the-mealdb
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

	const recipeJson = await response.json();
	const data = recipeJson.recipe.meals[0]
	
	console.log(recipeJson.recipe)
    
	const mealDetailsContainer = document.getElementById('recipeResponse');
    mealDetailsContainer.innerHTML = `
                <h3>${data.strMeal}</h3>
                <img src="${data.strMealThumb}" alt="${data.strMeal}" style="max-width: 300px;">
                <p><strong>Category:</strong> ${data.strCategory}</p>
                <p><strong>Area:</strong> ${data.strArea}</p>
                <p><strong>Instructions:</strong> ${data.strInstructions}</p>`;
                
                
}
