//Code References 
//https://github.com/mozdevs/MediaRecorder-examples/blob/gh-pages/filter-and-record-live-audio.html
//https://stackoverflow.com/questions/12407778/connecting-to-tcp-socket-from-browser-using-javascript
//https://franzeus.medium.com/record-audio-in-js-and-upload-as-wav-or-mp3-file-to-your-backend-1a2f35dea7e8
//https://stackoverflow.com/questions/57507737/send-microphone-audio-recorder-from-browser-to-google-speech-to-text-javascrip

//import Recorder from 'recorder-js';
//const Recorder = require('recorder-js');
let rec = null;
let audioStream = null;
let constraints = { audio: true, video:false }
var recordButton, stopButton, recorder;


// Register the extendable-media-recorder-wav-encoder
//async connect() {
//  await register(await connect());
//}


//let audioBlobs = [];

window.onload = function () {
  recordButton = document.getElementById('record');
  stopButton = document.getElementById('stop');

  // get audio stream from user's mic
  navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
    recordButton.disabled = false;
    recordButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click', stopRecording);
    
    const audioContext = new window.AudioContext();
    audioStream = stream;
    const input = audioContext.createMediaStreamSource(stream);
    //rec = new Recorder(input, { numChannels:1 })
    recorder = new MediaRecorder(stream);

    // listen to dataavailable, which gets triggered whenever we have
    // an audio blob available
    
    //rec.addEventListener('dataavailable', onRecordingReady);
    recorder.addEventListener('dataavailable', onRecordingReady);
  });
};

function startRecording() {
  recordButton.disabled = true;
  stopButton.disabled = false;
  
  //rec.record()
  recorder.start();
}

function stopRecording() {
  recordButton.disabled = false;
  stopButton.disabled = true;

  // Stopping the recorder will eventually trigger the `dataavailable` event and we can complete the recording process
  //rec.stop()
  //audioStream.getAudioTracks()[0].stop();
  //rec.exportWAV(uploadSoundData);
  recorder.stop();
}

function onRecordingReady(e) {
  var audio = document.getElementById('audio');
  // e.data contains a blob representing the recording
  audio.src = URL.createObjectURL(e.data);
  audio.play();
  uploadBlob(e.data, 'ogg');
}



/**
 * Uploads audio blob to your server
 * @params {Blob} audioBlob - The audio blob data
 * @params {string} fileType - 'mp3' or 'wav'
 * @return {Promise<object>)
 */
async function uploadBlob(audioBlob, fileType) {
  let filename = new Date().toISOString();
  let xhr = new XMLHttpRequest();
  const apiUrl = "http://localhost/upload_sound";
  xhr.onload = function(e) {
        if(this.readyState === 4) {
            document.getElementById("output").innerHTML = `<br><br><strong>Result: </strong>${e.target.responseText}`
        }
  };
  const formData = new FormData();
  formData.append('audio_data', audioBlob, filename);
  
  xhr.open("POST", apiUrl, true);
  xhr.send(formData); 
  /*
  //formData.append('type', fileType || 'ogg');
  //Your server endpoint to upload audio:
  const apiUrl = "http://localhost:8000";

  const response = await fetch(apiUrl, {
    method: 'POST',
    cache: 'no-cache',
    body: formData
    });

  return response;
  */
}

function uploadSoundData(blob) {
    let filename = new Date().toISOString();
    let xhr = new XMLHttpRequest();
    xhr.onload = function(e) {
        if(this.readyState === 4) {
            document.getElementById("output").innerHTML = `<br><br><strong>Result: </strong>${e.target.responseText}`
        }
    };
    let formData = new FormData();
     const apiUrl = "http://localhost/upload_sound";
    formData.append("audio_data", blob, filename);
    xhr.open("POST", apiUrl, true);
    xhr.send(formData);
}
