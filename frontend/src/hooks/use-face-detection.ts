import * as faceapi from 'face-api.js';
import { useRef, useEffect, useState, useCallback } from 'react';
import { useDeleteIncompleteInterviewMutation } from '@/features/apiSlice';
import { useWebRTC } from './use-webrtc';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface FaceDetectionResult {
  facePresent: boolean;
  remainingTime: number | null;
  status: 'present' | 'warning' | 'absent' | 'initializing';
}

export const useFaceDetection = (
  absenceThreshold = 3000,
  externalVideoRef: React.RefObject<HTMLVideoElement> | null = null,
  question_id: string
) => {
  const [detectionResult, setDetectionResult] = useState<FaceDetectionResult>({
    facePresent: false,
    remainingTime: null,
    status: 'initializing',
  });
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [deleteIncompleteInterviewMutation] =
    useDeleteIncompleteInterviewMutation();
  const videoRef = externalVideoRef || useRef<HTMLVideoElement | null>(null);
  const lastFacePresentRef = useRef<boolean>(false);
  const faceAbsentStartTimeRef = useRef<Date | null>(null);
  const intervalRef = useRef<number | null>(null);
  const user_id = useSelector((state: RootState) => state.auth.userId);
  const navigate = useNavigate();
  const { dataChannel, cleanUpConnection } = useWebRTC();

  // Load face detection models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        ]);
        setIsReady(true);
        console.log('Face detection models loaded successfully');
      } catch (error) {
        console.error('Error loading face detection models:', error);
      }
    };

    loadModels();

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Function to terminate interview due to face absence
  const terminateInterviewDueToFaceAbsence = useCallback(async () => {
    console.log('Terminating interview due to face absence');

    // First, send termination message via data channel
    if (dataChannel?.readyState === 'open') {
      try {
        const terminationMessage = JSON.stringify({
          type: 'termination',
          user_id,
          interview_id: question_id,
          reason: 'face_absence',
        });

        console.log('Sending termination message:', terminationMessage);
        dataChannel.send(terminationMessage);

        // Add a small delay to ensure message is sent before closing connection
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (err) {
        console.error('Failed to send termination message:', err);
      }
    } else {
      console.error('DataChannel not ready for sending termination message');
    }

    // Then perform cleanup and navigation
    try {
      await deleteIncompleteInterviewMutation({
        question_id,
        user_id,
      }).unwrap();

      const disconnected = cleanUpConnection();
      if (!disconnected) {
        toast.error('Connection may still be alive');
      }

      navigate('/home');
      toast.error('Interview Terminated - Face not detected');
    } catch (err) {
      console.error('Error during interview termination:', err);
      toast.error(err?.data?.message || 'Failed to terminate interview');
    }

    // Finally stop the detection process
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsRunning(false);
  }, [
    dataChannel,
    user_id,
    question_id,
    deleteIncompleteInterviewMutation,
    cleanUpConnection,
    navigate,
  ]);

  // Start face detection
  const startFaceCheck = useCallback(() => {
    console.log('models loaded ', isReady);
    console.log('video ka masla hai ', videoRef.current);
    if (!videoRef.current || !isReady) {
      console.error('Video reference not set or models not loaded');
      return;
    }

    setIsRunning(true);
    lastFacePresentRef.current = false;
    faceAbsentStartTimeRef.current = null;

    const options = new faceapi.TinyFaceDetectorOptions({
      inputSize: 224,
      scoreThreshold: 0.5,
    });

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start new detection interval
    intervalRef.current = window.setInterval(async () => {
      if (!videoRef.current) return;

      try {
        // Detect faces
        const detections = await faceapi.detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions(options)
        );
        console.log('Face detection running');
        const facePresent = detections.length > 0;
        let status: 'present' | 'warning' | 'absent' = facePresent
          ? 'present'
          : 'absent';
        let remainingTime: number | null = null;

        if (facePresent) {
          // Face is present
          faceAbsentStartTimeRef.current = null;

          if (!lastFacePresentRef.current) {
            console.log('Face detected at:', new Date().toLocaleTimeString());
          }
        } else {
          // Face is not present
          if (faceAbsentStartTimeRef.current === null) {
            // First frame with no face
            faceAbsentStartTimeRef.current = new Date();
            status = 'warning';
            console.log('Face missing at:', new Date().toLocaleTimeString());
          } else {
            // Check how long the face has been absent
            const absentDuration =
              new Date().getTime() - faceAbsentStartTimeRef.current.getTime();

            if (absentDuration < absenceThreshold) {
              // Still within threshold
              remainingTime = Math.ceil(
                (absenceThreshold - absentDuration) / 1000
              );
              status = 'warning';
              console.log(
                `Warning: No face detected! Stopping in ${remainingTime}s...`
              );
            } else {
              // Exceeded threshold - terminate the interview
              console.log(
                'Face absence threshold exceeded. Terminating interview.'
              );

              // Clear the interval here to prevent multiple calls
              clearInterval(intervalRef.current);
              intervalRef.current = null;

              // Call the termination function
              terminateInterviewDueToFaceAbsence();
              return;
            }
          }
        }

        // Update state with detection results
        setDetectionResult({
          facePresent,
          remainingTime,
          status,
        });

        lastFacePresentRef.current = facePresent;
      } catch (error) {
        console.error('Error during face detection:', error);
      }
    }, 300);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isReady, absenceThreshold, terminateInterviewDueToFaceAbsence]);

  // Stop face detection
  const stopFaceCheck = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    console.log('Face detection stopped');
  }, []);

  return {
    isReady,
    isRunning,
    startFaceCheck,
    stopFaceCheck,
    detectionResult,
    terminateInterviewDueToFaceAbsence,
  };
};
