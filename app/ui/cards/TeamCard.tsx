import React, { useState } from "react";
import Image from "next/image";
import Card from "@/app/ui/cards/Card";
import UserCard from "@/app/ui/cards/UserCard";
import Link from "next/link";
import IconButton from "@mui/material/IconButton/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
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
  onClose?: (team: teamType) => void;
  onRename: (team: string[], newTeamName: string) => void;
  onDelete?: (team: teamType) => void;
  closable?: boolean;
  contestAuthor?: string;
}

const TeamCard = ({ team, onClose, onRename, onDelete, closable, contestAuthor}: TeamCardProps) => {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleClose = () => {
    if (!onClose) return;
    setClosing(true);
    setOpen(false);
    onClose(team);
  };

  const handleConfirmClose = () => {
    handleClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(team);
    }
    setDeleteDialogOpen(false);
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
        className="relative overflow-hidden rounded-xl bg-white p-6 border border-gray-200 hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow-md w-[300px]"
      >
        {/* Delete Button */}
        <AccessProvider permittedUsers={['admin', 'mentor']}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute top-2 right-2 z-10"
          >
            <IconButton
              onClick={() => setDeleteDialogOpen(true)}
              className="bg-red-50 hover:bg-red-100"
              size="small"
            >
              <DeleteIcon className="text-red-500" fontSize="small" />
            </IconButton>
          </motion.div>
        </AccessProvider>

        {/* Close Button */}
        {/* {closable && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute top-2 right-2 z-10"
          >
            <IconButton
              onClick={() => setOpen(true)}
              className="bg-gray-50 hover:bg-gray-100"
              size="small"
            >
              <CloseIcon className="text-gray-500" fontSize="small" />
            </IconButton>
          </motion.div>
        )} */}

        {/* Team Name */}
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-5 h-5 text-blue-500" />
          <AccessProvider 
            permittedUsers={['admin', 'mentor', ...team.members.map((member) => '_' + member)]} 
            fallback={<div className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors">{team.name}</div>}
          >
            <DoubleClickInput
              initialValue={team.name}
              onChange={() => {}}  
              onKeyEnter={(value) => onRename(team.members, value)}  
              inputClassName="px-2 py-1 w-full border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              textClassName="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors"
            />
          </AccessProvider>
        </div>

        {/* Team Members */}
        <div className="space-y-2">
          {team.members.map((member) => (
            <Link key={member} href={`/profile/${member}`}>
              <div className="p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-gray-700 hover:text-blue-600">{member}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Close Confirmation Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Remove Team?</DialogTitle>
          <DialogContent>
            Are you sure you want to remove this team?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmClose} color="error">
              {closing ? <CircularProgress size={24} /> : "Remove"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Team?</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this team? This action cannot be undone.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
    </Card>
    </motion.div>
  );
};

export default TeamCard;
