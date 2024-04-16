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
    console.log('Received list of items:', foodList);
  
    const mealDetailsPromises = foodList.map(async (item) => {
        // Fetch meal details for each item from TheMealDB API
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(item)}`);
        const data = await response.json();

        // Extract the first meal
        const meal = data.meals ? data.meals[0] : null;

        return meal;
    });

    // Wait for all meal detail requests to complete
    const mealDetails = await Promise.all(mealDetailsPromises);

    // Filter out any meals that were not found (null values)
    const validMeals = mealDetails.filter(meal => meal !== null);

    // Send the list of valid meals back to the client
    res.json({ meals: validMeals });

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





