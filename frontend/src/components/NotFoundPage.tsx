import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  const handleHomeNavigation = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col justify-center items-center text-center h-screen bg-black">
      <h1 className="text-8xl font-bold text-white transform transition duration-300 hover:scale-110">
        404
      </h1>
      <p className="text-lg text-gray-500 mt-4">
        Sorry, the page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Button className="mt-4" onClick={handleHomeNavigation}>
        Return to website
      </Button>
    </div>
  );
}
