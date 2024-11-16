import React, { useState } from "react";
import Image from "next/image";
import Card from "@/app/ui/cards/Card";
import UserCard from "@/app/ui/cards/UserCard";
import Link from "next/link";
import IconButton from "@mui/material/IconButton/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DoubleClickInput from "../input/DoubleClickInput";
import { teamType } from "@/app/lib/types";
import AccessProvider from "@/app/lib/AccessProvider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Button, CircularProgress } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";

interface TeamCardProps {
  team: teamType;
  onClose: (team: teamType) => void;
  onRename: (team: string[], newTeamName: string) => void;
  closable?: boolean;
}

const TeamCard = ({ team, onClose, onRename, closable}: TeamCardProps) => {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setOpen(false);
    onClose(team);
  };

  const handleConfirmClose = () => {
    handleClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        className="relative overflow-hidden rounded-xl bg-white p-6 border border-gray-200 hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow-md"
      >
        <AccessProvider permittedUsers={["mentor", "admin"]}>
          <motion.div 
            className="absolute top-4 right-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {closable && (
              <IconButton
                onClick={() => setOpen(true)}
                disabled={closing}
                className="hover:bg-red-50 transition-colors"
              >
                {closing ? (
                  <CircularProgress size={24} className="text-blue-500" />
                ) : (
                  <CloseIcon className="text-gray-400 hover:text-red-500" />
                )}
              </IconButton>
            )}
          </motion.div>

          <Dialog 
            open={open} 
            onClose={handleClose}
            PaperProps={{
              className: "bg-white rounded-xl border border-gray-200"
            }}
          >
            <DialogTitle className="text-xl font-semibold text-gray-800">Confirm Team Deletion</DialogTitle>
            <DialogContent className="text-gray-600">
              Are you sure you want to delete this team? This action cannot be undone.
            </DialogContent>
            <DialogActions className="p-4">
              <Button 
                onClick={handleClose}
                className="text-gray-600 hover:text-gray-800"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmClose} 
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Delete Team
              </Button>
            </DialogActions>
          </Dialog>
        </AccessProvider>

        <div className="flex items-center gap-4 mb-6 w-full">
          <div className="p-3 bg-blue-50 rounded-xl flex-shrink-0">
            <Users className="w-6 h-6 text-blue-500" />
          </div>
          <div className="min-w-0 flex-1">
            <DoubleClickInput
              textClassName="font-bold text-xl text-gray-800 block truncate"
              inputClassName="font-bold text-xl bg-transparent text-gray-800 outline-none border-b border-blue-400 w-full"
              initialValue={team.name}
              onChange={(newTeamName) => onRename(team.members, newTeamName)}
            />
          </div>
        </div>

        <motion.div 
          className="grid gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {team.members.map((username, index) => (
            <motion.div
              key={username}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/profile/${username}`}>
                <motion.div
                  className="p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors cursor-pointer flex items-center gap-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
                    {username[0].toUpperCase()}
                  </div>
                  <span className="text-gray-700 font-medium">{username}</span>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default TeamCard;
