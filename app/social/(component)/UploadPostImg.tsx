import { useState, useEffect, useRef } from "react";
import Image from "next/image";

import SelectPhotos from "@/public/social/SelectPhotos";

const BUCKET_URL = process.env.NEXT_PUBLIC_BUCKET_URL;

export default function UploadPostImg({ setImageFile, currentImageUrl }: any) {
  // 이미지 미리보기 (게시물 수정)
  const [previewImage, setPreviewImage] = useState<string | null>(
    currentImageUrl ?? null,
  );

  const [isImageOnServer, setImageOnServer] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleImageInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    if (currentImageUrl) {
      const imageUrl = `${BUCKET_URL}${currentImageUrl}`;
      setPreviewImage(imageUrl);
      setImageOnServer(true);
    } else {
      setImageOnServer(false);
    }
  }, [currentImageUrl]);

  return (
    <div className="relative h-[300px] w-full">
      {previewImage ? (
        <Image
          src={previewImage}
          alt="image selected"
          className="object-cover"
          fill
        />
      ) : (
        <div className="w-ful flex h-full">
          <button
            type="button"
            onClick={handleImageInputClick}
            className="flex h-full w-full items-center justify-center rounded-xl border-2 border-dotted border-default-400 transition-all hover:border-solid hover:border-default-800"
          >
            <SelectPhotos className="size-10" />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            hidden
          />
        </div>
      )}
    </div>
  );
}
