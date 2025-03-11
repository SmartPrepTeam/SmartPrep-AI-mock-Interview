import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import VideoInterviewHeader from './VideoInterviewHeader';

export default function NotFoundPage() {
  const navigate = useNavigate();

  const handleInterviewNavigation = () => {
    navigate('/video-interview');
  };

  return (
    <div className="h-screen">
      <VideoInterviewHeader />
      <div className="flex flex-col justify-center items-center text-center h-full bg-black-100">
        <h1 className="text-8xl font-bold text-white transform transition duration-300 hover:scale-110">
          Error
        </h1>
        <p className="text-lg text-gray-500 mt-4">
          Sorry, could not hear anything.
        </p>
        <Button className="mt-4" onClick={handleInterviewNavigation}>
          Restart the Interview
        </Button>
      </div>
    </div>
  );
}
