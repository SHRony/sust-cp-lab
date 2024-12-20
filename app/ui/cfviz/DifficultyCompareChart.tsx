import React, { useState, useEffect } from "react";
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
import Card from "../cards/Card";
import ChartHeading from "./ChartHeading";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DifficultyCompareChart = ({ users }: { users: cfUserType[] }) => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const data = {
    labels: users[0].diffData.map(d => d.x),
    datasets: users.map((user, index) => ({
      label: user.name,
      data: user.diffData.map(d => d.y),
      backgroundColor: backgroundColors[index],
      borderColor: borderColors[index],
      borderWidth: 1,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: windowWidth <= 768 ? 0.75 : 2,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Difficulty Distribution',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.raw} problems`;
          }
        }
      },
    },
    scales: {
      y: {
        ticks: {
          display: windowWidth > 768,
        }
      },
      x: {
        ticks: {
          maxRotation: windowWidth <= 768 ? 90 : 0,
          minRotation: windowWidth <= 768 ? 90 : 0
        }
      }
    }
  };

  return (
    <Card className="bg-card w-full flex flex-col justify-center items-start">
      <ChartHeading text="Difficulty Distribution Comparison" />
      <div className="w-full h-[400px]">
        <Bar data={data} options={options} />
      </div>
    </Card>
  );
};

export default DifficultyCompareChart;
