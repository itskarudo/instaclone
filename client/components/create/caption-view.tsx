import { useFormContext } from "react-hook-form";
import { CreateFormInputs } from "./create-modal";
import Image from "next/image";
import { useContext, useMemo, useState } from "react";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";
import authContext from "@/contexts/authContext";
import { profileImageURL } from "@/utils/paths";

const CaptionView = () => {
  const auth = useContext(authContext);

  const { getValues, register, watch } = useFormContext<CreateFormInputs>();

  const caption = watch("caption", "");

  const [currentImage, setCurrentImage] = useState(0);

  const croppedFiles = getValues("croppedFiles");

  const croppedURLs = useMemo(
    () => croppedFiles.map((file) => URL.createObjectURL(file)),
    [croppedFiles],
  );

  return (
    <div className="h-full flex">
      <div className="h-full w-fit aspect-square relative">
        <div
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 ${
            currentImage == 0 ? "hidden" : ""
          }`}
        >
          <button
            className="rounded-full w-8 h-8 flex justify-center items-center text-gray-400 hover:opacity-70 bg-black/60"
            onClick={() => {
              setCurrentImage((prev) => prev - 1);
            }}
          >
            <HiOutlineChevronLeft className="text-lg text-gray-200" />
          </button>
        </div>
        <div
          className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 ${
            currentImage == croppedURLs.length - 1 ? "hidden" : ""
          }`}
        >
          <button
            className="rounded-full w-8 h-8 flex justify-center items-center text-gray-400 hover:opacity-70 bg-black/60"
            onClick={() => {
              setCurrentImage((prev) => prev + 1);
            }}
          >
            <HiOutlineChevronRight className="text-lg text-gray-200" />
          </button>
        </div>
        <Image src={croppedURLs[currentImage]} fill alt="zbi" />
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex gap-2 items-center">
          <div className="rounded-full overflow-hidden">
            <Image
              src={profileImageURL(auth.profilePicURL)}
              width={28}
              height={28}
              alt="pp"
            />
          </div>
          <span className="text-sm font-bold">{auth.username}</span>
        </div>
        <div className="mt-4 w-full">
          <textarea
            className="w-full resize-none focus:outline-none h-36"
            maxLength={2200}
            placeholder="Write a caption..."
            {...register("caption")}
          ></textarea>
        </div>
        <div className="flex justify-end text-xs text-gray-400 mt-2">
          {caption.length.toLocaleString()}/2,200
        </div>
      </div>
    </div>
  );
};

export default CaptionView;
