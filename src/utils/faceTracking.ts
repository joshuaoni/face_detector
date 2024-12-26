import * as faceapi from 'face-api.js';


export async function loadFaceApiModels() {
  const modelPath = '/models';
  await faceapi.nets.tinyFaceDetector.loadFromUri(modelPath);
}

export async function detectFace(video: HTMLVideoElement) {
  if (video.paused || video.ended) return [];
  const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());

  return detections;
}

