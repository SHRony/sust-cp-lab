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
import { cfUserType } from "@/app/lib/types";
import { borderColors, backgroundColors } from "@/app/lib/colors";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DifficultyCompareChart = ({ users }: { users: cfUserType[] }) => {
  const data = {
    labels: users[0].diffData.map(d => d.x),
    datasets: users.map((user, index) => ({
      label: user.name,
      data: user.diffData.map(d => d.y),
      backgroundColor: `${backgroundColors[index]}`,
      borderColor: user.diffData.map(d => d.y === 0 ? 'transparent' : borderColors[index]),
      borderWidth: 2,
      hoverBackgroundColor: `${backgroundColors[index]}CC`, // CC for 80% opacity
      barThickness: 15, // Set a fixed width for the bars
      minBarLength: 5, // Minimum height for bars with very small values
    })),
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
      tooltip: {
        padding: 10,
        titleFont: { size: 14 },
        bodyFont: { size: 14 },
        callbacks: {
          label: function(context: any) {
            if (context.raw === 0) return `${context.dataset.label}: No problems solved`;
            return `${context.dataset.label}: ${context.raw} problems`;
          }
        }
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Problem Difficulty',
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Problems Solved',
        },
        beginAtZero: true,
        grid: {
          color: '#f0f0f0',
        },
      },
    },
    elements: {
      bar: {
        borderWidth: 2,
      }
    },
    barPercentage: 0.8, // Controls the relative width of the bars
    categoryPercentage: 0.9, // Controls the relative width of the bar category
  };

  return <Bar data={data} options={options} />;
};

export default DifficultyCompareChart;
