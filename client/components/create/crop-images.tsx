import { useFormContext } from "react-hook-form";
import { CreateFormInputs } from "./create-modal";
import { useCallback, useMemo, useState } from "react";
import Cropper, {
  Area,
  MediaSize,
  getInitialCropFromCroppedAreaPixels,
} from "react-easy-crop";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineMagnifyingGlassPlus,
} from "react-icons/hi2";

const CropImages = () => {
  // WARNING: this is painful to read.

  const { getValues, watch, setValue } = useFormContext<CreateFormInputs>();

  const urls = useMemo(() => getValues("photoURLs"), []);

  const crops = watch("photosCrops", Array(urls.length).fill(null));

  const [currentImage, setCurrentImage] = useState(0);

  const [cropSize, setCropSize] = useState({ width: 0, height: 0 });
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [zoomSliderVisible, setZoomSliderVisible] = useState(false);

  const onCropComplete = useCallback(
    (_: Area, croppedAreaPixels: Area) => {
      setValue("photosCrops", [
        ...crops.slice(0, currentImage),
        { area: croppedAreaPixels, cropSize },
        ...crops.slice(currentImage + 1),
      ]);
    },
    [currentImage, cropSize],
  );

  const onMediaLoaded = useCallback(
    (media: MediaSize) => {
      const current = crops[currentImage];

      if (current == null) return;

      const { crop, zoom } = getInitialCropFromCroppedAreaPixels(
        current.area,
        media,
        0,
        current.cropSize,
        1,
        3,
      );

      setCrop(crop);
      setZoom(zoom);
    },
    [currentImage],
  );

  return (
    <div className="h-full flex flex-col">
      <div className="h-full relative">
        <Cropper
          image={urls[currentImage]}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          setCropSize={setCropSize}
          onMediaLoaded={onMediaLoaded}
        />
        <div>
          <div
            className={`absolute left-4 top-1/2 -translate-y-1/2 ${
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
            className={`absolute right-4 top-1/2 -translate-y-1/2 ${
              currentImage == urls.length - 1 ? "hidden" : ""
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
        </div>
        <div className="absolute bottom-0 w-full flex gap-2 p-4">
          <div className="relative">
            <div
              className={`absolute -top-full left-0 bg-black/60 rounded-lg flex justify-center align-center p-3 ${
                !zoomSliderVisible ? "hidden" : ""
              }`}
            >
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.05}
                aria-labelledby="Zoom"
                className="w-24 h-[1px] bg-black rounded-lg appearance-none cursor-pointer focus:outline-none"
                onChange={(e) => {
                  setZoom(Number(e.target.value));
                }}
              />
            </div>
            <button
              className={`rounded-full w-8 h-8 flex justify-center items-center text-gray-400 hover:opacity-70 ${
                zoomSliderVisible ? "bg-white" : "bg-black/60"
              }`}
              onClick={() => {
                setZoomSliderVisible((prev) => !prev);
              }}
            >
              <HiOutlineMagnifyingGlassPlus
                className={`text-lg ${
                  zoomSliderVisible ? "text-black" : "text-gray-200"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropImages;
