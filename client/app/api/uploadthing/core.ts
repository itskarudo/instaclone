import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const appFileRouter = {
  postUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 10 },
  }).onUploadComplete(() => {}),
} satisfies FileRouter;

export type AppFileRouter = typeof appFileRouter;
