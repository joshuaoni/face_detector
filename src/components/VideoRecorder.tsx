'use client';

import React, { useEffect, useRef, useState } from 'react';
import { loadFaceApiModels, detectFace } from '../utils/faceTracking';

const VideoRecorder: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);


  useEffect(() => {
    async function init() {
        await loadFaceApiModels();
    
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
    
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            const video = videoRef.current!;
            const canvas = canvasRef.current!;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
    
            requestAnimationFrame(trackFace);
          };
        }
      }

    const trackFace = async () => {
      if (videoRef.current && canvasRef.current) {
        const detections = await detectFace(videoRef.current);
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height); 
          detections.forEach((detection) => {
            const { x, y, width, height } = detection.box;
            ctx.strokeStyle = 'lime';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);
          });
        }
      }
      requestAnimationFrame(trackFace);  
    };

    init();
  }, []);

  const startRecording = () => {
    if (!canvasRef.current) {
      console.error('Canvas not initialized.');
      return;
    }
  
    setIsRecording(true);

    const stream = canvasRef.current.captureStream();
  
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
  
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.current.push(event.data);
      }
    };
  
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      chunks.current = [];
    };
  
    mediaRecorder.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current?.stop();
  };

  const downloadVideo = () => {
    if (videoUrl) {
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = 'recorded_video.mp4';
      a.click();
    }
  };

  return (
    <div className="px-4 flex flex-col items-center font-sans">
      <div className="relative">
        <video ref={videoRef} className="w-full rounded-lg shadow-md" autoPlay muted loop playsInline/>
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full rounded-lg"
        />
      </div>
      <div className="mt-6">
        {isRecording ? (
          <button
            onClick={stopRecording}
            className="bg-red-600 text-white px-6 py-2 rounded-lg shadow hover:bg-red-700 focus:outline-none transition-all"
          >
            Stop Recording
          </button>
        ) : (
          <button
            onClick={startRecording}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 focus:outline-none transition-all"
          >
            Start Recording
          </button>
        )}
      </div>
      {videoUrl && (
        <div className="mt-6 w-full">
          <h3 className="text-lg font-medium mb-2">Recorded Video:</h3>
          <video src={videoUrl} controls preload="auto" playsInline className="w-full rounded-lg shadow" />
        </div>
      )}
      {videoUrl && (
        <button
          onClick={downloadVideo}
          className="my-4 bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 focus:outline-none transition-all"
        >
          Download Video
        </button>
      )}
    </div>
  );
};

export default VideoRecorder;
