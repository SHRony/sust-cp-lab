import React from "react";
import { cfUserType } from "@/app/lib/types";
import CalendarHeatmap from 'react-calendar-heatmap';
import Card from "../cards/Card";

export default function CalenderHeatmap({user}:{user : cfUserType|null}){
  if(!user) return <></>
  const value:any = user.calenderSubmissions;
  const startYear = value.reduce((mn:number, x:any)=>{ mn = Math.min(mn, new Date(x.date).getFullYear()); return mn;}, new Date().getFullYear());
  const getTooltipDataAttrs = (value:any) => {
    console.log(value);
    // Temporary hack around null value.date issue
    // if (!value || !value.date) {
    //   return null;
    // }
    // Configuration for react-tooltip
    return {
      'data-tip': `yo bro`,
    };
  }
  const handleClick = (value:any) => {
    if (!value || !value.date) {
      return ;
    }
    alert(`${value.count}`);
  };
  return (
     <Card className="bg-card w-full mt-10 flex flex-col justify-center items-center gap-8">
      {
          Array.from({ length: new Date().getFullYear() - startYear + 1 }, (_, i) => i + startYear).reverse().map(year => (
            <div style={{maxWidth : "1200px"}} key={year} className="flex flex-col items-start w-full p-2 gap-4">
              <div className="font-bold text-xl px-5 bg-blue-100 text-blue-600 border border-blue-600 rounded-r-full rounded-full" >{year}</div>
              <CalendarHeatmap
                key={year} // Important to add a unique key for each heatmap
                startDate={new Date(year + '-01-01')}
                endDate={new Date(year + '-12-31')}
                values={value}
                classForValue={(value) => {
                  if (!value) {
                    return 'color-empty';
                  }
                  return `color-scale-${value.count}`;
                }}
                tooltipDataAttrs={{
                  'data-tooltip': 'tooltip'
                }}
                onClick={handleClick}
              />
            </div>
        ))
       }
     </Card>
  )
}