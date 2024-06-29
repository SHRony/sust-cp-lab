// this page will take userinput to create a contest and save it in the database. For now forget the database and focus on the ui. Build ui. Use material ui inputs and date picker. Make this stylish and look cool.

'use client'
import { contestType } from "@/app/lib/types";
import { useState, useEffect } from "react";  
import Button from '@mui/material/Button';
import { TextField } from "@mui/material";
import Card from "@/app/ui/cards/Card";
import ImageUploader from "@/app/ui/input/ImageUploader";
import DoubleClickInput from "@/app/ui/input/DoubleClickInput";
export default function CreateContestPage() {
  const [name, setName] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState(new Date());
  const [poster, setPoster] = useState("");
  
  const handleCreateContest = async () => {
    const newContest: contestType = {
      id: Date.now(),
      name,
      venue,
      description,
      date: date.toISOString(),
      type,
      poster,
    };

    try {
      await fetch("/api/contests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newContest),
      });
    } catch (error) {
      console.error("Error creating contest:", error);
    }
  };


  return (
    <Card
      className={`flex flex-col items-center justify-center bg-white p-4 mt-20 w-120`}
    >
      <ImageUploader onChange={(file) => {
        const reader = new FileReader();
        reader.onload = () => {
          setPoster(reader.result as string);
        };
        reader.readAsDataURL(file);
      }} />
      <div className="flex flex-col max-w-md w-full">
        <div className="p-2">
          <span className="text-gray-400">Name</span>
          <DoubleClickInput textClassName="text-2xl font-bold" inputClassName="text-2xl font-bold" initialValue="Random Inter University Programming Contest" onChange={(value) => {setName(value)}} />
        </div>
        <div className="p-2">
          <span className="text-gray-400">Venue</span>
          <DoubleClickInput textClassName="text-black" inputClassName="text-black" initialValue="Randome University" onChange={(value) => {setVenue(value)}} />
        </div>
        <div className="p-2">
          <span className="text-gray-400">Description</span>
          <DoubleClickInput textClassName="text-black" inputClassName="text-black" initialValue="An inter university programming contest for everyone. Teams will be formed based on the performaces of online contests and TFCs." onChange={(value) => {setDescription(value)}} />
        </div>
        <div className="p-2">
          <span className="text-gray-400">Type</span>
          <DoubleClickInput textClassName="text-black" inputClassName="text-black" initialValue="Onsite IUPC" onChange={(value) => {setType(value)}} />
        </div>
        <TextField
          label="Date"
          type="date"
          value={date.toISOString().split("T")[0]}
          onChange={(event) => setDate(new Date(event.target.value))}
          className="w-full border-none p-2"
        />
        
        <Button
          variant="contained"
          onClick={handleCreateContest}
          className="w-48 m-2"
          sx={{
            background: 'var(--primary)',
            '&:hover': {
              background: 'var(--primary) !important',
              color: 'var(--onPrimary) !important',
            },
          }}
        >
          Create Contest
        </Button>
      </div>
    </Card>
  );
}

