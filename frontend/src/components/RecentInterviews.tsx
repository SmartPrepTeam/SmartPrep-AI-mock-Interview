import { useGetRecentInterviewsQuery } from '@/features/apiSlice';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { RootState } from '@/redux/store';
import useInfiniteScroll from '@/hooks/use-infinite-scroll';
import { FileText, Video } from 'lucide-react';
const RecentInterviews = () => {
  const user_id = useSelector((state: RootState) => state.auth.userId);

  const { recentInterviews, isLoading, lastItemRef, isError } =
    useInfiniteScroll(useGetRecentInterviewsQuery, { user_id });
  console.log(recentInterviews);
  // Merge initial data with infinite scrolling data
  const allInterviews = [...recentInterviews];

  return (
    <div className="md:flex-1 overflow-y-auto md:max-w-screen-2xl">
      <div
        className="sticky top-0 z-10"
        style={{
          background: 'rgb(4,7,29)',
          backgroundColor:
            'linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(23, 25, 48,1) 100%)',
        }}
      >
        <p className="font-sans text-lg lg:text-xl font-bold">
          Recent Interviews
        </p>
      </div>
      {/* Handle loading and error for the initial fetch */}
      {isLoading ? (
        <div>Loading....</div>
      ) : isError ? (
        <div className="w-full items-center">
          Error fetching initial interviews
        </div>
      ) : (
        <div className="pt-5">
          {/* Render combined interview data */}
          {allInterviews.map((interview, index) => (
            <div
              className="flex w-full border border-white/[0.1] justify-between gap-6 mb-3 p-10 rounded-lg"
              key={interview.id}
              ref={index === allInterviews.length - 1 ? lastItemRef : null}
            >
              <div className="flex h-full items-center">
                {interview.question_type === 'text' ? <FileText /> : <Video />}
              </div>

              <div className="flex flex-col gap-3">
                <p>
                  {interview.job_title}{' '}
                  <span className="bg-[#a9c6f5] rounded-lg p-1 ml-4">
                    {interview.difficulty_level}
                  </span>
                </p>
                <p className="line-clamp-1">{interview.job_description}</p>
              </div>
            </div>
          ))}
          {/* Loading indicator for fetching more data */}
          {isLoading && <div>Loading More.....</div>}
          {/* Error indicator for fetching more data */}
          {isError && <div>Error fetching more interviews</div>}
        </div>
      )}
    </div>
  );
};

export default RecentInterviews;
