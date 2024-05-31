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
import { ratingChangeType } from '@/app/lib/types';
import Card from '../cards/Card';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
export default function RatingLineChart({lineData} : {lineData : ratingChangeType}){
  
  return (
    <Card className="bg-white w-full flex flex-col justify-center items-center max-h-700 p-8">
      <p 
      className='px-5 m-4 text-lg'
      style={{backgroundColor : 'var(--primaryContainer)', color : 'var(--primary)', borderRadius : '50px', fontWeight : 'bold'}}
      >
        Rating curve</p>
      <Line options={options}
        data = {
          lineData
        }
        className="w-full"
      >

      </Line>
    </Card>

  );
}