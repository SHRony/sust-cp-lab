import { TextareaAutosize, Tooltip } from '@mui/material';
import React, { useRef, useState, ReactNode } from 'react';
export default function DoubleClickTextArea({ initialValue, onChange, textClassName, textStyle, textAreaClassName, textAreaStyle }: DoubleClickTextAreaProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      textAreaRef.current?.focus();
    }, 0);
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    setValue(value || initialValue);
    onChange(value);
  };

  return (
    <div className="flex flex-row items-center cursor-text" onDoubleClick={handleDoubleClick}>
      <div className={`flex flex-row items-center ${isEditing ? 'hidden' : ''}`}>
        <Tooltip followCursor arrow title={'double click to edit'}>
          <p className={`select-none p-1 ${textClassName}`} style={textStyle}>{value}</p>
        </Tooltip>
      </div>
      <TextareaAutosize
        ref={textAreaRef}
        className={`w-full p-0 border-0 outline-none ${isEditing ? '' : 'hidden'} ${textAreaClassName}`}
        onChange={handleChange}
        value={value}
        onBlur={handleBlur}
        style={{ ...textAreaStyle, height: 'min-content', overflowY: 'hidden' }}
      />
    </div>
  );
}

interface DoubleClickTextAreaProps {
  initialValue: string;
  onChange: (value: string) => void;
  textClassName?: string;
  textStyle?: React.CSSProperties;
  textAreaClassName?: string;
  textAreaStyle?: React.CSSProperties;
}
