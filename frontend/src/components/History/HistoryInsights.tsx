import { useState, useEffect } from 'react';
import { Feedback } from '../../helper/FeedbackList';
import { QuestionsList } from '../../helper/QuestionsList';
import { AnswersList } from '../../helper/AnswersList';
import AnalysisButtons from './AnalysisButtons';
import QAInsights from './QAInsights';
import { useDispatch } from 'react-redux';
import Score from './Score';
import {
  setAnswers,
  setFeedback,
  setQuestions,
} from '../../features/InsightsSlice';
import { useNavigate } from 'react-router-dom';
function InterviewAnalysis() {
  const navigate = useNavigate();
  const [activePage, setActivepage] = useState<string>('Feedback');
  const [label, setLabel] = useState<string>('Feedback');
  console.log('insights');
  const dispatch = useDispatch();
  useEffect(() => {
    console.log('settings things');
    dispatch(setFeedback(Feedback));
    dispatch(setQuestions(QuestionsList));
    dispatch(setAnswers(AnswersList));
  });

  const onClickHandler = (page: string, label: string) => {
    setLabel(label);
    setActivepage(page);
  };
  return (
    <div className="bg-black-100 w-full flex flex-col  h-fit justity-center items-center pl-5">
      <h2
        className="w-full text-start mt-6 lg:text-xl"
        onClick={() => {
          navigate('/home');
        }}
      >
        SmartPrep
      </h2>
      <h1 className="text-white lg:text-3xl mt-7">{label}</h1>
      <div className="flex flex-row mb-3 ">
        <AnalysisButtons
          label="Feedback"
          isActive={activePage === 'Feedback'}
          onClick={() => onClickHandler('Feedback', 'Feedback')}
        />
        <AnalysisButtons
          label="Q/A"
          isActive={activePage === 'Q/A'}
          onClick={() => onClickHandler('Q/A', 'Q/A')}
        />
      </div>
      {/* {activePage==='Feedback' && <TextInterviewScore/>} */}
      {activePage === 'Feedback' && <Score />}
      {activePage === 'Q/A' && <QAInsights />}
    </div>
  );
}

export default InterviewAnalysis;
