import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
  PointElement,
  Filler,
  LineElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
  Filler,
  PointElement,
  LineElement
);

export const LineGraph = ({ LineChartData }) => {
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Confidence throughout the interview',
        color: '#FFFFFF',
        font: {
          size: 20, // Increase font size (default is usually 12 or 16)
          family: 'sans-serif',
        },
        padding: {
          top: 10, // Reduce top padding to move title upwards
          bottom: 30, // Increase bottom padding to create more space below the title
        },
        position: 'top', // Ensures the title is at the top (this is the default)
        align: 'center',
      },
    },
    scales: {
      x: {
        ticks: {
          beginAtZero: true,
          color: '#cbd5e1',
        },
        display: true,
        title: {
          display: true,
          text: 'Question no',
          color: '#cbd5e1',
          font: {
            family: 'ManRope',
            size: 20,
            lineHeight: 1.2,
          },
          padding: { top: 25, left: 0, right: 0, bottom: 0 },
        },
      },
      y: {
        ticks: {
          beginAtZero: true,
          color: '#cbd5e1',
        },
        display: true,
        title: {
          display: true,
          text: 'Confidence Level',
          color: '#cbd5e1',
          font: {
            family: 'ManRope',
            size: 20,
            style: 'normal',
            lineHeight: 1.2,
          },
          padding: { top: 25, left: 0, right: 0, bottom: 0 },
        },
      },
    },
  };
  const modifiedData = {
    ...LineChartData,
    datasets: LineChartData.datasets.map((dataset) => ({
      ...dataset,
      borderColor: '#a9c6f5',
      pointBackgroundColor: '#a9c6f5',
      pointBorderColor: '#cbd5e1',
      tension: 0.2, // Makes the line slightly curved
      fill: true,
      backgroundColor: (context) => {
        if (!context.chart.chartArea) {
          return;
        }
        const chartArea = context.chart.chartArea;
        const gradient = context.chart.ctx.createLinearGradient(
          0,
          chartArea.top,
          0,
          chartArea.bottom
        );
        gradient.addColorStop(0, 'rgba(203, 213, 225, 0.4)');
        gradient.addColorStop(1, 'rgba(203, 213, 225, 0.05)');
        return gradient;
      },
    })),
  };
  return <Line options={options} data={modifiedData} />;
};
