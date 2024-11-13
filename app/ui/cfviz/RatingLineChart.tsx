import React from 'react';
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
  if(!CFUser) return <></>
  const lineData = CFUser.ratingChanges;
  lineData.datasets = lineData.datasets.map((data) => {
    return {
      ...data,
      pointRadius : 1,
      borderWidth : 1
    }
  })
  return (
    <Card className="bg-card w-full flex flex-col justify-center items-start max-h-700">
      <ChartHeading text="Rating Curve"></ChartHeading>
      <Line options={options} data = { lineData } className="w-full" />
    </Card>

  );
}

export const options = {
  responsive: true,
  spanGaps : true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
      text: 'Ratingwise solve count',
    },
  },
};