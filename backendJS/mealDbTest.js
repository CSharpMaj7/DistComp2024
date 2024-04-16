 
 const fetch = require('node-fetch');
 
 async function mealDbTest(){

        //the mealdb api key is 9973533
        var json; 
        try{
        //const response = await fetch(`https://www.themealdb.com/api/json/v1/I-5VDXKMUMB45R/search.php?s=${encodeURIComponent(foodList.join(",")}`);
            //const response = await fetch(`https://www.themealdb.com/api/json/v1/I-5VDXKMUMB45R/search.php?s=chicken_breast,tomato,garlic`).then(
            const response = await fetch(`https://www.themealdb.com/api/json/v2/9973533/filter.php?i=chicken,garlic,salt`).then(
                function(response) {
                  if (response.status !== 200) {
                    console.log('Problem in fetching');
                    return null;
                  }
                  return response.text().then(function(data) {              
                    json = JSON.parse(data)
                    return json;          
                  });               
            })    

             
        console.log(response.meals[0].idMeal); 
        
        //try{
            const response2 = await fetch(`https://www.themealdb.com/api/json/v2/9973533/lookup.php?i=` + response.meals[0].idMeal ).then(
                function(response2) {
                  if (response2.status !== 200) {
                    console.log('Problem in fetching');
                    return;
                  }
                  return response2.text().then(function(data) {
                    json = JSON.parse(data)
                    return json
                  });
                })   
            console.log(response2.meals[0].strMeal);    
       // }catch(e){
        //    console.error(error);('Problem in API Lookup');
       // } 
               }catch(e){
            console.error(error);('Problem in API Filter');
        } 
        
}

 
 
 
 mealDbTest()       
