import { ChangeEvent, useRef, useState } from "react";
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

  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const [totalImages, setTotalImages] = useState<File[]>([]);

  const { mutate: deleteImageMutate } = useMutation({
    mutationKey: ["deleteImage"],
    mutationFn: deleteImage,
    onSuccess: (data) => {
      const updatedFiles = previewUrls.filter(
        (photo: any) => photo.id !== data.id,
      );
      setPreviewUrls(updatedFiles);
    },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      const filesArray = Array.from(files) as File[];
      console.log(filesArray);
      const checkLength = totalImages.length + filesArray.length;

      if (checkLength <= 3) {
        setSelectedPhotos((prev: any) => [...prev, ...filesArray]);
        setTotalImages((prev: any) => [...prev, ...filesArray]);
      } else {
        window.alert("You can attach a maximum of 3 photos.");
      }

      // onPhotosChange(updatedFiles);
    }
  };

  const handleDeleteSelectedImage = (index: number) => {
    const updatedFiles = selectedPhotos.filter(
      (_: any, i: number) => i !== index,
    );

    const updatedImages = totalImages.filter((_, i) => i !== index);

    setSelectedPhotos(updatedFiles);
    setTotalImages(updatedImages);

    // onPhotosChange(updatedFiles);
  };

  const handleDeleteFetchedImage = (index: number) => {
    deleteImageMutate(index);
  };

  return (
    <div className="flex gap-2 px-1 py-6">
      {/* 사진 하나 없을때 */}
      {selectedPhotos?.length === 0 && previewUrls?.length === 0 ? (
        <button
          type="button"
          onClick={openFileInput}
          className="flex w-full cursor-pointer flex-col items-center rounded-lg bg-default-100 py-16 text-base font-semibold text-gray-400 hover:bg-gray-300"
        >
          <span className="mb-2 flex justify-center">
            <PhotoIcon />
          </span>
          <label>Attach Pictures</label>
          <h3 className="text-xs font-medium text-gray-400">(Max 3pics)</h3>
          <input
            type="file"
            multiple
            accept="image/jpeg, image/png"
            onChange={handleFileChange}
            ref={fileInputRef}
            hidden
          />
        </button>
      ) : selectedPhotos?.length > 0 || previewUrls?.length > 0 ? (
        // 사진 가지고 있을 때
        <div className="flex w-full items-center justify-center gap-2">
          {/* 브라우저에 잠깐 올린 사진 */}
          {selectedPhotos.map((file: File, index: number) => (
            <div
              key={index}
              className="relative aspect-square w-full max-w-[200px]"
            >
              <Image
                src={URL.createObjectURL(file)}
                alt={`Preview ${index}`}
                className="rounded-md object-cover"
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
          {/* 서버에서 가져온 이미지 */}
          {previewUrls.map((image: any) => (
            <div key={image.id} className="relative h-[100px] w-[100px]">
              <Image
                src={`${BUCKET_URL}${image.url}`}
                alt={`Preview ${image.id}`}
                className="rounded-md object-cover"
                fill
              />
              <button
                type="button"
                onClick={() => handleDeleteFetchedImage(image.id)}
                className="absolute right-[-8px] top-[-8px] flex h-5 w-5 items-center justify-center rounded-full bg-red-500 pb-[1.8px] text-white hover:bg-red-600"
              >
                &times;
              </button>
            </div>
          ))}
          {/* 사진이 3개 미만일때, 사진 추가 버튼 */}
          {totalImages.length < 3 && totalImages.length > 0 && (
            <button
              type="button"
              onClick={openFileInput}
              className="ml-8 rounded-full p-1 hover:bg-default-300"
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

// {previewUrls.length > 0 ? (
//   <div className="flex w-full flex-wrap justify-center gap-2">
//     {previewUrls.map((url, index) => (
//       <div key={index} className="relative">
//         <Image
//           src={url}
//           alt={`Preview ${index}`}
//           className="h-32 w-32 rounded-md object-cover"
//         />
//         <button
//           onClick={() => handleDeleteImage(index)}
//           className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 pb-[1.8px] text-white hover:bg-red-600"
//           style={{ cursor: "pointer" }}
//         >
//           &times; {/* 이 부분은 삭제 아이콘을 나타냅니다. */}
//         </button>
//       </div>
//     ))}
//   </div>
// ) : (
//   <label className="flex w-full cursor-pointer flex-col items-center rounded-lg bg-default-100 py-16 py-6 text-base font-semibold text-gray-400 hover:bg-gray-300">
//     <input
//       type="file"
//       multiple
//       accept="image/jpeg, image/png"
//       onChange={handleFileChange}
//       style={{ display: "none" }}
//     />
//     <span className="mb-2 flex justify-center">
//       <PhotoIcon />
//     </span>
//     사진을 등록해주세요
//     <h3 className="text-xs font-medium text-gray-400">(최대 3장)</h3>
//   </label>
// )}
