import React from "react";
import { userType } from "@/app/lib/types";
import { Scatter } from "react-chartjs-2";
import { LinearScale } from "chart.js";
import { Chart as ChartJS, LineController, LineElement, PointElement, Title } from 'chart.js';
ChartJS.register(LineController, LineElement, PointElement, LinearScale, Title);

export default function ScatterChart({user} : {user : userType}){
  return (
    <div style={{
          minWidth : '600px',
          width : '100%'
        }
      } 
      className="flex flex-row justify-center items-center bg-white bg-opacity-75 backdrop-blur drop-shadow-3xl p-5 mt-10 rounded">
        <Scatter 
        className="w-full" 
        data={
          {
            datasets: [
              {
                data: user.acTime,
                backgroundColor: 'rgba(255, 99, 132, 1)',
              },
            ],
          }
        }
        options={{ maintainAspectRatio: true }}

        />
      </div>
  )
}