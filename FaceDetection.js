// frontend/src/FaceDetection.js
import React, { useRef, useEffect } from 'react';
import * as faceapi from '@vladmandic/face-api';

const FaceDetection = () => {
    const videoRef = useRef();

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = '/models';
            await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
            await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
            await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        };

        loadModels();
        const video = videoRef.current;
        navigator.mediaDevices.getUserMedia({ video: {} })
            .then((stream) => {
                video.srcObject = stream;
            });

        video.addEventListener('play', () => {
            const canvas = faceapi.createCanvasFromMedia(video);
            document.body.append(canvas);
            const displaySize = { width: video.width, height: video.height };
            faceapi.matchDimensions(canvas, displaySize);

            setInterval(async () => {
                const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                faceapi.draw.drawDetections(canvas, resizedDetections);
                faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
            }, 100);
        });
    }, []);

    return (
        <div>
            <video ref={videoRef} autoPlay muted style={{ width: '100%', height: 'auto' }} />
        </div>
    );
};

export default FaceDetection;
