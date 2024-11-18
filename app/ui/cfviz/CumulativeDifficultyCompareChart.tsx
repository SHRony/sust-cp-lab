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

const CumulativeDifficultyCompareChart = ({ users }: { users: cfUserType[] }) => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get all unique difficulty levels and sort them
  const difficultyLevels = Array.from(
    new Set(users.flatMap(user => user.diffData.map(d => d.x)))
  ).sort((a, b) => Number(a) - Number(b));

  // Calculate cumulative solves for each user
  const data = {
    labels: difficultyLevels,
    datasets: users.map((user, index) => {
      const difficultyMap = new Map(user.diffData.map(d => [d.x, d.y]));
      
      // Calculate cumulative solves for each difficulty level
      const cumulativeSolves = difficultyLevels.map(level => {
        const solveCount = difficultyLevels
          .filter(l => Number(l) >= Number(level))
          .reduce((sum, l) => sum + (difficultyMap.get(l) || 0), 0);
        return solveCount;
      });

      return {
        label: user.name,
        data: cumulativeSolves,
        backgroundColor: backgroundColors[index],
        borderColor: borderColors[index],
        borderWidth: 1,
      };
    }),
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
        text: 'Cumulative Difficulty Distribution',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.raw} problems ≥ ${context.label}`;
          }
        }
      },
    },
    scales: {
      y: {
        ticks: {
          display: windowWidth > 768,
        },
        grid: {
          color: '#f0f0f0',
        },
        title: {
          display: true,
          text: 'Problems Solved',
        }
      },
      x: {
        ticks: {
          maxRotation: 90,
          minRotation: 90,
          font: {
            size: 11
          },
          padding: 5
        },
        grid: {
          display: false
        },
        title: {
          display: true,
          text: 'Difficulty Rating',
        }
      }
    },
    layout: {
      padding: {
        bottom: 25
      }
    }
  };

  return (
    <Card className="bg-card w-full flex flex-col justify-center items-start">
      <ChartHeading text="Cumulative Difficulty Distribution" />
      <div className="w-full h-[600px]">
        <Bar data={data} options={options} />
      </div>
    </Card>
  );
};

export default CumulativeDifficultyCompareChart;
