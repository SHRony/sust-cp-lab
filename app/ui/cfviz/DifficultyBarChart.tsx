import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { userType } from "@/app/lib/types";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Difficulty wise problem count',
    },
  },
};
const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
const data = {
  labels,
  datasets: [
    
  ],
};
export default function DifficultyBarChart({barData} : {barData:{ x: string; y: number; }[]}){
  let xArray : string[] = [];
  let yArray : number[] = [];
  for(const elem of barData){
    xArray.push(elem.x);
    yArray.push(elem.y);
  }
  
  let yCumSum : number[] = yArray.reverse().reduce((arr:number[], x)=>{arr.push(x + (arr.length != 0 ? arr[arr.length - 1] : 0)); return arr},[]).reverse();
  yArray.reverse();
  return (
    <div className="mt-10 bg-white bg-opacity-75 backdrop-blur drop-shadow-3xl w-full">
      <Bar options={options}
        data = {
          {
            labels : xArray,
            datasets:[
              {
                label : 'x difficulty',
                data : yArray,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
              },
              {
                label : 'x+ difficulty',
                data : yCumSum,
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                hidden : true
              },
            ]
          }
        }
        className="w-full"
      >

      </Bar>
    </div>

  );
}