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
      text: 'Catagory wise problem count',
    },
  },
};

export default function CatagoryBarChart({barData} : {barData:{ x: string; y: number; }[]}){
  let xArray : string[] = [];
  let yArray : number[] = [];
  for(const elem of barData){
    xArray.push(elem.x);
    yArray.push(elem.y);
  }
  
  return (
    <div className="mt-10 bg-white backdrop-blur drop-shadow-xl w-full flex flex-col justify-center items-center max-h-600 p-8">
      <p 
      className='px-5 m-4 text-lg'
      style={{backgroundColor : 'var(--primaryContainer)', color : 'var(--primary)', borderRadius : '50px', fontWeight : 'bold'}}
      >
        Catagory wise solve count
      </p>
      <Bar options={options}
        data = {
          {
            labels : xArray,
            datasets:[
              {
                label : '',
                data : yArray,
                backgroundColor: '#6750A4BB',
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