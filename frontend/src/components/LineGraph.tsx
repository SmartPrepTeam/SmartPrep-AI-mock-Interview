import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
  PointElement,
  LineElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
  PointElement,
  LineElement
);

export const LineGraph = ({ LineChartData }) => {
  const options = {
    responsive: true,
    plugins: {
      title: {
        text: 'Confidence throughout the interview',
      },
    },
  };
  return <Line options={options} data={LineChartData} />;
};
