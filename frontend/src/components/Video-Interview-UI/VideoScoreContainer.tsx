import VideoInterviewScore from './VideoInterviewScore';
import VideoInterviewHeader from './VideoInterviewHeader';
const VideoScoreContainer = () => {
  return (
    <div className="text-white md:px-16 bg-black-100 min-h-screen w-full">
      <VideoInterviewHeader />
      <div className="my-8 text-center container mx-auto p-4">
        <h2 className="text-2xl mb-4 ">
          Great effort! Use this{' '}
          <span className="text-[#a9c6f5]">Feedback</span> to refine your
          approach
        </h2>
      </div>
      <VideoInterviewScore />
    </div>
  );
};

export default VideoScoreContainer;
