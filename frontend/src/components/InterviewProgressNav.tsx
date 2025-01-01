import { useSelector } from 'react-redux';
interface RootState {
  activePage: {
    value: string;
  };
}

export default function InterviewProgressNav() {
  const activePage = useSelector((state: RootState) => state.activePage.value);
  console.log(activePage);
  return (
    <nav className="flex justify-between items-center p-4 ">
      <div className="text-display-3 p-4">SmartPrep</div>

      <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-4 rounded-t max-lg:mt-2 max-md:hidden font-bold text-xl">
        <span
          className={`text-lg ${activePage === 'intro' ? 'text-[#a9c6f5]' : 'text-gray-500'}`}
        >
          INTRO
        </span>
        <span className="text-gray-500 font-bold">-</span>
        <span
          className={`text-lg ${activePage === 'quiz' ? 'text-[#a9c6f5]' : 'text-gray-500'}`}
        >
          QUIZ
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
}
