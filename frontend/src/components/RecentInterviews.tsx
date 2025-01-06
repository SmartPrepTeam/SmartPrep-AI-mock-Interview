import { useGetRecentInterviewsQuery } from '@/features/apiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import useInfiniteScroll from '@/hooks/use-infinite-scroll';
const RecentInterviews = () => {
  const user_id = useSelector((state: RootState) => state.auth.userId);
  const {
    recentInterviews,
    isLoading,
    isFetchingNextPage,
    lastItemRef,
    isError,
  } = useInfiniteScroll(useGetRecentInterviewsQuery, { user_id });
  return (
    <div>
      <p className="font-sans text-lg lg:text-xl font-bold">
        Recent Interviews
      </p>
      {isLoading ? (
        <div>Loading....</div>
      ) : (
        <>
          {isError && (
            <div className="w-full items-center">Error fetching interviews</div>
          )}
          {recentInterviews.map((interview, index) => {
            return (
              <div
                className="flex w-full justify-between gap-4"
                key={interview.id}
                ref={index === recentInterviews.length - 1 ? lastItemRef : null}
              >
                {interview.question_type === 'text' ? (
                  <img src="./tortoise.svg" alt="" />
                ) : (
                  <img src="./tortoise.svg" alt="" />
                )}
                <div>
                  <p>
                    {interview.job_title} {interview.difficulty_level}
                  </p>
                  <p>{interview.job_description}</p>
                </div>
                <button>Delete</button>
              </div>
            );
          })}
          {isFetchingNextPage && <div>Loading More.....</div>}
        </>
      )}
    </div>
  );
};

export default RecentInterviews;
