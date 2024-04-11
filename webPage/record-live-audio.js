// This example uses MediaRecorder to record from a live audio stream,
// and uses the resulting blob as a source for an audio element.
//
// The relevant functions in use are:
//
// navigator.mediaDevices.getUserMedia -> to get audio stream from microphone
// MediaRecorder (constructor) -> create MediaRecorder instance for a stream
// MediaRecorder.ondataavailable -> event to listen to when the recording is ready
// MediaRecorder.start -> start recording
// MediaRecorder.stop -> stop recording (this will generate a blob of data)
// URL.createObjectURL -> to create a URL from a blob, which we can use as audio src

import {MediaRecorder, register} from 'extendable-media-recorder';
import {connect} from 'extendable-media-recorder-wav-encoder';

//let mediaRecorder = null;
//let audioBlobs = [];
//let capturedStream = null;

var recordButton, stopButton, recorder;

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
    recorder = new MediaRecorder(stream, {mimeType: 'audio/wav'});

    // listen to dataavailable, which gets triggered whenever we have
    // an audio blob available
    recorder.addEventListener('dataavailable', onRecordingReady);
  });
};

function startRecording() {
  recordButton.disabled = true;
  stopButton.disabled = false;

  recorder.start();
}

function stopRecording() {
  recordButton.disabled = false;
  stopButton.disabled = true;

    mediaRecorder.addEventListener('stop', () => {
      const mimeType = mediaRecorder.mimeType;
      const audioBlob = new Blob(audioBlobs, { type: mimeType });
	  
      resolve(audioBlob);
    });

  // Stopping the recorder will eventually trigger the `dataavailable` event and we can complete the recording process
  recorder.stop();
}

function onRecordingReady(e) {
  var audio = document.getElementById('audio');
  // e.data contains a blob representing the recording
  audio.src = URL.createObjectURL(e.data);
  audio.play();
  uploadBlob(audioBlob, 'wav');
}

/**
 * Uploads audio blob to your server
 * @params {Blob} audioBlob - The audio blob data
 * @params {string} fileType - 'mp3' or 'wav'
 * @return {Promise<object>)
 */
function uploadBlob(audioBlob, fileType) {
  const formData = new FormData();
  formData.append('audio_data', audioBlob, 'file');
  formData.append('type', fileType || 'wav');

  // Your server endpoint to upload audio:
  const apiUrl = "http://localhost:8000";

  const response = fetch(apiUrl, {
    method: 'POST',
    cache: 'no-cache',
    body: formData
  });

  return response.json();
}
