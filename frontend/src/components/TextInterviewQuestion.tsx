import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { activePage } from '@/features/activePageSlice';
import { setTextScoreData } from '@/features/textScoreSlice';
import { ENDPOINTS } from '@/api/api-config';
import axios from 'axios';
import { QuestionPageContentProps } from '@/types/questionTypes';
import MagicButton from './ui/MagicButton';
import {
  NavigationBundle,
  NavigationContext,
} from '@/context/navigation_context';
export default function TextInterviewQuestion({
  questions,
  user_id,
  question_id,
}: QuestionPageContentProps) {
  // useEffect(() => {
  //   const { from, to } = useContext<NavigationBundle>(NavigationContext);
  //   console.log(from);
  //   console.log(to);
  // }, []);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(
    new Array(questions.length).fill('')
  );
  const [feedback, setFeedback] = useState('');

  const handleAnswerChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = event.target.value;
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFeedback('');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFeedback('');
    }
  };

  const handleSubmit = async () => {
    console.log(answers);
    try {
      const response = await axios.post(
        `${ENDPOINTS.textual_interview.score_generation}/${question_id}?user_id=${user_id}`,
        {
          answers: answers,
        }
      );

      console.log('Response from backend on submission:', response.data);
      dispatch(setTextScoreData(response.data.data));
      dispatch(activePage('insights'));
      history.pushState({ phase: 'quiz' }, 'Phase: quiz', '/textual-interview');
      navigate('/textual-interview/results');
    } catch (error) {
      console.error('Error submitting answers:', error);
      alert('An error occurred while submitting answers. Please try again.');
    }
  };

  const handleGenerateFeedback = async () => {
    const currentQuestion = questions[currentIndex];
    const currentAnswer = answers[currentIndex];

    try {
      const response = await axios.post(
        ENDPOINTS.textual_interview.feedback,
        null,
        {
          params: {
            question: currentQuestion.question,
            answer: currentAnswer,
          },
        }
      );
      setFeedback(response.data.data.Improvements);
    } catch (error) {
      console.error('Error:', error);
      setFeedback('Unable to generate feedback, try again.');
    }
  };

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const isFirstQuestion = currentIndex === 0;

  return (
    <div className="p-6 min-h-screen flex justify-center items-center mt-[50px] lg:mt-[-50px]">
      <div className="max-w-6xl bg-[#10132E] p-6 rounded-lg shadow-md w-full border border-white/[0.1] flex flex-col lg:flex-row  ">
        <div className="w-full lg:w-2/3 pr-4 mx-auto lg:mx-0">
          <div className="mb-4">
            <div className="text-white inline-block font-bold py-2 rounded-lg text-lg">
              Question {currentIndex + 1}
            </div>
            <div className="mt-2 font-bold text-lg py-3">
              <p>{currentQuestion?.question}</p>
            </div>
          </div>
          <hr className="h-0.5 mb-3 bg-gray-300 border-0" />
          <div className="mb-4">
            <div className="font-bold text-lg">Your Answer:</div>
            <textarea
              // className="mt-2 p-4 bg-slate-950 border border-white/[0.1] rounded-lg w-full h-auto"
              className="w-full p-4 rounded-sm shadow-custom focus:outline-none focus:border-transparent text-sm md:text-lg font-light resize-none bg-slate-950 border border-white/[0.1]"
              placeholder="Write your answer here"
              value={answers[currentIndex]}
              onChange={(e) => handleAnswerChange(e, currentIndex)}
              rows={5}
              maxLength={5000}
            />
          </div>

          <div className="flex flex-col md:flex-row items-start md:justify-between md:items-center">
            <button
              className="flex items-center"
              onClick={handleGenerateFeedback}
            >
              <MagicButton title="Generate Feedback" position="right" />
            </button>
            <div className="flex flex-col md:flex-row mt-2 md:mt-0 gap-2">
              {!isFirstQuestion && (
                <button
                  className={`relative inline-flex h-12 w-full md:w-auto md:mt-8 overflow-hidden rounded-lg bg-gray-600 text-white p-[1px] shadow-md focus:outline-none hover:bg-gray-700`}
                  onClick={handlePrev}
                >
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-gray-600 text-sm font-medium text-white px-7 py-3">
                    Prev
                  </span>
                </button>
              )}
              {isLastQuestion ? (
                <button
                  className={`relative inline-flex h-12 w-full md:w-auto md:mt-8 overflow-hidden rounded-lg p-[1px] shadow-md focus:outline-none bg-green-600 hover:bg-green-700`}
                  onClick={handleSubmit}
                >
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-green-600 text-sm font-medium text-white px-7 py-3">
                    Submit
                  </span>
                </button>
              ) : (
                <button
                  className={`relative inline-flex h-12 w-full md:w-auto md:mt-8 overflow-hidden rounded-lg bg-[#a9c6f5] text-slate-950 p-[1px] shadow-md focus:outline-none hover:bg-[#5d7396]`}
                  onClick={handleNext}
                >
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-[#a9c6f5] text-sm font-medium text-slate-950 px-7 py-3">
                    Next
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="w-full mx-auto lg:mx-0 lg:w-1/3 mt-4 lg:mt-0 bg-[#10132E] border border-white/[0.1] rounded-lg">
          <div className="w-full">
            <div className="p-4 bg-slate-950 w-full rounded-t-lg">
              <div className="font-bold text-lg">AI Generated Feedback</div>
            </div>
            <div className="p-4">
              <div className=" min-h-[300px]">
                {feedback ||
                  'Enhance your responses by receiving AI-generated feedback tailored to your answer.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
