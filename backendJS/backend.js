//code reference 
//https://stackoverflow.com/questions/12006417/node-js-server-that-accepts-post-requests
//https://codelabs.developers.google.com/codelabs/cloud-speech-text-node#5
//https://cloud.google.com/docs/authentication/client-libraries#node.js

/**
 * TODO(developer):
 *  1. Uncomment and replace these variables before running the sample.
 *  2. Set up ADC as described in https://cloud.google.com/docs/authentication/external/set-up-adc
 *  3. Make sure you have the necessary permission to list storage buckets "storage.buckets.list"
 *    (https://cloud.google.com/storage/docs/access-control/iam-permissions#bucket_permissions)
 */
 
//Google variables
const projectId = 'elevated-surge-414403';

//const {Storage} = require('@google-cloud/speech');

const speech = require('@google-cloud/speech');
const client = new speech.SpeechClient();

//Javascript Server variables
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const https = require('https');
const http = require('http');
const path = require('path');

const upload = multer();

const app = express();
const httpPort = 80;
const httpsPort = 443; 
const foodPort = 8000;

app.use(express.static('./'));
app.use(bodyParser.json());

//Import the webpage files
app.use(express.static('../webPage/', {index: 'kitchenAidWebpage.html'}))
app.use(express.static(path.join(__dirname, '../webPage')));


async function sendGoogleTextToSpeech(audioBuffer){

	
	  const audio = {
	   content: audioBuffer.toString('base64'),
 	  };
 	  const config = {
  	  languageCode: 'en-US',
  	  };
  	  const request = {
  	  audio: audio,
  	  config: config,
    	};
	 
	 // Detects speech in the audio file
	 const [response] = await client.recognize(request);
	 const transcription = response.results
	      .map(result => result.alternatives[0].transcript)
	      .join('\n');
	 console.log(`Transcription: ${transcription}`);	
	
		
	// The path to the remote LINEAR16 file stored in Google Cloud Storage
	  const gcsUri = 'gs://cloud-samples-data/speech/brooklyn_bridge.raw';

	  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
	  const audio2 = {
	    uri: body,
	  };
	  const config2 = {
	    encoding: 'LINEAR16',
	    sampleRateHertz: 16000,
	    languageCode: 'en-US',
	  };
	  const request2 = {
	    audio: audio2,
	    config: config2,
	  };

	  // Detects speech in the audio file
	  const [response2] = await client.recognize(request2);
	  const transcription2 = response2.results
	      .map(result => result.alternatives[0].transcript)
	      .join('\n');
	  console.log(`Transcription: ${transcription2}`);
	
	
}
    
app.post('/upload_sound', upload.any(), async (req, res) => {
    console.log("Getting text transcription..");
    let transcription = await sendGoogleTextToSpeech(req.files[0].buffer);
    console.log("Text transcription: " + transcription);
    res.status(200).send(transcription);
});


//processes post request for the list of items
app.post('/recipe_from_list', async (req, res) => {
    const foodList = req.body.items;
    var json;
    //var response;
    //var response2;
    console.log('Received list of items:', foodList.join(","));
    console.log(`https://www.themealdb.com/api/json/v2/9973533/filter.php?i=` + foodList.join(","));
    //the mealdb api key is 9973533
    
    try{
        const response = await fetch(`https://www.themealdb.com/api/json/v2/9973533/filter.php?i=` + foodList.join(",")).then(
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

       console.log(`https://www.themealdb.com/api/json/v2/9973533/lookup.php?i=` + response.meals[0].idMeal);     
        const response2 = await fetch(`https://www.themealdb.com/api/json/v2/9973533/lookup.php?i=` + response.meals[0].idMeal).then(
            function(response2) {
              if (response2.status !== 200) {
                console.log('Problem in fetching');
                return null;
              }
              return response2.text().then(function(data) {
                json = JSON.parse(data)
                return json
              });
            })   
        console.log(response2.meals[0].strMeal);    

        res.json({ recipe : response2 });
    
    }catch(e){
        console.error(e);
        console.error('Problem in API Cals');
    } 

});


// Redirect http
const httpServer = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); /* @dev First, read about security */
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Max-Age', 2592000); // 30 days
    res.setHeader('Access-Control-Allow-Headers', 'content-type'); // Might be helpful
    res.writeHead(301, { 'Location': `https://${req.headers.host}${req.url}` });
    res.end();
});
httpServer.listen(httpPort, () => {
    console.log(`HTTP server Running`);
});

const httpsOptions = {
    key: fs.readFileSync('/etc/ssl/private/apache.key'),
    cert: fs.readFileSync('/etc/ssl/certs/apache.crt')
};
const httpsServer = https.createServer(httpsOptions, app);

httpsServer.listen(httpsPort, () => {
    console.log(`HTTPS server running`);
});





