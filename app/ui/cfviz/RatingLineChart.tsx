import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { cfUserType, ratingChangeType } from '@/app/lib/types';
import Card from '../cards/Card';
import ChartHeading from '@/app/ui/cfviz/ChartHeading';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function RatingLineChart({CFUser} : {CFUser : cfUserType|null}){
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if(!CFUser) return <></>;
  const lineData = CFUser.ratingChanges;
  lineData.datasets = lineData.datasets.map((data) => {
    return {
      ...data,
      pointRadius : 1,
      borderWidth : 1
    }
  })

  return (
    <Card className="bg-card w-full flex flex-col justify-center items-start">
      <ChartHeading text="Rating Curve"></ChartHeading>
      <div className={`w-full ${windowWidth <= 768 ? 'h-[500px]' : 'h-[400px]'}`}>
        <Line options={options(windowWidth)} data={lineData} />
      </div>
    </Card>
  );
}

export const options = (windowWidth: number) => ({
  responsive: true,
  spanGaps : true,
  maintainAspectRatio: false,
  aspectRatio: windowWidth <= 768 ? 0.75 : 2,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Ratingwise solve count',
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
});