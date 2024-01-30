import Modal from "@/components/Modal";
import { appState } from "@/state";
import { useSnapshot } from "valtio";

const Cheatsheet = () => {
  const cheatsheetSnap = useSnapshot(appState).cheatsheet;

  if (!cheatsheetSnap) {
    return null;
  }

  return (
    <Modal
      center
      className="h-4/5 w-3/5 glass-effect border border-black dark:border-white rounded-lg"
    >
      Cheatsheet
    </Modal>
  );
};

export default Cheatsheet;
