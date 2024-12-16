import { interviews } from '@/data';
import InterviewCard from './ui/InterviewCard';
const InterviewContainer = () => {
  return (
    <>
      <p>Welcome to</p>
      <h2 className="font-sans text-lg lg:text-3xl font-bold">
        SmartPrep Interview Practice
      </h2>
      <div className="my-4 gap-4 flex text-white">
        {interviews.map((interview) => {
          return <InterviewCard key={interview.id} interview={interview} />;
        })}
      </div>
    </>
  );
};

export default InterviewContainer;
