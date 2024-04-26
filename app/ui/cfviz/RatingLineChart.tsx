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
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};
const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
const data = {
  labels,
  datasets: [
    
  ],
};
export default function RatingLineChart({lineData} : {lineData : ratingChangeType}){
  
  return (
    <div className="mt-10 bg-white bg-opacity-75 backdrop-blur drop-shadow-3xl w-full flex justify-center items-center">
      <Line options={options}
        data = {
          lineData
        }
        className="w-full"
      >

      </Line>
    </div>

  );
}