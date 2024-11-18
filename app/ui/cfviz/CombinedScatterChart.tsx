import React, { useState, useEffect } from "react";
import { cfUserType } from "@/app/lib/types";
import { Scatter } from "react-chartjs-2";
import { LinearScale, TimeScale, ChartOptions } from "chart.js";
import { Chart as ChartJS, LineController, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import Card from "@/app/ui/cards/Card";
import ChartHeading from "@/app/ui/cfviz/ChartHeading";
import { borderColors, backgroundColors } from "@/app/lib/colors";
import 'chartjs-adapter-date-fns';

ChartJS.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend
);

const CombinedScatterChart = ({ users }: { users: cfUserType[] }) => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const data = {
    datasets: users.map((user, index) => ({
      label: user.name,
      data: user.acTime.map(point => ({
        x: new Date(point.x * 1000),
        y: point.y
      })),
      backgroundColor: backgroundColors[index],
      borderColor: borderColors[index],
      borderWidth: 1,
      pointRadius: 3,
      pointHoverRadius: 5,
    })),
  };

  const options: ChartOptions<'scatter'> = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: windowWidth <= 768 ? 0.75 : 2,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Submission Timeline',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const point = context.raw;
            return `${context.dataset.label}: Rating ${point.y} (${point.x.toLocaleDateString()})`;
          }
        }
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        title: {
          display: true,
          text: 'Problem Rating',
        },
        ticks: {
          display: windowWidth > 768,
        },
        grid: {
          color: '#f0f0f0',
        }
      },
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
          displayFormats: {
            day: 'MMM d, yyyy'
          }
        },
        title: {
          display: true,
          text: 'Submission Time',
        },
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
      <ChartHeading text="Submission Timeline Comparison" />
      <div className="w-full h-[600px]">
        <Scatter data={data} options={options} />
      </div>
    </Card>
  );
};

export default CombinedScatterChart;
