import { Area } from "react-easy-crop";
import { v4 as uuidv4 } from "uuid";
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area | undefined,
): Promise<File> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("could not get canvas context");

  canvas.width = image.width;
  canvas.height = image.height;

  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement("canvas");

  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) throw new Error("could not get canvas context");

  const min = Math.min(image.width, image.height);

  croppedCanvas.width = pixelCrop?.width ?? min;
  croppedCanvas.height = pixelCrop?.height ?? min;

  croppedCtx.drawImage(
    canvas,
    pixelCrop?.x ?? 0,
    pixelCrop?.y ?? 0,
    pixelCrop?.width ?? min,
    pixelCrop?.height ?? min,
    0,
    0,
    pixelCrop?.width ?? min,
    pixelCrop?.height ?? min,
  );

  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob((file) => {
      if (!file) return reject();
      resolve(
        new File([file], `${uuidv4()}.jpg`, {
          type: "image/jpeg",
        }),
      );
    }, "image/jpeg");
  });
}
