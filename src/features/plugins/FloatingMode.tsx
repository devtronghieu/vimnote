import Modal from "@/components/Modal";
import { pluginState } from "@/state/vim";
import { useSnapshot } from "valtio";

const FloatingMode = () => {
  const mode = useSnapshot(pluginState).mode;

  return (
    <Modal className={`z-100 top-5 left-5 px-4 py-2 with-border`}>{mode}</Modal>
  );
};

export default FloatingMode;
