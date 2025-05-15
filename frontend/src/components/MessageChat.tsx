import { motion } from "framer-motion";
import { useState } from "react";
import { Code } from "lucide-react";

interface MessageProps {
  message: {
    text: string;
    isUser: boolean;
    videoUrl?: string;
    code?: string;
  };
}

const MessageChat = ({ message }: MessageProps) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const toggleCode = () => {
    setShowCode(!showCode);
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`py-3 px-4 rounded-2xl ${
          message.isUser ? "max-w-[75%]" : "max-w-[85%]"
        } ${
          message.isUser
            ? "bg-pink-800/40 text-white"
            : "bg-[#544e58]/50 text-white"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>

        {/* Video player */}
        {message.videoUrl && (
          <div className="mt-3">
            <div className="relative">
              {!isVideoLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                  <div className="animate-spin h-8 w-8 border-4 border-pink-500 rounded-full border-t-transparent"></div>
                </div>
              )}
              <video
                className="w-full rounded-lg"
                controls
                onLoadedData={() => setIsVideoLoaded(true)}
                onError={(e) => console.error("Video load error:", e)}
              >
                <source
                  src={`https://manimations-production-d97f.up.railway.app${message.videoUrl}`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}

        {/* Code display toggle */}
        {message.code && !message.isUser && (
          <div className="mt-3">
            <button
              onClick={toggleCode}
              className="flex items-center gap-2 text-sm text-pink-300 hover:text-pink-200 transition-colors"
            >
              <Code size={16} />
              {showCode ? "Hide code" : "Show code"}
            </button>

            {showCode && (
              <div className="mt-2 bg-[#1e1922] p-3 rounded-lg overflow-x-auto text-sm">
                <pre className="text-pink-100 font-mono whitespace-pre-wrap">
                  {message.code}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MessageChat;
