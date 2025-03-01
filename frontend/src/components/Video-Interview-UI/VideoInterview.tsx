import { useState, useRef, useEffect } from 'react';
import Timer from './Timer';
import { useNavigate } from 'react-router-dom';
import Typewriter from '@/Typewriter';
import { QuestionPageContentProps } from '@/types/questionTypes';
import useSpeechToText from 'react-hook-speech-to-text';
import { useGetScoresForVideosMutation } from '@/features/apiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import axios from 'axios';
import toast from 'react-hot-toast';
import { activePage } from '@/features/activePageSlice';
import { setVideoScoreData } from '@/features/videoScoreSlice';
const VideoInterview = ({
  questions,
  question_id,
}: QuestionPageContentProps) => {
  const dispatch = useDispatch();
  const user_id = useSelector((state: RootState) => state.auth.userId);
  // related to getting video
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  // related to timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [time, setTime] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  // related to disabling the start button
  const [isQuestionDisplayed, setIsQuestionDisplayed] = useState(false);
  const navigate = useNavigate();
  const [transcript, setTranscript] = useState('');
  const [answers, setAnswers] = useState<string[]>(
    new Array(questions.length).fill('')
  );
  const { error, interimResult, results, startSpeechToText, stopSpeechToText } =
    useSpeechToText({
      continuous: true,
      speechRecognitionProperties: {
        lang: 'en-US',
        interimResults: true,
      },
    });
  const [getScoresForVideos, { isLoading, isError, error: errorScores }] =
    useGetScoresForVideosMutation();
  useEffect(() => {
    const getStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setMediaStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };
    getStream();

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = () => {
    setIsRecording(true);
    startSpeechToText();
    setTime(0); // reset timer
    timerRef.current = setInterval(
      () => setTime((prevTime) => prevTime + 1),
      1000
    ); // Increment time every sec
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }

    if (mediaStream) {
      const newMediaRecorder = new MediaRecorder(mediaStream);
      let chunks: BlobPart[] = [];

      newMediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      newMediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setRecordedBlob(blob);
        chunks = [];
      };

      newMediaRecorder.start();
      setMediaRecorder(newMediaRecorder);
    } else {
      console.error('No media stream available!');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    setIsRecording(false);
    stopSpeechToText();
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const resetStream = async () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }
    const newStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setMediaStream(newStream);
    if (videoRef.current) {
      videoRef.current.srcObject = newStream;
    }
  };

  const handleNextQuestion = async () => {
    stopRecording();
    setTranscript('');
    if (recordedBlob) {
      URL.revokeObjectURL(URL.createObjectURL(recordedBlob)); // Release old blob URL
    }

    await resetStream();
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
      setIsQuestionDisplayed(false);
    } else {
      // submitting at the final question
      try {
        const response = await getScoresForVideos({
          question_id,
          user_id,
          answers,
        }).unwrap();
        console.log(response);
        dispatch(setVideoScoreData(response.data));
        dispatch(activePage({ interviewType: 'video', page: 'insights' }));
        navigate('/video-interview/result');
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 500) {
            toast.error('Unable to generate scores');
          }
        } else {
          toast.error('Unexpected error occurred');
        }
      }
    }
  };
  if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;
  useEffect(() => {
    if (results.length > 0) {
      setTranscript((prev) => prev + ' ' + results[results.length - 1]);
    }
  }, [results]);
  useEffect(() => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[questionIndex] = transcript;
      return updatedAnswers;
    });
  }, [transcript, questionIndex]);
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
              disabled={!isQuestionDisplayed}
            >
              Start recording
            </button>
          ) : (
            <>
              <button
                onClick={handleNextQuestion}
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                Submit
              </button>
              <button
                onClick={stopRecording}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Terminate
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
            <div className="bg-[#a9c6f5]  p-2 rounded-lg shadow-md">
              <Typewriter
                key={questionIndex}
                text={questions[questionIndex]}
                delay={100}
                onComplete={() => setIsQuestionDisplayed(true)}
              />
            </div>
            {(transcript || interimResult) && (
              <div className="bg-[#a9c6f5]  p-2 rounded-lg shadow-md">
                {transcript}{' '}
                {interimResult && (
                  <span className="opacity-50">{interimResult}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoInterview;
