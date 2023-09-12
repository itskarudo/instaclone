import ReactModal from "react-modal";
import {
  Context,
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { ModalContextType } from "@/contexts/createModalContext";

interface ModalProps {
  title: string;
  context: Context<ModalContextType>;
  className?: string;
  onCloseRequest?: () => void;
  leftComponent?: ReactNode;
  rightComponent?: ReactNode;
}

const Modal: React.FC<PropsWithChildren<ModalProps>> = ({
  children,
  title,
  context,
  className,
  onCloseRequest,
  leftComponent,
  rightComponent,
}) => {
  useEffect(() => {
    ReactModal.setAppElement("#modal");
  }, []);

  const modal = useContext(context);

  return (
    <ReactModal
      isOpen={modal.isOpen}
      onRequestClose={() => {
        onCloseRequest && onCloseRequest();
        modal.setIsOpen(false);
      }}
      className={`absolute top-1/2 left-1/2 bg-white -translate-x-1/2 -translate-y-1/2 rounded-xl overflow-hidden flex flex-col ${
        className ?? ""
      }`}
      overlayClassName="fixed inset-0 bg-black/70"
    >
      <div className="flex font-bold p-3 border-b-[1px] border-gray-300 border-solid">
        <div className="flex-1">{leftComponent}</div>
        <h3 className="flex-1 text-center">{title}</h3>
        <div className="flex-1">{rightComponent}</div>
      </div>
      <div className="flex-1">{children}</div>
    </ReactModal>
  );
};

export default Modal;
