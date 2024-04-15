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

const upload = multer();

const app = express();
const port = 8000;

app.use(express.static('./'));


async function authenticateImplicitWithAdc() {
  // This snippet demonstrates how to list buckets.
  // NOTE: Replace the client created below with the client required for your application.
  // Note that the credentials are not specified when constructing the client.
  // The client library finds your credentials using ADC.
  const storage = new Storage({
    projectId,
  });
  const [buckets] = await storage.getBuckets();
  console.log('Buckets:');

  for (const bucket of buckets) {
    console.log(`- ${bucket.name}`);
  }

  console.log('Listed all storage buckets.');
}

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

app.listen(port, () => {
    console.log(`Express server listening on port: ${port}...`);
});


const http = require('http')

const server = http.createServer(function(request, response) {
  console.dir(request.param)
  response.setHeader('Access-Control-Allow-Origin', '*'); /* @dev First, read about security */
  response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  response.setHeader('Access-Control-Max-Age', 2592000); // 30 days
  response.setHeader('Access-Control-Allow-Headers', 'content-type'); // Might be helpful
  if (request.method == 'POST') {
    console.log('POST')
    var body = ''
    request.on('data', function(data) {
      body += data
      console.log('Partial body: ' + body)
    })
    request.on('end', function() {
      console.log('Body: ' + body)
      response.writeHead(200, {'Content-Type': 'text/html'})
      response.end('post received')
    })
    

    
  } else {
    console.log('GET')
    var html = `
            <html>
                <body>
                    <form method="post" action="http://localhost:8000">Name: 
                        <input type="text" name="name" />
                        <input type="submit" value="Submit" />
                    </form>
                </body>
            </html>`
    response.writeHead(200, {'Content-Type': 'text/html'})
    response.end(html)
  }
})

//const host = '0.0.0.0'

//authenticateImplicitWithAdc();
//server.listen(port, host)
//console.log(`Listening at http://${host}:${port}`)



