import React, { useState, useRef, useEffect } from 'react';
import Timer from './Timer';
import { useNavigate } from 'react-router-dom';

const VideoInterview: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [time, setTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);  
 
  
  const navigate = useNavigate();

 
  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        streamRef.current = stream;
      } catch (err) {
        console.error('Error accessing the camera:', err);
      }
    };

    startVideo();

    return () => {
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

   const startRecording = () => {
    if (streamRef.current) {
      const mediaRecorder = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        setRecordedChunks((prev) => [...prev, event.data]);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        const videoElement = document.createElement('video');
        videoElement.src = videoUrl;
        videoElement.controls = true;
       
      };

      mediaRecorder.start();
      setIsRecording(true);


          // Start the timer
          setTime(0); // reset timer
          timerRef.current = setInterval(() => setTime((prevTime) => prevTime + 1), 1000); // Increment time every sec
        
    }
  };

  // Stop recording the video without saving it
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);

      if (timerRef.current) {
      clearInterval(timerRef.current);
      
    }
  };

   const handleSubmit = () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const videoUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
     navigate('/video-interview/result')
    //a.href = videoUrl;
    //a.download = 'interview-video.webm';
    //a.click();
  };

   const terminateRecording = () => {
    setRecordedChunks([]); // Clear recorded chunks
    setIsRecording(false);  // Reset the recording state
    // reseting the video display
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
    }
     

    // Stop the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    navigate('/home');
  };

    
  return (


    <div className="flex h-screen p-11 bg-black-100 flex-col md:flex-row">
      
       <div className="flex-1 flex flex-col items-center justify-center mt-11 ">
        <div className="mb-4 relative">
            <Timer time={time} isRecording={isRecording}></Timer>
             <video
            ref={videoRef}
            autoPlay
            muted
            className="border-2 border-gray-400 w-full h-full  "
        
          ></video>
         
         
        </div>
        <div className="flex gap-4 mb-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Start recording
            </button>
          ) : (
            <>
              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                Submit Interview
              </button>
              <button
                onClick={terminateRecording}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Terminate Interview
              </button>
            </>
          )}
        </div>
      </div>

   <div className="w-1/3 bg-[#10132E] p-4 flex flex-col rounded-md hidden md:flex"> 
  <div className="text-lg font-bold mb-4 text-white">Transcript</div>
    <div className="flex-1 overflow-y-auto mb-4">
       <div className="space-y-2">
      <span className="text-sm text-[#a9c6f5] ">AI</span> 
        <div className="bg-[#a9c6f5]  p-2 rounded-lg shadow-md">Hi, How are you?</div>
        <div className="bg-[#a9c6f5]  p-2 rounded-lg shadow-md">Shall we start the Interview!</div>
       </div>
    </div>
    
  </div>
</div>
  );
};

export default VideoInterview;
