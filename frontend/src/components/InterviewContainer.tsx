import { interviews } from '@/data';
import InterviewCard from './ui/InterviewCard';
// For the interviews section on the dashboard
const InterviewContainer = () => {
  return (
    <>
      <p>Welcome to</p>
      <h2 className="font-sans text-lg lg:text-3xl font-bold">
        SmartPrep Interview Practice
      </h2>
      <div className="my-4 gap-4 flex w-full overflow-x-auto text-white">
        {interviews.map((interview) => {
          return <InterviewCard key={interview.id} interview={interview} />;
        })}
      </div>
    </>
  );
};

export default InterviewContainer;
