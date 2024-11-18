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

const CategoryCompareChart = ({ users }: { users: cfUserType[] }) => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Combine and sort categories by total solves
  const combinedCategories = new Map<string, number>();
  users.forEach(user => {
    user.catData.forEach(cat => {
      const current = combinedCategories.get(cat.x) || 0;
      combinedCategories.set(cat.x, current + cat.y);
    });
  });

  // Sort categories by total solves
  const sortedCategories = Array.from(combinedCategories.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([category]) => category);

  const data = {
    labels: sortedCategories,
    datasets: users.map((user, index) => {
      const categoryMap = new Map(user.catData.map(cat => [cat.x, cat.y]));
      return {
        label: user.name,
        data: sortedCategories.map(category => categoryMap.get(category) || 0),
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
        text: 'Category Distribution',
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
        },
        grid: {
          color: '#f0f0f0',
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
      <ChartHeading text="Category Distribution Comparison" />
      <div className="w-full h-[600px]">
        <Bar data={data} options={options} />
      </div>
    </Card>
  );
};

export default CategoryCompareChart;
