import CustomProgressBar from '../CustomProgressBar';
import AnimatedCircularProgressBar from '@/components/ui/AnimatedCircularProgressBar';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { LineGraph } from '../LineGraph';
import { useEffect, useState } from 'react';

const VideoInterviewScore = () => {
  const [chartData, setChartData] = useState<{
    labels: number[];
    datasets: { label: string; data: number[]; borderColor: string }[];
  }>({
    labels: [],
    datasets: [
      {
        label: 'Confidence Level',
        data: [],
        borderColor: 'rgb(75,192,192)',
      },
    ],
  });
  const scoreData = useSelector((state: RootState) => state.videoScore.data);
  if (!scoreData) {
    return <></>;
  }
  let score =
    (scoreData.llm_response.Tone +
      scoreData.llm_response.Accuracy +
      scoreData.llm_response.Clarity +
      scoreData.llm_response.Grammar) /
    4;
  useEffect(() => {
    if (scoreData.video_confidence && scoreData.video_confidence.length > 0) {
      const labels = scoreData.video_confidence.map((_, index) => index + 1);
      setChartData({
        labels,
        datasets: [
          {
            label: 'Confidence Level',
            data: scoreData.video_confidence,
            borderColor: 'rgb(75,192,192)',
          },
        ],
      });
    }
  }, [scoreData.video_confidence]);
  return (
    <div className="flex justify-center items-start min-h-[70vh] px-3">
      <div className="grid grid-cols-[1fr,2fr,2fr] gap-4 md:gap-1 auto-rows-[minmax(160px,240px)]">
        <LineGraph LineChartData={chartData} />
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
            values={scoreData.llm_response.Tone}
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
            values={scoreData.llm_response.Clarity}
          />
        </div>
        <div className="col-span-3 md:col-span-1 lg:col-span-2 xl:col-span-1 rounded-lg bg-[#10132E] border border-white/[0.1] flex flex-col items-center text-center">
          <h3 className="text-lg font-semibold mt-8 mb-4">Feedback</h3>
          <p className="text-sm mb-2 p-2 overflow-y-auto">
            {scoreData.llm_response.Feedback}
          </p>
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
            values={scoreData.llm_response.Accuracy}
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
            values={scoreData.llm_response.Grammar}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoInterviewScore;
