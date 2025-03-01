import TextInterviewScore from './TextInterviewScore';
import InterviewProgressNav from './InterviewProgressNav';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { activePage } from '@/features/activePageSlice';
const TextScoreContainer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleFormNavigation = () => {
    dispatch(activePage({ interviewType: 'text', page: 'intro' }));
    navigate('/textual-interview/setup');
  };
  const scoreData = useSelector((state: RootState) => state.score.data);
  if (!scoreData) {
    <div className="bg-black-100">
      <InterviewProgressNav />
      <div className="text-white md:px-16 bg-black-100 min-h-screen w-full flex flex-col justify-center items-center">
        <p>Please go back and set up a new interview</p>
        <Button className="mt-4" onClick={handleFormNavigation}>
          Return to Setup
        </Button>
      </div>
      ;
    </div>;
  }
  return (
    <div className="text-white md:px-16 bg-black-100 min-h-screen w-full">
      <InterviewProgressNav />
      <div className="my-8 text-center container mx-auto p-4">
        <h2 className="text-2xl mb-4 ">
          Great effort! Use this{' '}
          <span className="text-[#a9c6f5]">Feedback</span> to refine your
          approach
        </h2>
      </div>
      <TextInterviewScore />
    </div>
  );
};

export default TextScoreContainer;
