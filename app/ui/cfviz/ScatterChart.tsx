import React from "react";
import { cfUserType } from "@/app/lib/types";
import { Scatter } from "react-chartjs-2";
import { LinearScale } from "chart.js";
import { Chart as ChartJS, LineController, LineElement, PointElement, Title } from 'chart.js';
ChartJS.register(LineController, LineElement, PointElement, LinearScale, Title);
const options = {
  responsive: true,
  spanGaps : true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
      text: 'Scatter diagram of solved problems with time',
    },
  },
};
export default function ScatterChart({user} : {user : cfUserType}){
  return (
    <div style={{
          minWidth : '600px',
          width : '100%'
        }
      }
      className="flex flex-col justify-center items-center bg-white backdrop-blur drop-shadow-xl p-8 mt-10 rounded max-h-600">
        <p 
        className='px-5 m-4 text-lg'
        style={{backgroundColor : 'var(--primaryContainer)', color : 'var(--primary)', borderRadius : '50px', fontWeight : 'bold'}}
        >
          Scatter plot
        </p>
        <Scatter 
        className="w-full" 
        data={
          {
            datasets: [
              {
                data: user.acTime,
                backgroundColor: '#6750A4',
                label : ''
              },
            ],
          }
        }
        options={options}

        />
      </div>
  )
}