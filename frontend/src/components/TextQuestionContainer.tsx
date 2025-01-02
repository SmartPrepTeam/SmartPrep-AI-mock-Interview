import TextInterviewQuestion from './TextInterviewQuestion';
import InterviewProgressNav from './InterviewProgressNav';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export default function TextQuestionContainer() {
  const { questions, interviewId } = useSelector(
    (state: RootState) => state.quiz
  );

  if (!interviewId || questions.length === 0) {
    return <div>No quiz data available. Please go back and set up a quiz.</div>; //we can add a loading component or ay thing else
  }

  return (
    <div className="text-white md:px-16 bg-black-100 min-h-screen w-full">
      <InterviewProgressNav />
      <TextInterviewQuestion questions={questions} question_id={interviewId} />
    </div>
  );
}
