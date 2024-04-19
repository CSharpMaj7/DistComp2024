# DistComp2024
Repository for distributed Computing project. 
this repository will hold the progress for the distributed computing project for Kelvin Freeman. 
The program design name is called Kitchen Aid. An AI assisted program to help users waste less food. 
The program helps the users choose recpies from a limted amount of items. 

In the "backend.JS" are the items that handle the backend server code and settings

-backend.js - the javascript code that handles the html for the webpage, the javascript for the webpage and the code that 
              handles the post responses. This code also handles the API fetch calls to the mealDB which is the database that was used 
              to get recipies for the frontend. 

-package-lock.json - This was a file created in order to used the google-speech-to-text api

-package-lock.json - This was a file created in order to use npm 

The "webPage" folder contians all of the items needed for the wepgage front end. 

- Picture1.png - This is the picture of the logo

- kitchenAidWebpage.html - the webpage html code

- recipeFromList.js - This Javascript file handles the list of items from the user and then send the list of items to the backend server

- record-live-audio.js - This javascript file records audio from the browser so that it can be sent back to the backend server and be passes to the
                         google-speech-to-text api

Overall run the project just pull the git repository and run "sudo node backend.js" and if the npm packages are installed the web server should work. 
