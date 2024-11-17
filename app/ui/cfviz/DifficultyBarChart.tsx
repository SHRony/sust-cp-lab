import React, { useState, useEffect } from "react";
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
import { borderColors } from "@/app/lib/colors";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DifficultyBarChart({CFUser}:{CFUser:cfUserType|null}) {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if(!CFUser) return <></>;
  const barData = CFUser.diffData;

  return (
    <Card className="bg-card w-full flex flex-col justify-center items-start">
      <ChartHeading text="Difficulty wise solve count" />
      <div className="w-full h-[400px]">
        <Bar options={options(windowWidth)}
          data={generateDataForDifficultyBarChart(barData)}
        />
      </div>
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
        backgroundColor: borderColors[2],
      },
      {
        label : 'x+ difficulty',
        data : cumulitiveSolveCounts,
        backgroundColor: borderColors[3],
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

const options = (windowWidth: number) => ({
  responsive: true,
  maintainAspectRatio: false,
  aspectRatio: windowWidth <= 768 ? 0.75 : 2,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Difficulty Distribution',
    },
  },
  scales: {
    y: {
      ticks: {
        display: windowWidth > 768,
      }
    },
    x: {
      ticks: {
        maxRotation: windowWidth <= 768 ? 90 : 0,
        minRotation: windowWidth <= 768 ? 90 : 0
      }
    }
  }
});
