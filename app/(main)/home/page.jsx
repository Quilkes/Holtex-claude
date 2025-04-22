"use client";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import { MessageCircle, Send, Bot, DiscIcon, Stars } from "lucide-react";
import React, { useContext, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import useSidebar from "@/app/store/sidebar";
import useMessage from "@/app/store/useMessage";
import Lookup from "@/app/constants/Lookup";
import { BACKEND_URL } from "@/app/utils/config";

export default function page() {
  const [userInput, setUserInput] = useState("");
  const { setMessages } = useMessage();
  const { userDetail } = useContext(UserDetailContext);
  const [isGenerating, setIsGenerating] = useState(false);
  const [enhancedInput, setEnhancedInput] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const createWorkspace = useMutation(api.workspace.CreateWorkspace);
  const router = useRouter();
  const { setSideBar } = useSidebar();

  const [isProcessing, setIsProcessing] = useState(false);

  const onGenerate = async (input) => {
    if (isProcessing) return; // Prevent duplicate calls
    setIsProcessing(true);

    if (!input || input.trim() === "") {
      toast.error("Please enter a prompt first");
      setIsProcessing(false);
      return;
    }

    setIsGenerating(true);
    setSideBar(false);

    if (!userDetail || !userDetail._id) {
      router.push("/auth/sign-in");
      setIsGenerating(false);
      setIsProcessing(false);
      return;
    }

    if (!userDetail?.token || userDetail.token < 10) {
      toast("You don't have enough tokens!");
      setIsGenerating(false);
      setIsProcessing(false);
      router.push("/pricing");
      return;
    }

    try {
      // Create a new user message with required fields
      const messageObj = {
        _id: `temp-${Date.now()}`,
        role: "user",
        content: input.trim(),
        createdAt: Date.now(),
      };

      // Store the messages in context first
      setMessages([messageObj]);

      // Then create the workspace
      const workspaceId = await createWorkspace({
        user: userDetail._id,
        messages: [messageObj],
      });

      if (!workspaceId) {
        throw new Error("Workspace creation failed");
      }

      // Navigate to the workspace page
      router.push(`/workspace/${workspaceId}`);
    } catch (error) {
      console.error("Error generating workspace:", error.message);
      toast.error("Failed to create workspace. Please try again.");
      setIsGenerating(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEnhance = async () => {
    if (!userInput.trim()) return;

    if (!userDetail?.token || userDetail.token < 10) {
      toast("You don't have enough tokens!");
      router.push("/pricing");
      return;
    }

    setIsEnhancing(true);
    setEnhancedInput("");

    try {
      const response = await fetch(`${BACKEND_URL}/enhance-prompt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userInput }),
      });

      if (!response.ok) {
        throw new Error("Failed to enhance prompt");
      }

      console.log(response);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.trim().split("\n");

        for (const line of lines) {
          if (line.startsWith("data:")) {
            const content = line.replace("data: ", "");

            try {
              const parsedData = JSON.parse(content);

              if (parsedData.done) continue;

              if (parsedData.text) {
                const cleanedText = parsedData.text.replace(/^"|"$/g, "");
                accumulatedText += cleanedText;
                setEnhancedInput(accumulatedText);
              }
            } catch (err) {
              console.error("Error parsing JSON:", err);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error enhancing prompt:", error);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="flex flex-col justify-center px-4 md:px-0 items-center mt-24 md:mt-36 gap-2 relative">
      <h2 className="font-bold text-4xl md:text-5xl text-center relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
        {Lookup.HERO_HEADING}
      </h2>
      <p className="text-gray-400 font-medium text-center relative z-10">
        {Lookup.HERO_DESC}
      </p>

      <div
        className="p-5 border-2 border-transparent rounded-xl transition-all 
        shadow-[0_0_3px_rgba(59,130,246,0.4)] hover:shadow-[0_0_5px_rgba(124,58,237,0.5)] 
        hover:border-purple-400 focus-within:shadow-[0_0_6px_rgba(59,130,246,0.6)] 
        focus-within:border-blue-400 w-full max-w-2xl mt-3"
      >
        <div className="flex gap-2">
          <textarea
            type="text"
            placeholder={Lookup.INPUT_PLACEHOLDER}
            value={enhancedInput || userInput}
            onChange={(e) => {
              setUserInput(e.target.value);
              setEnhancedInput("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onGenerate(userInput);
              }
            }}
            className="outline-none bg-transparent text-sm font-medium w-full h-32 max-h-56 resize-none"
          />
          <AnimatePresence>
            {userInput && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
                onClick={() => {
                  onGenerate(userInput);
                }}
                className={`p-2 text-white h-8 rounded-lg w-8 grid place-content-center shadow-blue-500/20 ${isGenerating || (isEnhancing ? "cursor-not-allowed bg-gray-300" : "bg-gradient-to-r from-blue-500 to-blue-600  hover:from-blue-600 hover:to-blue-700 shadow-md")}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isGenerating || isEnhancing}
              >
                {isGenerating ? (
                  <div className="h-5 w-5 border-2 border-gray-200 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {userInput && (
          <button
            onClick={handleEnhance}
            disabled={isEnhancing || isGenerating}
            className="cursor-pointer w-fit relative flex items-center justify-center "
          >
            {isEnhancing ? (
              <div
                className={`h-5 w-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin ${isEnhancing ? "cursor-not-allowed" : "cursor-pointer"}`}
              />
            ) : (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={` ${isGenerating ? "cursor-not-allowed text-slate-300" : "text-green-500 drop-shadow-[0_0_3px_rgba(34,197,94,0.5)]"}`}
              >
                <Stars className="h-5 w-5" />
              </motion.div>
            )}
          </button>
        )}
      </div>
      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 relative z-10">
        <Bot className="w-4 h-4 text-blue-500" />
        <span>AI Assistant is ready to help you build your project</span>
      </div>
      <div className="flex mt-8 flex-wrap max-w-2xl items-center justify-center gap-3 relative z-10">
        {Lookup.SUGGSTIONS.map((suggestion, index) => (
          <h2
            key={index}
            onClick={() => setUserInput(suggestion)}
            className="p-1 px-2 border border-gray-200 rounded-full text-sm text-gray-400 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50 hover:shadow-[0_0_8px_rgba(124,58,237,0.2)] transition-all cursor-pointer"
          >
            {suggestion}
          </h2>
        ))}
      </div>
      {/* Footer */}
      <footer className="pt-12 mt-16 border-t border-gray-200 w-full relative z-10">
        <div className="text-center">
          <div className="inline-block mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg shadow-purple-500/10">
            Holtex AI is in its experimental stage
          </div>

          <p className="mb-6 text-gray-600">
            Built with ❤️ by Holtex AI. Empowering developers to build smarter.
          </p>

          <div className="flex justify-center gap-4 mb-8">
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-600 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all"
            >
              <DiscIcon className="w-5 h-5 text-gray-600" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-gray-100 hover:bg-purple-100 hover:text-purple-600 hover:shadow-[0_0_10px_rgba(124,58,237,0.3)] transition-all"
            >
              <MessageCircle className="w-5 h-5 text-gray-600" />
            </a>
          </div>

          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Holtex AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
