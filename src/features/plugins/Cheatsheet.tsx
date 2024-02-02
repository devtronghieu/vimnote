import Key from "@/components/Key";
import Modal from "@/components/Modal";
import { Keymap, PluginModal, vimState } from "@/state/vim";
import { useSnapshot } from "valtio";

const Cheatsheet = () => {
  const isShown = useSnapshot(vimState).modals.includes(PluginModal.Cheatsheet);

  if (!isShown) return null;

  return (
    <Modal
      center
      className={`
        h-4/5 w-[90%] lg:w-3/5 p-8 overflow-scroll no-scrollbar
        glass-effect with-border
      `}
    >
      <h2 className="text-xl font-bold text-center mb-6">Cheat sheet</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {Object.values(Keymap).map((mode) => {
          return (
            <div key={mode.name} className="flex flex-1 flex-col gap-4">
              <div>
                <h3 className="text-lg font-semibold">{mode.name}</h3>
                <p>{mode.desc}</p>
              </div>

              <div className="flex flex-col gap-2">
                {Object.keys(mode.keys).map((key) => {
                  return (
                    <div key={key} className="flex items-center gap-2">
                      <Key name={key} /> {mode.keys[key].desc}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default Cheatsheet;
