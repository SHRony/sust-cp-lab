// this page will take userinput to create a contest and save it in the database. For now forget the database and focus on the ui. Build ui. Use material ui inputs and date picker. Make this stylish and look cool.

'use client'
import { contestType } from "@/app/lib/types";
import { useState, useEffect, useContext } from "react";  
import Button from '@mui/material/Button';
import { TextField } from "@mui/material";
import Card from "@/app/ui/cards/Card";
import ImageUploader from "@/app/ui/input/ImageUploader";
import DoubleClickInput from "@/app/ui/input/DoubleClickInput";
import axios from "axios";
import { authContext } from "@/app/lib/AuthProvider";
export default function CreateContestPage() {
  const [name, setName] = useState("Random Inter University Programming Contest");
  const [venue, setVenue] = useState("Random University");
  const [description, setDescription] = useState("An inter university programming contest for everyone. Teams will be formed based on the performaces of online contests and TFCs.");
  const [type, setType] = useState("Onsite IUPC");
  const [date, setDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
  const [poster, setPoster] = useState("");
  const auth = useContext(authContext);
  const handleCreateContest = async () => {
    const newContest: contestType = {
      name,
      venue,
      description,
      date,
      type,
      poster,
      id: 0,
      author: auth?.user?.userName || '',
    };
    try {
      axios.post("/api/contests/create", newContest)
        .then((res) => {
          if (res.status == 200) {
            window.location.href = '/contests';
            console.log('contest created');
          } else {
            console.log(res.data.error);
            alert('please try again');
          }
        })
        .catch((error) => {
          console.error("Error creating contest:", error);
          alert('please try again');
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
          <DoubleClickInput textClassName="text-2xl font-bold" inputClassName="text-2xl font-bold" initialValue = {name} onChange={(value) => {setName(value)}} />
        </div>
        <div className="p-2">
          <span className="text-gray-400">Venue</span>
          <DoubleClickInput textClassName="text-black" inputClassName="text-black" initialValue={venue} onChange = {(value) => {setVenue(value)}} />
        </div>
        <div className="p-2">
          <span className="text-gray-400">Description</span>
          <DoubleClickInput textClassName="text-black" inputClassName="text-black" initialValue= {description} onChange = {(value) => {setDescription(value)}} />
        </div>
        <div className="p-2">
          <span className="text-gray-400">Type</span>
          <DoubleClickInput textClassName="text-black" inputClassName="text-black" initialValue={type} onChange={(value) => {setType(value)}} />
        </div>
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
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

