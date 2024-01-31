import { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
  center?: boolean;
  className?: string;
}

const Modal: FC<Props> = ({ children, center, className }) => {
  return (
    <div
      className={`fixed ${center && "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"} z-10 ${className}`}
    >
      {children}
    </div>
  );
};

export default Modal;
