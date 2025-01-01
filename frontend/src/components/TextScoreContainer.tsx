import TextInterviewScore from './TextInterviewScore';
import InterviewProgressNav from './InterviewProgressNav';

const TextScoreContainer = () => {
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
