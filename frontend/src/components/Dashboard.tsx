import { useDispatch } from 'react-redux';
import InterviewContainer from './InterviewContainer';
import RecentInterviews from './RecentInterviews';
import { useEffect } from 'react';
import { resetActivePage } from '@/features/activePageSlice';
export const Dashboard = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetActivePage());
  }, [dispatch]);
  return (
    <div className="flex flex-1">
      <div
        className="p-2 md:p-10 rounded-tl-2xl border border-white/[0.1] dark:border-neutral-700 bg-black-100 flex flex-col gap-2 flex-1 w-screen h-full text-white"
        style={{
          background: 'rgb(4,7,29)',
          backgroundColor:
            'linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(23, 25, 48,1) 100%)',
        }}
      >
        <InterviewContainer />
        <RecentInterviews />
      </div>
    </div>
  );
};
