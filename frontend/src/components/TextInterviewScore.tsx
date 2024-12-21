import CustomProgressBar from './CustomProgressBar';
import AnimatedCircularProgressBar from '@/components/ui/AnimatedCircularProgressBar';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useEffect, useContext } from 'react';
import {
  NavigationBundle,
  NavigationContext,
} from '@/context/navigation_context';

const TextInterviewScore = () => {
  const scoreData = useSelector((state: RootState) => state.score.data);
  // useEffect(() => {
  //   const { from, to } = useContext<NavigationBundle>(NavigationContext);
  //   console.log(from);
  //   console.log(to);
  // }, []);
  if (!scoreData) {
    return <div>No quiz data available. Please go back and set up a quiz.</div>;
  }
  let score =
    (scoreData?.Tone +
      scoreData.Accuracy +
      scoreData.Clarity +
      scoreData.Grammar) /
    4;

  return (
    <div className="flex justify-center items-start min-h-[70vh] px-3">
      <div className="grid grid-cols-[1fr,2fr,2fr] gap-4 md:gap-1 auto-rows-[minmax(160px,240px)]">
        {/* Feedback BOX c1,2r  */}
        <div className="col-span-3 md:col-span-1 lg:col-span-1 p-1 rounded-lg  bg-[#10132E] border border-white/[0.1] flex flex-col items-center text-center">
          <h3 className="text-lg font-semibold mb-4">Overall Score</h3>
          <AnimatedCircularProgressBar
            value={score}
          ></AnimatedCircularProgressBar>
        </div>

        {/* Tone BOX c2,r1 */}
        <div className="col-span-3 md:col-span-2 lg:col-span-1 rounded-lg ">
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
        <div className="col-span-3 md:col-span-2 lg:col-span-1 rounded-lg">
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
        <div className="col-span-3 md:col-span-1 lg:col-span-2 xl:col-span-1 rounded-lg bg-[#10132E] border border-white/[0.1] flex flex-col items-center text-center">
          <h3 className="text-lg font-semibold mt-8 mb-4">Feedback</h3>
          <p className="text-sm mb-2 p-2">{scoreData.Feedback}</p>
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

        {/* Grammar BOX c3r2 */}
        <div className="col-span-3 md:col-span-2 lg:col-span-3 xl:col-span-1 rounded-lg">
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
      </div>
    </div>
  );
};

export default TextInterviewScore;
