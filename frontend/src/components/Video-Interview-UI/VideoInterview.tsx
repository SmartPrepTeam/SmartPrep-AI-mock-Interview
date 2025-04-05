import { useState, useRef, useEffect, useCallback } from 'react';
import Timer from './Timer';
import { useNavigate } from 'react-router-dom';
import Typewriter from '@/Typewriter';
import { QuestionPageContentProps } from '@/types/questionTypes';
import useSpeechToText from 'react-hook-speech-to-text';
import {
  useDeleteIncompleteInterviewMutation,
  useGetScoresForVideosMutation,
  useDeleteQuestionFramesMutation,
} from '@/features/apiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import axios from 'axios';
import toast from 'react-hot-toast';
import { activePage } from '@/features/activePageSlice';
import { setVideoScoreData } from '@/features/videoScoreSlice';
import { Button } from '../ui/button';
import { useWebRTC } from '@/hooks/use-webrtc';
import useBackButtonHandler from '@/hooks/use-back-button';

const VideoInterview = ({
  questions,
  question_id,
  // question_id == interview_id
}: QuestionPageContentProps) => {
  // values for building WEBRTC connection
  const {
    localStream,
    initiateCall,
    dataChannel,
    updateTracksStatus,
    cleanUpConnection,
  } = useWebRTC();
  const [isStreamingEnabled, setIsStreamingEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const dispatch = useDispatch();
  const user_id = useSelector((state: RootState) => state.auth.userId);
  const interview_id = useSelector(
    (state: RootState) => state.videoInterview.interviewId
  );
  // related to getting video
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  // related to timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [time, setTime] = useState(120);
  const [questionIndex, setQuestionIndex] = useState(0);
  // related to disabling the start button
  const [isQuestionDisplayed, setIsQuestionDisplayed] = useState(false);
  const navigate = useNavigate();
  const [transcript, setTranscript] = useState('');
  const [answers, setAnswers] = useState<string[]>(
    new Array(questions.length).fill('')
  );

  // For transcribing user's answers in real time
  const { error, interimResult, results, startSpeechToText, stopSpeechToText } =
    useSpeechToText({
      continuous: true,
      speechRecognitionProperties: {
        lang: 'en-US',
        interimResults: true,
      },
    });

  // Handling the back button
  useBackButtonHandler(question_id, user_id);
  // For getting his scores based on his answers
  const [getScoresForVideos, { isLoading }] = useGetScoresForVideosMutation();
  const [deleteIncompleteInterviewMutation] =
    useDeleteIncompleteInterviewMutation();
  const [deleteQuestionFrames] = useDeleteQuestionFramesMutation();
  // peer-to-peer connection will persist through page refreshes as well
  useEffect(() => {
    const setupConnection = async () => {
      const callStarted = await initiateCall();
      if (!callStarted) {
        navigate('/home');
        return;
      }
      console.log('Call initiated successfully');
    };

    if (!localStream && !hasEnded) {
      setupConnection();
    }
  }, [localStream, initiateCall, hasEnded, navigate]);

  const handleAnswer = () => {
    'Handles Speech to text , storing answers and timer';
    setIsRecording(true);
    startSpeechToText();
    setTranscript(''); // Clear old transcript when starting fresh
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[questionIndex] = ''; // Reset previous answer
      return updatedAnswers;
    });
    setTime(120); // reset timer
    timerRef.current = setInterval(
      () => setTime((prevTime) => prevTime - 1),
      1000
    ); // Increment time every sec
  };

  // runs for every question
  const startAnswering = () => {
    console.log('Tracks before enabling:', localStream?.getTracks());

    // First enable streaming in state
    setIsStreamingEnabled(true);

    // Update tracks status if the updateTracksStatus function is available
    if (typeof updateTracksStatus === 'function') {
      updateTracksStatus(true);
    } else {
      // Fallback if the function isn't exposed from the hook
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          track.enabled = true;
          console.log(
            `Track ${track.id} (${track.kind}) enabled: ${track.enabled}`
          );
        });
      }
    }

    console.log('Tracks after enabling:', localStream?.getTracks());

    // Start recording answer
    handleAnswer();
  };

  // sending question_id to identify streams on backend
  useEffect(() => {
    const sendMetaData = () => {
      if (dataChannel && dataChannel.readyState === 'open') {
        console.log('Sending question metadata...');

        dataChannel.send(
          JSON.stringify({
            question_no: questionIndex,
            user_id,
            interview_id,
            processStream: isStreamingEnabled,
          })
        );
      } else if (dataChannel) {
        console.log('Data channel not open yet, waiting...');

        // Listen for DataChannel to open and then send metadata
        dataChannel.onopen = () => {
          console.log('Data channel opened, sending question metadata...');
          dataChannel.send(
            JSON.stringify({
              question_no: questionIndex,
              user_id,
              interview_id,
              processStream: isStreamingEnabled,
            })
          );
        };
      }
    };
    if (dataChannel) {
      sendMetaData();
    }
  }, [dataChannel, questionIndex, user_id, interview_id, isStreamingEnabled]);

  // Used when time is up or when user stops recording his answer
  const stopRecording = useCallback(async () => {
    setIsStreamingEnabled(false);
    // Update tracks status if the updateTracksStatus function is available
    if (typeof updateTracksStatus === 'function') {
      updateTracksStatus(true);
    } else {
      // Fallback if the function isn't exposed from the hook
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          track.enabled = false;
          console.log(
            `Track ${track.id} (${track.kind}) enabled: ${track.enabled}`
          );
        });
      }
    }
    stopSpeechToText();
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (time == 0 && transcript == '') {
      try {
        await deleteIncompleteInterviewMutation({
          question_id,
          user_id,
        }).unwrap();
        const disconnected = cleanUpConnection();
        if (!disconnected) {
          toast.error('Connection may still be alive');
        }
        setHasEnded(true);
        navigate('/video-interview/restart');
        toast.error('Interview terminated as no audio was detected');
      } catch (err) {
        toast.error(err?.data?.message);
      }
    }
    // Wait for some time (e.g., 2 seconds) to allow transcript
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsRecording(false);
  }, [
    time,
    transcript,
    updateTracksStatus,
    navigate,
    setIsRecording,
    setIsStreamingEnabled,
    cleanUpConnection,
    deleteIncompleteInterviewMutation,
    stopSpeechToText,
    localStream,
  ]);

  // stop recording when time is up
  useEffect(() => {
    const handleTimeUp = async () => {
      if (time == 0) {
        await stopRecording();
      }
    };
    handleTimeUp();
  }, [time, stopRecording]);

  // Used when user wants to re-record his answer
  const terminateRecording = async () => {
    setIsSubmitting(true);
    setIsStreamingEnabled(false);
    stopSpeechToText();
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    console.log(questionIndex, typeof questionIndex);
    // make call to backend and delete frames of that question
    try {
      await deleteQuestionFrames({
        interview_id,
        question_no: questionIndex,
        user_id,
      }).unwrap();
      toast.error('Your answer was not saved as you stopped recording');
    } catch (error) {
      toast.error('Failed to delete frames');
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsRecording(false);
    setIsSubmitting(false);
  };

  const handleNextQuestion = async () => {
    setIsSubmitting(true);
    stopRecording();
    // Wait for some time (e.g., 2 seconds) to allow interim results to become final
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setTranscript('');
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
      setIsQuestionDisplayed(false);
    } else {
      // submitting at the final question
      try {
        const disconnected = cleanUpConnection();
        if (!disconnected) {
          toast.error('Connection may still be alive');
        }
        const response = await getScoresForVideos({
          question_id,
          user_id,
          answers,
        }).unwrap();
        console.log(response);
        dispatch(setVideoScoreData(response.data));
        dispatch(activePage({ interviewType: 'video', page: 'insights' }));
        setHasEnded(true);
        navigate('/video-interview/result');
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 500) {
            toast.error('Unable to generate scores');
          }
        } else {
          toast.error('Unexpected error occurred');
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  //setting the stream
  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
      console.log('Video element:', videoRef.current);
      console.log('Local Stream being assigned:', localStream);
    }
  }, [localStream]);

  // speech to text : making transcription
  useEffect(() => {
    if (results.length > 0) {
      setTranscript((prev) => prev + ' ' + results[results.length - 1]);
    }
  }, [results]);

  // updating the answers in real time
  useEffect(() => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[questionIndex] = transcript;
      return updatedAnswers;
    });
  }, [transcript, questionIndex]);
  const handleCancellation = async () => {
    try {
      await deleteIncompleteInterviewMutation({
        question_id,
        user_id,
      }).unwrap();
      const disconnected = cleanUpConnection();
      if (!disconnected) {
        toast.error('Connection may still be alive');
      }
      setHasEnded(true);
      navigate('/home');
      toast.error('Interview Terminated');
    } catch (err) {
      toast.error(err?.data?.message);
    }
  };

  // At final answer submission
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Assessing the videos....
      </div>
    );
  }
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
              onClick={startAnswering}
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
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing....' : 'Submit'}
              </button>
              <button
                onClick={terminateRecording}
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
        <div className="flex-1 overflow-y-auto mb-4 ">
          <div className="space-y-2 ">
            <span className="text-sm text-[#cbd5e1] ">AI</span>
            <div className="bg-blue-500 text-white p-2 rounded-lg shadow-md">
              <Typewriter
                key={questionIndex}
                text={questions[questionIndex]}
                delay={100}
                onComplete={() => setIsQuestionDisplayed(true)}
              />
            </div>
            {(transcript || interimResult) && (
              <div className="flex flex-col space-y-2">
                <span className="text-sm text-[#cbd5e1] ml-auto">You</span>
                <div className="bg-blue-500 p-2 rounded-lg shadow-md ml-auto text-white">
                  {transcript}{' '}
                  {interimResult && (
                    <span className="opacity-50">{interimResult}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <Button
          onClick={handleCancellation}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Cancel Interview
        </Button>
      </div>
    </div>
  );
};

export default VideoInterview;
