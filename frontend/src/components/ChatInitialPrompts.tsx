import { motion } from "framer-motion";

interface ChatInitialPromptsProps {
  prompt: string;
  onClick: () => void;
}

const ChatInitialPrompts = ({ prompt, onClick }: ChatInitialPromptsProps) => {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-[#534b58]/30 p-3 rounded-xl cursor-pointer hover:bg-[#534b58]/50 transition-all"
      onClick={onClick}
    >
      <p className="text-secondary-foreground text-sm">{prompt}</p>
    </motion.div>
  );
};

export default ChatInitialPrompts;
