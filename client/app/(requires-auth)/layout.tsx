"use client";
import getUrqlClient from "@/utils/getUrqlClient";
import { UrqlProvider, ssrExchange } from "@urql/next";

const ssr = ssrExchange();
const client = getUrqlClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UrqlProvider client={client} ssr={ssr}>
      {children}
    </UrqlProvider>
  );
}
