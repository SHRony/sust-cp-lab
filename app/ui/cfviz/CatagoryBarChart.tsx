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
import ChartHeading from "@/app/ui/cfviz/ChartHeading";
import { borderColors } from "@/app/lib/colors";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


export default function CatagoryBarChart({CFUser}:{CFUser : cfUserType|null}) {
  if(!CFUser) return <></>;
  const barData = CFUser.catData;
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Card className="bg-card w-full flex flex-col justify-center items-start">
      <ChartHeading text="Catagory wise solve count" />
      <div className={`w-full ${windowWidth <= 768 ? 'h-[500px]' : 'h-[400px]'}`}>
        <Bar options={options(windowWidth)}
          data={generateDataForCatagoryBarChart(barData)}
        />
      </div>
    </Card>
  );
}



function generateDataForCatagoryBarChart(barData : {x : string, y : number}[]) {
  const {catagories, solveCounts} = parseCatagoryAndSolveCounts(barData);
  return {
    labels : catagories,
    datasets : [
      {
        label : 'Solved',
        data : solveCounts,
        backgroundColor: borderColors[4],
      },
    ]
  }
}

function parseCatagoryAndSolveCounts(barData : {x : string, y : number}[]) {
  let catagories : string[] = [];
  let solveCounts : number[] = [];
  for(const elem of barData){
    catagories.push(elem.x);
    solveCounts.push(elem.y);
  }
  return {catagories, solveCounts};
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
      display: false,
      text: 'Category Distribution',
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