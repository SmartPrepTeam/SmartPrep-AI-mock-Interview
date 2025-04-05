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
  console.log(scoreData);
  let score =
    (scoreData.llm_scores.Tone +
      scoreData.llm_scores.Accuracy +
      scoreData.llm_scores.Clarity +
      scoreData.llm_scores.Grammar) /
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
    <>
      <div className="w-full flex flex-col lg:flex-row gap-4 px-3">
        <div className="w-full lg:w-3/5 h-64 md:pr-4 mx-auto p-1 rounded-lg bg-[#10132E] border border-white/[0.1]">
          <LineGraph LineChartData={chartData} />
        </div>
        <div className="w-full xl:w-2/5 flex flex-col md:flex-row gap-4">
          <div className="w-full lg:w-1/2 bg-[#10132E] border border-white/[0.1] p-4 rounded-lg flex flex-col justify-center items-center">
            <h3 className="text-lg font-semibold mb-2 text-center">Feedback</h3>
            <p className="text-md p-2 max-h-40 overflow-y-auto">
              {scoreData.llm_scores.Feedback}
            </p>
          </div>
          <div className="w-full lg:w-1/2 p-1 rounded-lg bg-[#10132E] border border-white/[0.1] flex flex-col items-center text-center">
            <h3 className="text-lg font-semibold mb-4">Overall Score</h3>
            <AnimatedCircularProgressBar
              value={score}
            ></AnimatedCircularProgressBar>
          </div>
        </div>
      </div>
      <div className="flex min-h-[70vh] px-3 py-4">
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top row: Tone and Clarity */}
            <div className="col-span-1">
              <CustomProgressBar
                headings="Tone"
                markers={{
                  left: 'Inconsistent',
                  middle: 'Neutral',
                  right: 'Appropriate',
                }}
                values={scoreData.llm_scores.Tone}
              />
            </div>

            <div className="col-span-1">
              <CustomProgressBar
                headings="Clarity"
                markers={{
                  left: 'Unclear',
                  middle: 'Needs Work',
                  right: 'Crystal Clear',
                }}
                values={scoreData.llm_scores.Clarity}
              />
            </div>

            {/* Bottom row: Accuracy and Grammar */}
            <div className="col-span-1">
              <CustomProgressBar
                headings="Accuracy"
                markers={{
                  left: 'Low',
                  middle: 'Moderate',
                  right: 'Perfect',
                }}
                values={scoreData.llm_scores.Accuracy}
              />
            </div>

            <div className="col-span-1">
              <CustomProgressBar
                headings="Grammar"
                markers={{
                  left: 'Poor',
                  middle: 'Good',
                  right: 'Excellent',
                }}
                values={scoreData.llm_scores.Grammar}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoInterviewScore;
