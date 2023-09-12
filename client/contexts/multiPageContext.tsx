"use client";

import { MultiPageType } from "@/hooks/useMultiPage";
import { createContext } from "react";

const multiPageContext = createContext<MultiPageType>({
  currentIndex: 0,
  currentPage: null,
  goNext: () => {},
  goPrevious: () => {},
  reset: () => {},
});

export default multiPageContext;
