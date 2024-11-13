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
import { cfUserType } from "@/app/lib/types";
import ChartHeading from "./ChartHeading";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DifficultyBarChart({CFUser} : {CFUser : cfUserType|null}) {
  if(!CFUser) return <></>;
  const barData = CFUser.diffData;
  
  return (
    <Card className="bg-card w-full flex flex-col justify-center items-start max-h-600">
      <ChartHeading text="Difficulty wise solve count" />
      <Bar options={options}
        data = {generateDataForDifficultyBarChart(barData)}
        className="w-full"
      />
    </Card>

  );
}



function generateDataForDifficultyBarChart(barData : { x: any; y: any; }[]) {
  const {difficultyLevels, solveCounts} = ParseDifficultyLevelsAndSolveCounts(barData);
  let cumulitiveSolveCounts : number[] = cumulativeSumArrayInReverse(solveCounts);
  return {
    labels : difficultyLevels,
    datasets:[
      {
        label : 'x difficulty',
        data : solveCounts,
        backgroundColor: '#6750A4BB',
      },
      {
        label : 'x+ difficulty',
        data : cumulitiveSolveCounts,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        hidden : true
      },
    ]
  }
}

function ParseDifficultyLevelsAndSolveCounts(barData : { x: any; y: any; }[]) {
  let difficultyLevels : string[] = [];
  let solveCounts : number[] = [];
  for(const elem of barData){
    difficultyLevels.push(elem.x);
    solveCounts.push(elem.y);
  }
  return {difficultyLevels, solveCounts};
}

function cumulativeSumArrayInReverse(arr: number[]) {
  arr.reverse();
  let cumSum = cumulativeSumArray(arr);
  cumSum.reverse();
  arr.reverse();
  return cumSum;
}

function cumulativeSumArray(arr: number[]) {
  let cumSum = arr.reduce((arr:number[], x)=>{arr.push(x + (arr.length != 0 ? arr[arr.length - 1] : 0)); return arr},[]);
  return cumSum;
}

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
