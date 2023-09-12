import useMultiPage from "@/hooks/useMultiPage";
import Modal from "../modal";
import FileUpload from "./file-upload";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import multiPageContext from "@/contexts/multiPageContext";
import createModalContext from "@/contexts/createModalContext";
import CropImages from "./crop-images";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import { useContext } from "react";
import { Area } from "react-easy-crop";
import getCroppedImg from "@/utils/cropImage";
import CaptionView from "./caption-view";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import { AppFileRouter } from "@/app/api/uploadthing/core";
import { graphql } from "@/generated";
import getUrqlClient from "@/utils/getUrqlClient";

export interface CropData {
  area: Area;
  cropSize: { width: number; height: number };
}

export const createPageModal = createModalContext();

const { uploadFiles } = generateReactHelpers<AppFileRouter>();

// FIXME: most of this data probably needs to be in a separate context provider instead
// but I DONT GIVE A FUCK
export interface CreateFormInputs {
  photoURLs: string[];
  photosCrops: (CropData | null)[];
  croppedFiles: File[];
  caption: string;
}

const BackArrow = () => {
  const multipage = useContext(multiPageContext);
  return (
    <button onClick={multipage.goPrevious} className="h-full">
      <HiOutlineArrowLeft className="text-xl" />
    </button>
  );
};

const mutation = graphql(`
  mutation CreatePost($caption: String!, $photoURLs: [String!]!) {
    createPost(caption: $caption, photoURLs: $photoURLs) {
      id
    }
  }
`);

const CreateModal = () => {
  const form = useForm<CreateFormInputs>();

  const photoURLs = form.watch("photoURLs");
  const photosCrops = form.watch("photosCrops");

  const multipage = useMultiPage({
    pages: [<FileUpload />, <CropImages />, <CaptionView />],
  });

  const modal = useContext(createPageModal.modalContext);

  const cropGoNext = async () => {
    form.setValue(
      "croppedFiles",
      await Promise.all(
        photoURLs.map(async (url, i) => {
          return await getCroppedImg(url, photosCrops[i]?.area);
        }),
      ),
    );

    multipage.goNext();
  };

  const onSubmit: SubmitHandler<CreateFormInputs> = async (inputs) => {
    const client = getUrqlClient();

    // TODO: error handling
    const res = await uploadFiles({
      files: inputs.croppedFiles,
      endpoint: "postUploader",
    });

    const photoURLs = res.map((f) => f.url);

    await client.mutation(mutation, {
      caption: inputs.caption,
      photoURLs,
    });

    modal.setIsOpen(false);
  };

  const leftComps = [null, <BackArrow />, <BackArrow />];
  const rightComps = [
    null,
    <button
      className="float-right text-blue-500 hover:text-blue-800"
      onClick={cropGoNext}
    >
      Next
    </button>,
    <button
      className="float-right text-blue-500 hover:text-blue-800"
      onClick={form.handleSubmit(onSubmit)}
    >
      Share
    </button>,
  ];

  return (
    <multiPageContext.Provider value={multipage}>
      <Modal
        title="Create new post"
        context={createPageModal.modalContext}
        leftComponent={leftComps[multipage.currentIndex]}
        rightComponent={rightComps[multipage.currentIndex]}
        onCloseRequest={() => {
          form.reset();
          multipage.reset();
        }}
        className={`h-[calc(100vh-15%)] ${
          multipage.currentIndex == 2 ? "w-3/5" : "w-2/5"
        }`}
      >
        <FormProvider {...form}>{multipage.currentPage}</FormProvider>
      </Modal>
    </multiPageContext.Provider>
  );
};

export default CreateModal;
