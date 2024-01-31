import Modal from "@/components/Modal";
import { FC, useEffect, useState } from "react";

interface Props {
  keyName?: string;
}

const FloatingKey: FC<Props> = ({ keyName }) => {
  const [appeared, setAppeared] = useState(false);

  useEffect(() => {
    setAppeared(true);
    const timeoutID = setTimeout(() => {
      setAppeared(false);
    }, 1000);

    return () => clearTimeout(timeoutID);
  }, [keyName]);

  if (!keyName) {
    return null;
  }

  return (
    <Modal
      className={`
        z-100 top-5 right-5 px-4 py-2
        with-border
        transition-opacity duration-500 ease-in ${appeared ? "opacity-100" : "opacity-0"}
      `}
    >
      {keyName}
    </Modal>
  );
};

export default FloatingKey;
