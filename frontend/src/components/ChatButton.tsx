import type { ReactNode } from "react";

const ChatButton = ({
  name,
  logo,
  setMode,
  mode,
}: {
  name: string;
  logo: ReactNode;
  setMode: (mode: string) => void;
  mode: string;
}) => {
  return (
    <button
      onClick={() => setMode(name)}
      className={`flex items-center cursor-pointer rounded-2xl px-6 py-2 text-sm font-semibold text-white mr-3 ${
        mode === name
          ? "bg-pink-800/40 hover:bg-pink-800/70"
          : "bg-[#2d2530] hover:bg-white/15"
      }`}
    >
      <span className="pr-2">{logo}</span>
      <span>{name}</span>
    </button>
  );
};

export default ChatButton;
