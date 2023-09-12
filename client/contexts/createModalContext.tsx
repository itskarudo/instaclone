import {
  Context,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useState,
} from "react";

export interface ModalContextType {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export interface CreateModalType {
  modalContext: Context<ModalContextType>;
  ModalContextProvider: React.FC<PropsWithChildren>;
}

const createModalContext = (): CreateModalType => {
  const modalContext = createContext<ModalContextType>({
    isOpen: false,
    setIsOpen: () => {},
  });

  const ModalContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <modalContext.Provider value={{ isOpen, setIsOpen }}>
        {children}
      </modalContext.Provider>
    );
  };

  return { modalContext, ModalContextProvider };
};

export default createModalContext;
