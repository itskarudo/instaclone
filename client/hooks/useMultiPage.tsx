import { ReactNode, useState } from "react";

interface Options {
  pages: ReactNode[];
}

export interface MultiPageType {
  currentIndex: number;
  currentPage: ReactNode;
  goNext: () => void;
  goPrevious: () => void;
  reset: () => void;
}

const useMultiPage = (options: Options): MultiPageType => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const goNext = () => {
    if (currentPageIndex < options.pages.length - 1)
      setCurrentPageIndex((prev) => prev + 1);
  };

  const goPrevious = () => {
    if (currentPageIndex > 0) setCurrentPageIndex((prev) => prev - 1);
  };

  const reset = () => {
    setCurrentPageIndex(0);
  };

  return {
    currentIndex: currentPageIndex,
    currentPage: options.pages[currentPageIndex],
    goNext,
    goPrevious,
    reset,
  };
};

export default useMultiPage;
