"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface ImageUploadProps {
  onImageUpload: (file: File | null) => void;
  gradient?: string;
}

export const ImageUpload = ({ 
  onImageUpload, 
  gradient = "from-cyan-400 via-blue-500 to-indigo-600" 
}: ImageUploadProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = useCallback((file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB");
      return;
    }

    setSelectedImage(file);
    onImageUpload(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [onImageUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageSelect(files[0]);
    }
  }, [handleImageSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageSelect(files[0]);
    }
  }, [handleImageSelect]);

  const handleRemoveImage = useCallback(() => {
    setSelectedImage(null);
    setImagePreview(null);
    onImageUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onImageUpload]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  if (imagePreview) {
    return (
      <div className="relative group">
        <div className="relative w-full h-8 rounded-lg overflow-hidden border-2 border-gray-200">
          <Image
            src={imagePreview}
            alt="Selected image"
            fill
            className="object-cover"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-0 right-0 p-0.5 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all duration-200"
          >
            <X size={8} />
          </button>
        </div>
        <div className="absolute -bottom-1 left-0 right-0 text-[10px] text-center text-gray-500 bg-white/80 rounded-b-lg py-0.5">
          {selectedImage?.name}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        relative w-full h-8 border-2 border-dashed rounded-lg
        transition-all duration-200 cursor-pointer
        ${isDragOver 
          ? `border-amber-400 bg-gradient-to-r ${gradient} bg-opacity-5` 
          : 'border-gray-300 hover:border-gray-400'
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
      
      <div className="flex items-center justify-center h-full gap-1">
        <div className={`flex items-center gap-1 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
          <ImageIcon size={12} />
          <Upload size={10} />
        </div>
        <div className="text-[10px] text-gray-500">
          <span className="hidden md:inline">Drop or </span>
          <span className="font-medium">upload</span>
        </div>
      </div>
    </div>
  );
};
