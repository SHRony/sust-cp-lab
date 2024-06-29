import React, { ChangeEvent, useRef, useState } from "react";

type ImageUploaderProps = {
  onChange: (file: File) => void;
};

const ImageUploader: React.FC<ImageUploaderProps> = ({ onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onChange(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="flex flex-col items-center w-full h-64 justify-center items-center border-2 border-dashed rounded bg-contain bg-center bg-no-repeat"
      style={{ backgroundImage: imageUrl ? `url("${imageUrl}")` : undefined }}
    >
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <button className="py-1 px-2 rounded" style={{ background: 'var(--primaryContainer)', color: 'var(--primary)' }} onClick={() => inputRef.current?.click()}>
        Choose Image
      </button>
    </div>
  );
};

export default ImageUploader;

