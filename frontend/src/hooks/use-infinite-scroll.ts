import { useState, useEffect, useRef, useCallback } from 'react';

interface QueryResponse {
  data: {
    results: any[];
    hasNextPage: boolean;
  };
}
interface QueryArgs {
  user_id: string | null;
  page?: number;
}
enum Difficulty {
  easy = 'easy',
  medium = 'medium',
  hard = 'hard',
}
enum InterviewType {
  text = 'text',
  video = 'video',
}
interface Interview {
  job_description: string;
  job_title: string;
  difficulty_level: Difficulty;
  no_of_questions: number;
  user_id: string;
  id: string;
  question_type: InterviewType;
  createdAt: Date;
}
const useInfiniteScroll = (
  query: (args: QueryArgs) => {
    data?: QueryResponse;
    isLoading: boolean;
    error?: any;
    isError: boolean;
    isFetching: boolean;
  },
  queryArgs: QueryArgs
) => {
  const [page, setPage] = useState(1);
  const { data, error, isLoading, isFetching, isError } = query({
    ...queryArgs,
    page,
  }); // Pass id and page
  const [recentInterviews, setRecentInterviews] = useState<Interview[]>([]);
  const observer = useRef<IntersectionObserver | null>(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  console.log(data);
  useEffect(() => {
    if (data && data.data.results) {
      setRecentInterviews((prevItems) => [...prevItems, ...data.data.results]);
      setHasNextPage(data.data.hasNextPage);
    }
  }, [data]);
  const lastItemRef = useCallback(
    (node: HTMLElement | null) => {
      if (isFetching || !hasNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetching, hasNextPage]
  );
  return {
    recentInterviews,
    error,
    isLoading,
    isError,
    lastItemRef,
    isFetchingNextPage: isFetching,
  };
};
export default useInfiniteScroll;
