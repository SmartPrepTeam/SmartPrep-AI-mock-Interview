import { useState, useRef, useEffect } from 'react';
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

const VideoInterview = ({
  questions,
  question_id,
}: QuestionPageContentProps) => {
  // values for building WEBRTC connection
  const {
    localStream,
    initiateCall,
    dataChannel,
    setLocalStream,
    peerConnectionRef,
    socket,
    updateTracksStatus,
  } = useWebRTC();
  const [isStreamingEnabled, setIsStreamingEnabled] = useState(false);
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

  // For getting his scores based on his answers
  const [getScoresForVideos, { isLoading }] = useGetScoresForVideosMutation();
  const [deleteIncompleteInterviewMutation] =
    useDeleteIncompleteInterviewMutation();
  const [deleteQuestionFrames] = useDeleteQuestionFramesMutation();
  // peer-to-peer connection will persist through page refreshes as well
  useEffect(() => {
    const setupConnection = async () => {
      try {
        await initiateCall();
        console.log('Call initiated successfully');
      } catch (error) {
        console.error('Failed to initiate call:', error);
      }
    };

    if (!localStream) {
      setupConnection();
    }
  }, [localStream, initiateCall]);

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
  const stopRecording = () => {
    setIsRecording(false);
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
      navigate('/video-interview/restart');
    }
  };

  // stop recording when time is up
  useEffect(() => {
    if (time == 0) {
      stopRecording();
    }
  }, [time, stopRecording]);

  // Used when user wants to re-record his answer
  const terminateRecording = async () => {
    setIsRecording(false);
    setIsStreamingEnabled(false);
    stopSpeechToText();
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    // make call to backend and delete frames of that question
    await deleteQuestionFrames({ interview_id, questionIndex, user_id });
    toast.error('Your answer was not be saved as you stopped recording');
  };

  const handleNextQuestion = async () => {
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
        const response = await getScoresForVideos({
          question_id,
          user_id,
          answers,
        }).unwrap();
        console.log(response);
        dispatch(setVideoScoreData(response.data));
        dispatch(activePage({ interviewType: 'video', page: 'insights' }));
        navigate('/video-interview/result');
        disconnectFromServer();
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
  const disconnectFromServer = () => {
    // Close the peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Close the data channel
    if (dataChannel) {
      dataChannel.close();
    }

    // Stop all tracks in the local stream
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    // Notify the signaling server that the user is disconnecting
    socket.emit('disconnect');
  };
  const handleCancellation = async () => {
    try {
      await deleteIncompleteInterviewMutation({
        question_id,
        user_id,
      }).unwrap();
      disconnectFromServer();
      navigate('/home');
      toast.error('Interview Terminated');
    } catch (err) {
      toast.error(err?.data?.message);
    }
  };

  // At final answer submission
  if (isLoading) {
    <div className="flex h-screen items-center justify-center">
      Assessing the videos....
    </div>;
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
              >
                Submit
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
