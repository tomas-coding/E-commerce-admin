"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";

import { UploadButton } from "@/lib/uploadthing";
import toast from "react-hot-toast";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void; // Cambiado a un array de strings
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url:string) => (
          <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
            <div className=" z-10 absolute top-2 right-2">
              <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon">
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image fill className="object-cover" src={url} alt={"Image"} />
          </div>
        ))}
        
        
      </div>
            
      <UploadButton 
          endpoint="courseImage"
          
          onClientUploadComplete={(res:any) => {
            const file = res;
            const url = file?.[0].url;

            if (url) {
              
              onChange(url);
            }

            console.log("Files: ", res);
            toast.success("uploaded successfully")
          }}
          onUploadError={(error: Error) => {
            
            alert(`ERROR! ${error.message}`);
          }}
        />
      
    </div>
  );
};

export default ImageUpload;