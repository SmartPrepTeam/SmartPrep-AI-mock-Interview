import { IconPlayerPlay } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
interface InterviewDetails {
  title: string;
  description: string;
  linkHref: string;
  img: string;
}
const InterviewCard = ({ interview }: { interview: InterviewDetails }) => {
  const navigate = useNavigate();
  const handleStartInterview = () => {
    navigate(interview.linkHref);
  };
  return (
    <section className="flex flex-col border border-white/[0.1] rounded-3xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none">
      <div
        className="relative overflow-hidden h-[25vh] w-[35vh] justify-between flex flex-col"
        style={{
          background: 'rgb(4,7,29)',
          backgroundColor:
            'linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)',
        }}
      >
        {/* Image */}
        <div className={'flex justify-center h-full'}>
          <div className="w-full h-full absolute">
            <img
              src={interview.img}
              alt="logo"
              className="w-full h-full object-cover object-center "
            />
          </div>
        </div>
        {/* Title and Description */}
        <div className="group-hover/bento:translate-x-2 transition duration-200 relative h-full min-h-40 flex flex-col px-5 p-5 lg:p-10 text-white justify-start">
          <div className="font-sans font-extralight md:max-w-42 md:text-xs lg:text-base text-sm text-[#C1C2D3] z-50">
            {interview.description}
          </div>
          <div
            className={`font-sans text-lg lg:text-3xl max-w-96 font-bold z-50`}
          >
            {interview.title}
          </div>
        </div>
      </div>
      {/* play button */}
      <div className="relative h-12 border border-white/[0.1] rounded-b-3xl">
        <div
          className="w-16 group-hover:w-[72px] duration-200  aspect-square flex items-center justify-center bg-white border rounded-full overflow-hidden ring-2 ring-white shadow-md ease-in-out absolute -top-7 right-4"
          onClick={handleStartInterview}
        >
          <IconPlayerPlay className="text-neutral-800 h-6 w-6 flex-shrink-0 z-10" />
        </div>
      </div>
    </section>
  );
};

export default InterviewCard;
