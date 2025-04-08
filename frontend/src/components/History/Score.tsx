import CustomProgressBar from '../CustomProgressBar';
import AnimatedCircularProgressBar from '../ui/AnimatedCircularProgressBar';
import { useSelector } from 'react-redux';
import { Feedback } from '../../features/InsightsSlice';

type stateType = {
  historyInsights: {
    feedback: Feedback;
    answers: string[];
    questions: string[];
  };
};
const TextInterviewScore = () => {
  const scoreData = useSelector(
    (state: stateType) => state.historyInsights.feedback
  );
  console.log('Feedback history:', scoreData);
  if (!scoreData) {
    return <></>;
  }
  let score =
    (scoreData.Tone +
      scoreData.Accuracy +
      scoreData.Clarity +
      scoreData.Grammar) /
    4;

  return (
    <div className="flex justify-center items-start min-h-[70vh] px-3 lg:m-5 md:m-4 sm:m-3">
      <div className="grid grid-cols-[1fr,2fr,2fr] gap-4 md:gap-1 auto-rows-[minmax(160px,240px)]">
        {/* Feedback BOX c1,2r  */}
        <div className="col-span-3 md:col-span-1 lg:col-span-1  md:row-span-2 p-1 rounded-lg  bg-[#10132E] border border-white/[0.1] flex flex-col justify-center items-center text-center">
          <h3 className="text-lg font-semibold mb-4 flexitems-center justify-center ">
            Overall Score
          </h3>
          <AnimatedCircularProgressBar
            value={score}
          ></AnimatedCircularProgressBar>
        </div>

        {/* Tone BOX c2,r1 */}
        <div className="col-span-3 md:col-span-1 lg:col-span-1 rounded-lg ">
          <CustomProgressBar
            headings="Tone"
            markers={{
              left: 'Inconsistent',
              middle: 'Neutral',
              right: 'Appropriate',
            }}
            values={scoreData.Tone}
          />
        </div>

        {/* Clarity BOX c3r1  */}
        <div className="col-span-3 md:col-span-1 lg:col-span-1 rounded-lg">
          <CustomProgressBar
            headings="Clarity"
            markers={{
              left: 'Unclear',
              middle: 'Needs Work',
              right: 'Crystal Clear',
            }}
            values={scoreData.Clarity}
          />
        </div>

        <div className="col-span-3 md:col-span-1 lg:col-span-1 xl:col-span-1 rounded-lg bg-[#10132E] border border-white/[0.1] flex flex-col items-center text-center">
          <CustomProgressBar
            headings="Grammar"
            markers={{
              left: 'Poor',
              middle: 'Good',
              right: 'Excellent',
            }}
            values={scoreData.Grammar}
          />
        </div>

        {/* Accuracy BOX c2r2   */}
        <div className="col-span-3 md:col-span-1 lg:col-span-1 rounded-lg">
          <CustomProgressBar
            headings="Accuracy"
            markers={{
              left: 'Low',
              middle: 'Moderate',
              right: 'Perfect',
            }}
            values={scoreData.Accuracy}
          />
        </div>

        <div className="col-span-3 md:col-span-3 lg:col-span-3 xl:col-span-3 rounded-lg bg-[#10132E] border border-white/[0.1] flex flex-col items-center text-center">
          <h3 className="text-lg font-semibold mt-8 mb-4">Feedback</h3>
          <p className="text-1xl mb-2 p-2 overflow-y-auto">
            {scoreData.Feedback}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TextInterviewScore;
