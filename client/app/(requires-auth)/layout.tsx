"use client";
import CreateModal from "@/components/create/create-modal";
import getUrqlClient from "@/utils/getUrqlClient";
import { UrqlProvider, ssrExchange } from "@urql/next";
import { createPageModal } from "@/components/create/create-modal";

const ssr = ssrExchange();
const client = getUrqlClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UrqlProvider client={client} ssr={ssr}>
      <createPageModal.ModalContextProvider>
        {children}
        <CreateModal />
      </createPageModal.ModalContextProvider>
    </UrqlProvider>
  );
}
