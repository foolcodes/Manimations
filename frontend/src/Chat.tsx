import { ArrowUp, BookText, GraduationCap, Sparkles, Code } from "lucide-react";
import ChatButton from "./components/ChatButton";
import ChatInitialPrompts from "./components/ChatInitialPrompts";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import MessageChat from "./components/MessageChat";
import sendPrompt from "./api/sendPrompt.ts";

interface Message {
  text: string;
  isUser: boolean;
  videoUrl?: string; // Add videoUrl property for AI responses that include videos
  code?: string; // Optional code to display
}

interface PromptGroup {
  mode: string;
  prompts: string[];
}

interface InitialButton {
  id: number;
  name: string;
  logo: ReactNode;
}

const Chat = () => {
  const [mode, setMode] = useState<string>("General");
  const [inputText, setInputText] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      text,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await sendPrompt(text);

      // Create AI message with response data
      const aiMessage: Message = {
        text:
          response.text || "I've generated a mathematical animation for you.",
        isUser: false,
        videoUrl: response.videoUrl || null,
        code: response.code || null, // Include code if available
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending prompt:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, there was an error processing your request.",
          isUser: false,
        },
      ]);
    }

    setIsLoading(false);
  };

  // Function to handle example prompt clicks
  const handlePromptClick = (prompt: string) => {
    sendMessage(prompt);
  };

  const onChangeInputText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const initialButtons: InitialButton[] = [
    {
      id: 1,
      logo: <Sparkles size={17} />,
      name: "Create",
    },
    {
      id: 2,
      name: "Experiment",
      logo: <BookText size={17} />,
    },
    {
      id: 3,
      logo: <GraduationCap size={17} />,
      name: "Learn",
    },
  ];

  const initialPrompts: PromptGroup[] = [
    {
      mode: "General",
      prompts: [
        "Create a vibrant animation showing a 3D sphere transforming into a torus",
        "Visualize the Fibonacci sequence with growing spiral patterns",
        "Generate an elegant animation demonstrating wave interference patterns",
        "Animate the process of solving a simple differential equation step by step",
      ],
    },
    {
      mode: "Create",
      prompts: [
        "Create a Manim animation explaining how matrix multiplication works",
        "Generate a scene that visualizes sorting a bar graph using bubble sort",
        "Make an animation to show the beauty of Euler's identity (e^{iπ} + 1 = 0)",
        "Design a geometric transformation animation showing rotation and scaling",
      ],
    },
    {
      mode: "Experiment",
      prompts: [
        "Visualize how changing learning rates affects gradient descent",
        "Compare how sine, cosine, and tangent behave on the same graph",
        "Animate different sorting algorithms side by side for comparison",
        "Experiment with animating a chaotic pendulum motion",
      ],
    },
    {
      mode: "Learn",
      prompts: [
        "Explain the difference between scalar and vector fields with visuals",
        "Visualize how derivatives represent slopes of curves",
        "Show how recursion works using the factorial example",
        "Illustrate the difference between probability and statistics with animation",
      ],
    },
  ];

  const LoadingDots = () => (
    <div className="flex space-x-2 py-2 px-4 rounded-lg self-start">
      <motion.div
        className="w-2 h-2 bg-[#544e58] rounded-full"
        animate={{ scale: [0.8, 1.4, 0.8] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <motion.div
        className="w-2 h-2 bg-[#544e58] rounded-full"
        animate={{ scale: [0.8, 1.4, 0.8] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
      />
      <motion.div
        className="w-2 h-2 bg-[#544e58] rounded-full"
        animate={{ scale: [0.8, 1.4, 0.8] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
      />
    </div>
  );

  return (
    <div className="flex flex-col h-screen">
      <div
        className="flex-1 px-6 pt-13 pb-36 overflow-y-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div
          className={`w-full ${
            messages.length === 0
              ? "h-full flex items-center justify-center"
              : ""
          }`}
        >
          {!inputText && messages.length === 0 ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="p-10 w-3xl"
            >
              <h1 className="text-white text-3xl font-extrabold mb-7">
                How can I help you?
              </h1>
              <div className="flex gap-3">
                {initialButtons.map((eachItem) => (
                  <ChatButton
                    name={eachItem.name}
                    logo={eachItem.logo}
                    setMode={setMode}
                    mode={mode}
                    key={eachItem.id}
                  />
                ))}
              </div>
              <div className="mt-7 grid gap-3">
                {initialPrompts
                  .find((item) => item.mode === mode)
                  ?.prompts.map((prompt, index) => (
                    <ChatInitialPrompts
                      key={index}
                      prompt={prompt}
                      onClick={() => handlePromptClick(prompt)}
                    />
                  ))}
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-4">
              {messages.map((message, index) => (
                <MessageChat key={index} message={message} />
              ))}
              {isLoading && <LoadingDots />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-6">
        <div className="absolute bg-[#2c2431]/50 bottom-0 left-0 right-0 h-34 z-0 rounded-t-3xl max-w-[785px] mx-auto shadow-md" />
        <div className="relative bg-[#2c2431] border border-[#4b3943]/50 z-50 text-white px-5 py-3 rounded-t-2xl shadow-md w-full max-w-3xl mx-auto text-sm">
          <input
            value={inputText}
            onChange={onChangeInputText}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder="Type your message here..."
            className="bg-transparent outline-none w-full pt-1"
          />
          <div className="mt-10 flex justify-between items-center">
            <p className="text-secondary-foreground">Manim</p>
            <button
              onClick={() => inputText.trim() && sendMessage(inputText)}
              className={`p-1.5 rounded-xl ${
                inputText.trim().length === 0
                  ? "cursor-not-allowed bg-pink-800/18"
                  : "cursor-pointer bg-pink-800/40"
              }`}
            >
              <ArrowUp color="pink" size={25} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
