 
 const fetch = require('node-fetch');
 
 async function mealDbTest(){

        //the mealdb api key is 
    
        //try{
        //const response = await fetch(`https://www.themealdb.com/api/json/v1/I-5VDXKMUMB45R/search.php?s=${encodeURIComponent(foodList.join(",")}`);
        //const response = await fetch(`https://www.themealdb.com/api/json/v1/I-5VDXKMUMB45R/search.php?s=chicken_breast,tomato,garlic`).then(
        const response = await fetch(`https://www.themealdb.com/api/json/v2/9973533/filter.php?i=chicken_breast,garlic,salt`).then(
            function(response) {
              if (response.status !== 200) {
                console.log('Problem in fetching');
                return;
              }
              response.text().then(function(data) {
                
                var json = JSON.parse(data)
                
                console.log(data);
                console.log(json.meals[0].idMeal);
                
                
              });
              console.log(typeof response);
            }) 
              
        
        const response2 = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772`).then(
            function(response2) {
              if (response2.status !== 200) {
                console.log('Problem in fetching');
                return;
              }
              response2.text().then(function(data) {
                console.log(data);
              });
            })   
            

        //} catch (e) {
         // exception handling
        // }   
             
        
}

 
 
 
 mealDbTest()       
