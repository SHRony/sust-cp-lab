import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DifficultyCompareChart = ({ barData1, barData2 }: { barData1: { x: string; y: number; }[]; barData2: { x: string; y: number; }[] }) => {
  const data = {
    labels: barData1.map((_, i) => `${barData1[i].x}`),
    datasets: [
      {
        label: "User 1",
        data: barData1.map((_, i) => barData1[i].y),
        backgroundColor: "rgba(153, 102, 255, 0.8)",
        borderWidth: 1,
        borderColor: "rgba(153, 102, 255, 1)",
        hoverBackgroundColor: "rgba(153, 102, 255, 0.6)",
      },
      {
        label: "User 2",
        data: barData2.map((_, i) => barData2[i].y),
        backgroundColor: "rgba(255, 159, 64, 0.8)",
        borderWidth: 1,
        borderColor: "rgba(255, 159, 64, 1)",
        hoverBackgroundColor: "rgba(255, 159, 64, 0.6)",
      },
    ],
  };

  const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
      text: 'Difficulty wise problem count',
    },
  },
};

  return <Bar data={data} options={options} />;
};

export default DifficultyCompareChart;

