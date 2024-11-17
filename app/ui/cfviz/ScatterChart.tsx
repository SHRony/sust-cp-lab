import React, { useState, useEffect } from "react";
import { cfUserType } from "@/app/lib/types";
import { Scatter } from "react-chartjs-2";
import { LinearScale } from "chart.js";
import { Chart as ChartJS, LineController, LineElement, PointElement, Title } from 'chart.js';
import Card from "@/app/ui/cards/Card";
import ChartHeading from "@/app/ui/cfviz/ChartHeading";
import { borderColors } from "@/app/lib/colors";
ChartJS.register(LineController, LineElement, PointElement, LinearScale, Title);

export default function ScatterChart({user}:{user:cfUserType|null}) {
  if(!user) return <></>;
  const scatterData = user;
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Card className="bg-card w-full flex flex-col justify-center items-start">
      <ChartHeading text="Scatter diagram of solved problems with time"/>
      <div className={`w-full ${windowWidth <= 768 ? 'h-[500px]' : 'h-[400px]'}`}>
        <Scatter 
          data={generateDataForScatterChart(scatterData)}
          options={options(windowWidth)}
        />
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
      text: 'Scatter diagram of solved problems',
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