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
import Card from "../cards/Card";
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
      display: false,
      text: 'Difficulty wise problem count',
    },
  },
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
    <Card className="bg-white w-full flex flex-col justify-center items-center max-h-600 p-8">
      <p 
      className='px-5 m-4 text-lg'
      style={{backgroundColor : 'var(--primaryContainer)', color : 'var(--primary)', borderRadius : '50px', fontWeight : 'bold'}}
      >
        Difficulty wise solve count
      </p>
      <Bar options={options}
        data = {
          {
            labels : xArray,
            datasets:[
              {
                label : 'x difficulty',
                data : yArray,
                backgroundColor: '#6750A4BB',
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
    </Card>

  );
}