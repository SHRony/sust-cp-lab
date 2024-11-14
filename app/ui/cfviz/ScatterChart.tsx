import React from "react";
import { cfUserType } from "@/app/lib/types";
import { Scatter } from "react-chartjs-2";
import { LinearScale } from "chart.js";
import { Chart as ChartJS, LineController, LineElement, PointElement, Title } from 'chart.js';
import Card from "@/app/ui/cards/Card";
import ChartHeading from "@/app/ui/cfviz/ChartHeading";
import { borderColors } from "@/app/lib/colors";
ChartJS.register(LineController, LineElement, PointElement, LinearScale, Title);

export default function ScatterChart({user} : {user : cfUserType|null}) {
  if(!user) return <></>;
  return (
    <Card
      className="flex flex-col bg-card rounded w-full overflow-y-scroll items-start" style = {{scrollbarWidth : "none"}}>
        <ChartHeading text="Scatter diagram of solved problems with time"/>

        <div className="w-full min-w-800-px">
        <Scatter 
        className="w-full" 
        data={generateDataForScatterChart(user)}
        options={options}/>
        </div>
    </Card>
  )
}

function generateDataForScatterChart(user : cfUserType){
  return {
    datasets: [
      {
        data: user.acTime,
        backgroundColor: borderColors[0],
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
      text: 'Scatter diagram of solved problems',
    },
  },
};