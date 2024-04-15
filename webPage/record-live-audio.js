//Code References 
//https://github.com/mozdevs/MediaRecorder-examples/blob/gh-pages/filter-and-record-live-audio.html
//https://stackoverflow.com/questions/12407778/connecting-to-tcp-socket-from-browser-using-javascript
//https://franzeus.medium.com/record-audio-in-js-and-upload-as-wav-or-mp3-file-to-your-backend-1a2f35dea7e8
//import {MediaRecorder, register} from 'extendable-media-recorder';
//import {connect} from 'extendable-media-recorder-wav-encoder';

let mediaRecorder = null;
let audioBlobs = [];
let capturedStream = null;
var recordButton, stopButton, recorder;
var xhr=new XMLHttpRequest();

// Register the extendable-media-recorder-wav-encoder
//async connect() {
//  await register(await connect());
//}


//let audioBlobs = [];

window.onload = function () {
  recordButton = document.getElementById('record');
  stopButton = document.getElementById('stop');

  // get audio stream from user's mic
  navigator.mediaDevices.getUserMedia({
    audio: true
  })
  .then(function (stream) {
    recordButton.disabled = false;
    recordButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click', stopRecording);
    recorder = new MediaRecorder(stream);

    // listen to dataavailable, which gets triggered whenever we have
    // an audio blob available
    recorder.addEventListener('dataavailable', onRecordingReady);
  });
};

function startRecording() {
  recordButton.disabled = true;
  stopButton.disabled = false;
  //audioBlobs = [];
  //recorder.addEventListener('dataavailable', event => {
  //   audioBlobs.push(event.data);
  //});

  recorder.start();
}

function stopRecording() {
  recordButton.disabled = false;
  stopButton.disabled = true;

    //recorder.addEventListener('stop', () => {
    //  const mimeType = recorder.mimeType;
    //  const audioBlob = new Blob(audioBlobs, { type: mimeType });
    //  const blobUrl  = URL.createObjectURL(audioBlob);
    //  //resolve(audioBlob);
    //});

  // Stopping the recorder will eventually trigger the `dataavailable` event and we can complete the recording process
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
  const formData = new FormData();
  formData.append('audio_data', audioBlob, 'file');
  formData.append('type', fileType || 'ogg');

	
  // Your server endpoint to upload audio:
  const apiUrl = "http://localhost:8000";

  const response = await fetch(apiUrl, {
    method: 'POST',
    cache: 'no-cache',
    body: formData
    });

  return response;
}
