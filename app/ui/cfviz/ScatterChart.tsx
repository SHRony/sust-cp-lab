import React from "react";
import { cfUserType } from "@/app/lib/types";
import { Scatter } from "react-chartjs-2";
import { LinearScale } from "chart.js";
import { Chart as ChartJS, LineController, LineElement, PointElement, Title } from 'chart.js';
import Card from "@/app/ui/cards/Card";
import ChartHeading from "@/app/ui/cfviz/ChartHeading";
ChartJS.register(LineController, LineElement, PointElement, LinearScale, Title);

export default function ScatterChart({user} : {user : cfUserType|null}) {
  if(!user) return <></>;
  return (
    <Card style={{
          minWidth : '600px',
          width : '100%'
        }
      }
      className="flex flex-col justify-center items-center bg-card p-8 rounded max-h-600">
        <ChartHeading text="Scatter diagram of solved problems with time"/>
        <Scatter 
        className="w-full" 
        data={generateDataForScatterChart(user)}
        options={options}/>
    </Card>
  )
}

function generateDataForScatterChart(user : cfUserType){
  return {
    datasets: [
      {
        data: user.acTime,
        backgroundColor: '#6750A4',
        label : ''
      },
    ],
  }
}

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