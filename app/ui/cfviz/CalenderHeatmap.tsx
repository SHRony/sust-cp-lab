import React from "react";
import { userType } from "@/app/lib/types";
import Tooltip from '@uiw/react-tooltip';
import HeatMap from '@uiw/react-heat-map';
import CalendarHeatmap from 'react-calendar-heatmap';

export default function CalenderHeatmap({user}:{user : userType}){
  const value:any = user.calenderSubmissions;
  const startYear = value.reduce((mn:number, x:any)=>{ mn = Math.min(mn, new Date(x.date).getFullYear()); return mn;}, new Date().getFullYear());
  function getTooltipDataAttrs(value:any){
    // Temporary hack around null value.date issue
    if (!value || !value.date) {
      return null;
    }
    // Configuration for react-tooltip
    return {
      'data-tip': `yo bro`,
    };
  }
  function getHeatMap(year : number){
    return (
      <CalendarHeatmap
        startDate={new Date(year + '-01-01')}
        endDate={new Date(year + '-12-31')}
        values={value}
      />
    );
  }
  return (
     <div className="bg-white bg-opacity-75 backdrop-blur drop-shadow-3xl w-full mt-10">
      {
          Array.from({ length: new Date().getFullYear() - startYear + 1 }, (_, i) => i + startYear).map(year => (
            <div className="w-full h-60 p-2 ">
              <div className="font-bold text-xl">{year}</div>
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
                tooltipDataAttrs={getTooltipDataAttrs}
              />
            </div>
        ))
       }
     </div>
  )
}