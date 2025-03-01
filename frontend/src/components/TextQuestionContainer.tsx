import TextInterviewQuestion from './TextInterviewQuestion';
import InterviewProgressNav from './InterviewProgressNav';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { activePage } from '@/features/activePageSlice';
import { useDispatch } from 'react-redux';
export default function TextQuestionContainer() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleFormNavigation = () => {
    dispatch(activePage({ interviewType: 'text', page: 'intro' }));
    navigate('/textual-interview/setup');
  };
  const { questions, interviewId } = useSelector(
    (state: RootState) => state.quiz
  );
  useEffect(() => {
    console.log(questions);
    console.log(interviewId);
  }, [questions, interviewId]);
  if (!interviewId || questions.length === 0) {
    return (
      <div className="bg-black-100">
        <InterviewProgressNav />
        <div className="text-white md:px-16 bg-black-100 min-h-screen w-full flex flex-col justify-center items-center">
          <p>Please go back and set up a new interview</p>
          <Button className="mt-4" onClick={handleFormNavigation}>
            Return to Setup
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white md:px-16 bg-black-100 min-h-screen w-full">
      <InterviewProgressNav />
      <TextInterviewQuestion questions={questions} question_id={interviewId} />
    </div>
  );
}
