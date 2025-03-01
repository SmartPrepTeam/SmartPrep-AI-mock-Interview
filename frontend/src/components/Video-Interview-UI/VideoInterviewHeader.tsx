import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/redux/store';

const VideoInterviewHeader = () => {
  const navigate = useNavigate();
  const handleHomeNavigation = () => {
    navigate('/home');
  };
  const activePage = useSelector((state: RootState) => state.activePage.video);
  return (
    <nav className="flex justify-between items-center p-4 bg-black-100 ">
      <div className="text-display-3 p-4" onClick={handleHomeNavigation}>
        SmartPrep
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-4 rounded-t max-lg:mt-2 max-md:hidden font-bold text-xl">
        <span
          className={`text-lg ${activePage === 'intro' ? 'text-[#a9c6f5]' : 'text-gray-500'}`}
        >
          INTRO
        </span>
        <span className="text-gray-500 font-bold">-</span>
        <span
          className={`text-lg ${activePage === 'interview' ? 'text-[#a9c6f5]' : 'text-gray-500'}`}
        >
          INTERVIEW
        </span>
        <span className="text-gray-500 font-bold">-</span>
        <span
          className={`text-lg ${activePage === 'insights' ? 'text-[#a9c6f5]' : 'text-gray-500'}`}
        >
          INSIGHTS
        </span>
      </div>
    </nav>
  );
};

export default VideoInterviewHeader;
