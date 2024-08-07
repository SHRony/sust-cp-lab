import { userType } from "@/app/lib/types";
import Card from "./Card";
import { Skeleton } from "@mui/material";

export default function UserCardSkeleton(){
  return (
    <Card className="flex flex-col items-center bg-card w-170 min-h-10 py-8 rounded">
      <div 
        className="flex justify-center items-center text-2xl font-bold text-gray-700 text-shadow-2xl text-center px-10 mb-5"
        style={{backgroundColor : 'var(--primaryContainer)', color : 'var(--primary)', borderRadius : '50px'}}
      >
        <Skeleton variant="text" className="w-24" sx={{ fontSize: '1rem' }} />

      </div>
      <div className="flex flex-row justify-start w-full p-2 ml-60">
        <div className="font-bold text-gray-700 w-40">
          Full Name :
        </div>
        <div className="text-gray-600">
          <Skeleton variant="text" className="w-36" sx={{ fontSize: '1rem' }} />

        </div>
      </div>
      <div className="flex flex-row justify-start w-full p-2 ml-60">
        <div className="font-bold text-gray-700 w-40">
          email :
        </div>
        <div className="text-gray-600">
          <Skeleton variant="text" className="w-48" sx={{ fontSize: '1rem' }} />

        </div>
      </div>
      <div className="flex flex-row justify-start w-full p-2 ml-60">
        <div className="font-bold text-gray-700 w-40">
          Phone :
        </div>
        <div className="text-gray-600">
          <Skeleton variant="text" className="w-36" sx={{ fontSize: '1rem' }} />

        </div>
      </div>
      <div className="flex flex-row justify-start w-full p-2 ml-60">
        <div className="font-bold text-gray-700 w-40">
          Registration NO :
        </div>
        <div className="text-gray-600">
          <Skeleton variant="text" className="w-36" sx={{ fontSize: '1rem' }} />

        </div>
      </div>
      <div className="flex flex-row justify-start w-full p-2 ml-60">
        <div className="font-bold text-gray-700 w-40">
          Vjudge Handle :
        </div>
        <div className="text-gray-600">
          <Skeleton variant="text" className="w-24" sx={{ fontSize: '1rem' }} />

        </div>
      </div>
      <div className="flex flex-row justify-start w-full p-2 ml-60">
        <div className="font-bold text-gray-700 w-40">
          CF Handles :
        </div>
        <div className="text-gray-600">
          <Skeleton variant="text" className="w-48" sx={{ fontSize: '1rem' }} />
        </div>
      </div>
    </Card>
  )
}