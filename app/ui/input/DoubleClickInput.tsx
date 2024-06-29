import React, { useRef, useState } from 'react';

interface DoubleClickInputProps {
  initialValue: string;
  onChange: (value: string) => void;
  inputClassName?: string;
  inputStyle?: React.CSSProperties;
  textClassName?: string;
  textStyle?: React.CSSProperties;
}

export default function DoubleClickInput({ initialValue, onChange, inputClassName, inputStyle, textClassName, textStyle }: DoubleClickInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        <p className={`select-none p-1 ${textClassName}`} style={textStyle}>{value}</p>
      </div>
      <input
        ref={inputRef}
        type="text"
        className={`w-full p-0 border-0 outline-none ${isEditing ? '' : 'hidden'} ${inputClassName}`}
        onChange={handleChange}
        value={value}
        onBlur={handleBlur}
        style={inputStyle}
      />
    </div>
  );
}

