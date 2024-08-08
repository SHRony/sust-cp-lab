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
import ChartHeading from "@/app/ui/cfviz/ChartHeading";
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
  return (
    <Card className="bg-card w-full flex flex-col justify-center items-center max-h-600 p-8">
      <ChartHeading text="Catagory wise solve count" />
      <Bar options={options}
        data = {generateDataForCatagoryBarChart(barData)}
        className="w-full"
      />
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
        backgroundColor: '#6750A4BB',
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