import React from 'react';
import { useSelector } from 'react-redux';
import Question from './Question';
import Answer from './Answer';
import { Feedback } from '../../features/InsightsSlice';

type stateType = {
  historyInsights: {
    feedback: Feedback;
    answers: string[];
    questions: string[];
  };
};
const QAInsights: React.FC = () => {
  const Questions = useSelector(
    (state: stateType) => state.historyInsights.questions
  );
  const Answers = useSelector(
    (state: stateType) => state.historyInsights.answers
  );
  console.log('analysis history: ', Questions);

  //   const validInterviewId = interviewId ?? '';
  //   const userId = useSelector((state: RootState) => state.auth.userId);

  //   useEffect(() => {
  //     const fetchQAData = async () => {
  //       try {
  //         if (!userId) {
  //           console.error('User ID is null. Cannot fetch data.');
  //           return;
  //         }

  //         const url = `http://127.0.0.1:8000/api/interviews/questions/${encodeURIComponent(
  //         validInterviewId
  //         )}?user_id=${encodeURIComponent(userId)}`;

  //         const response = await axios.get(url);

  //         if (response.status === 200) {
  //           setQuestions(response.data.questions || []);
  //           setAnswers(response.data.answers || []);
  //         }
  //       } catch (error) {
  //         console.error('Error fetching QA data:', error);
  //       }
  //     };

  //     fetchQAData();
  //   }, [validInterviewId, userId]);

  return (
    <div className="h-full flex justity-center items-center lg:w-[900px] md:w-[300] md:m-9 m-9 flex-col  text-white  ">
      {Questions.map((question: string, index: number) => (
        <div className="mb-3 md:mb-9 p-3 bg-[#10132E] rounded-sm">
          <Question question={question} index={index} />

          <Answer answer={Answers[index]} />
        </div>
      ))}
    </div>
  );
};

export default QAInsights;
