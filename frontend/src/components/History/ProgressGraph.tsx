import React, { useEffect, useState } from 'react';
import ApexCharts from 'react-apexcharts';
import { format } from 'date-fns';
import { useDispatch } from 'react-redux';
import { setInterviews } from '../../features/ListSlice';
import { Interviews as InterviewList } from '../../helper/InterviewList';

type Interview = {
  createdAt: string;
  score: number;
  type: 'video' | 'textual';
};

type GroupedInterviewData = {
  month: string;
  score: number;
};

type ProgressGraphProps = {};

const formatDateToMonthYear = (date: string): string =>
  format(new Date(date), 'MMM-yyyy');

const groupByMonth = (interviews: Interview[]): GroupedInterviewData[] => {
  const grouped: Record<string, number[]> = {};

  interviews.forEach((interview) => {
    const monthYear = formatDateToMonthYear(interview.createdAt);
    if (!grouped[monthYear]) {
      grouped[monthYear] = [];
    }
    grouped[monthYear].push(interview.score);
  });

  // Calculate average score per month
  const result: GroupedInterviewData[] = [];
  Object.keys(grouped).forEach((month) => {
    const averageScore =
      grouped[month].reduce((sum, score) => sum + score, 0) /
      grouped[month].length;
    result.push({ month, score: averageScore });
  });

  return result;
};

const ProgressGraph: React.FC<ProgressGraphProps> = () => {
  const dispatch = useDispatch();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  useEffect(() => {
    dispatch(setInterviews(InterviewList));
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const videoInterviews = InterviewList.filter(
    (interview) => interview.type === 'video'
  );
  const textualInterviews = InterviewList.filter(
    (interview) => interview.type === 'textual'
  );

  const videoData = groupByMonth(videoInterviews);
  const textualData = groupByMonth(textualInterviews);

  const allData = [...videoData, ...textualData];

  const allMonths = Array.from(new Set(allData.map((item) => item.month)))
    .map((month) => {
      const [monthName, year] = month.split('-');
      const date = new Date(`${monthName} 1, ${year}`);
      return { month, date: date.getTime() }; // Convert Date to timestamp for sorting
    })
    .sort((a, b) => a.date - b.date) // Sort by timestamp
    .map((item) => item.month);

  const oldestMonth = allMonths[0];
  const newestMonth = allMonths[allMonths.length - 1];

  const labels = [oldestMonth, newestMonth];

  const videoScores = labels.map((month) => {
    const entry = videoData.find((item) => item.month === month);
    return entry ? entry.score : null;
  });

  const textualScores = labels.map((month) => {
    const entry = textualData.find((item) => item.month === month);
    return entry ? entry.score : null;
  });

  const calculatePercentageProgress = (scores: (number | null)[]): number[] => {
    const progress = scores.map((score) =>
      score !== null ? (score / 10) * 100 : 0
    );
    return progress;
  };

  const videoProgress = calculatePercentageProgress(videoScores);
  const textualProgress = calculatePercentageProgress(textualScores);

  const options: ApexCharts.ApexOptions = {
    chart: {
      id: 'progress-graph',
      type: 'line',
      height: '100%',
      width: '100%',
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: labels || [],
      labels: {
        style: {
          fontSize:
            screenWidth <= 768 ? '8px' : screenWidth <= 1024 ? '12px' : '13px',
          colors: '#ffffff',
        },
        offsetY: -2,
        offsetX: 4,
      },
      axisBorder: {
        show: false,
      },
    },
    stroke: {
      curve: 'smooth',
      width: 1.5,
    },
    yaxis: {
      show: false,
      min: 0,
      max: 100,
    },
    grid: {
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    markers: {
      size: 0.4,
      hover: {
        size: 10,
      },
    },
    legend: {
      position: 'top',
      fontSize:
        screenWidth <= 768 ? '8px' : screenWidth <= 1024 ? '12px' : '13px',
      onItemHover: {
        highlightDataSeries: true,
      },
      markers: {
        size: 4,
        shape: 'square',
        strokeWidth: 0,
      },
      labels: {
        colors: 'white',
      },
    },
  };

  const series = [
    {
      name: 'Video Interviews',
      data: videoProgress,
      color: '#5f2b75',
    },
    {
      name: 'Textual Interviews',
      data: textualProgress,
      color: '#7fffd4',
    },
  ];

  const totalInterviews = InterviewList.length;
  const completedInterviews = videoInterviews.length + textualInterviews.length;
  const progressRate = ((completedInterviews / totalInterviews) * 100).toFixed(
    2
  );

  return (
    <div className="w-full flex flex-col justify-center items-center bg-[#10132E] rounded-xl">
      <h2 className="text-white lg:text-xl md:text-lg m-0">
        Interview Progress
      </h2>

      <div className="flex flex-row w-full py-2 px-3 m-0">
        <div className="text-white flex-column mr-3">
          <div className="lg:text-[10px] md:text-[7px]">Progress Rate</div>
          <div className="lg:text-md md:text-[9px] font-semibold text-center">
            {progressRate}%
          </div>
        </div>

        <div className="text-white flex-column">
          <div className="lg:text-[10px] md:text-[7px]">Total Interviews</div>
          <div className="lg:text-md md:text-[9px]  font-semibold text-center">
            {totalInterviews}
          </div>
        </div>
      </div>

      <div className="w-full h-[135px] pl-4 pr-4 pb-3 m-0">
        <ApexCharts
          options={options}
          series={series}
          type="line"
          height={120}
        />
      </div>
    </div>
  );
};

export default ProgressGraph;
