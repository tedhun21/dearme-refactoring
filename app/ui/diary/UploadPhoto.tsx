import { ChangeEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";

import { useMutation } from "@tanstack/react-query";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

import { deleteImage } from "@/store/api";
import PhotoIcon from "@/public/diary/PhotoIcon";

const BUCKET_URL = process.env.NEXT_PUBLIC_BUCKET_URL;

export default function UploadPhoto({
  selectedPhotos,
  setSelectedPhotos,
  previewUrls,
  setPreviewUrls,
}: any) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [totalImageLength, setTotalImageLength] = useState<number>(0);

  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const { mutate: deleteImageMutate } = useMutation({
    mutationKey: ["deleteImage"],
    mutationFn: deleteImage,
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      const filesArray = Array.from(files) as File[];

      const checkLength = totalImageLength + filesArray.length;

      if (checkLength <= 5) {
        setSelectedPhotos((prev: any) => [...prev, ...filesArray]);
      } else {
        window.alert("You can attach a maximum of 3 photos.");
      }
    }
  };

  const handleDeleteSelectedImage = (index: number) => {
    const updatedFiles = selectedPhotos.filter(
      (_: any, i: number) => i !== index,
    );

    setSelectedPhotos(updatedFiles);
  };

  const handleDeleteFetchedImage = (id: number) => {
    const updatedFiles = previewUrls.filter((image: any) => image.id !== id);

    setPreviewUrls(updatedFiles);
    deleteImageMutate(id);
  };

  useEffect(() => {
    setTotalImageLength(selectedPhotos?.length + previewUrls?.length);
  }, [selectedPhotos, previewUrls]);

  return (
    <div className="flex gap-2 overflow-x-auto">
      {/* 사진 하나 없을때 */}
      {selectedPhotos?.length === 0 && previewUrls?.length === 0 ? (
        <div className="w-full px-8 py-6">
          <button
            type="button"
            onClick={openFileInput}
            className="flex w-full cursor-pointer flex-col items-center rounded-lg bg-default-100 py-16 text-base font-semibold text-default-500 hover:bg-default-200"
          >
            <span className="mb-2 flex justify-center">
              <PhotoIcon />
            </span>
            <label>Attach Pictures</label>
            <h3 className="text-xs font-medium text-gray-400">(Max 5pics)</h3>
            <input
              type="file"
              multiple
              accept="image/jpeg, image/png"
              onChange={handleFileChange}
              ref={fileInputRef}
              hidden
            />
          </button>
        </div>
      ) : selectedPhotos?.length > 0 || previewUrls?.length > 0 ? (
        // 사진 가지고 있을 때
        <div className="flex items-center gap-4 p-6">
          {/* 서버에서 가져온 이미지 */}
          {previewUrls.map((image: any) => (
            <div
              key={image.id}
              className="relative size-[140px] xxs:size-[160px] xs:size-[180px] s:size-[200px]"
            >
              <Image
                src={`${BUCKET_URL}${image.url}`}
                alt={`Preview ${image.id}`}
                className="rounded-md object-cover"
                fill
              />
              <button
                type="button"
                onClick={() => handleDeleteFetchedImage(image.id)}
                className="absolute right-[-8px] top-[-8px] flex size-5 items-center justify-center rounded-full bg-red-500 pb-[1.8px] text-white hover:bg-red-600"
              >
                &times;
              </button>
            </div>
          ))}
          {/* 브라우저에 잠깐 올린 사진 */}
          {selectedPhotos.map((file: File, index: number) => (
            <div
              key={index}
              className="relative size-[140px] xxs:size-[160px] xs:size-[180px] s:size-[200px]"
            >
              <Image
                src={URL.createObjectURL(file)}
                alt={`Preview ${index}`}
                className="rounded-lg object-cover"
                fill
              />
              <button
                type="button"
                onClick={() => handleDeleteSelectedImage(index)}
                className="absolute right-[-8px] top-[-8px] flex size-5 items-center justify-center rounded-full bg-red-500 pb-[1.8px] text-white hover:bg-red-600"
              >
                &times;
              </button>
            </div>
          ))}
          {/* 사진이 5개 미만일때, 사진 추가 버튼 */}
          {totalImageLength < 5 && totalImageLength > 0 && (
            <button
              type="button"
              onClick={openFileInput}
              className="ml-4 rounded-full p-1 hover:bg-default-300"
            >
              <PlusCircleIcon className="size-8" />
              <input
                type="file"
                multiple
                accept="image/jpeg, image/png"
                onChange={handleFileChange}
                ref={fileInputRef}
                hidden
              />
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
