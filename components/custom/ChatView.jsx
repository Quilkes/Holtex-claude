"use client";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import Lookup from "@/data/Lookup";
import axios from "axios";
import { useMutation, useQuery } from "convex/react";
import { Send, Loader2Icon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useContext, useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import useSharedState from "@/store/useShareState";

export const countToken = (inputText) => {
  return inputText
    .trim()
    .split(/\s+/)
    .filter((word) => word).length;
};

function ChatView() {
  const { id } = useParams();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [userInput, setUserInput] = useState("");
  const [processingRequest, setProcessingRequest] = useState(false);
  const [isFollowUpMessageLoading, setisFollowUpMessageLoading] =
    useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [initialResponseSent, setInitialResponseSent] = useState(false);
  const UpdateMessage = useMutation(api.workspace.UpdateMessage);
  const UpdateToken = useMutation(api.users.UpdateToken);
  const router = useRouter();
  const chatContainerRef = useRef();
  const messagesEndRef = useRef();
  const { requestCodeGeneration } = useSharedState();
  const hasGeneratedInitialResponse = useRef(false);

  // Get messages directly from Convex
  const workspaceData = useQuery(api.workspace.GetWorkspace, {
    workspaceId: id,
  });
  const messages = workspaceData?.messages || [];

  useEffect(() => {
    if (!userDetail) {
      router.push("/");
      return;
    }
  }, [userDetail]);

  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, processingRequest]);

  // Chat container height adjustment
  useEffect(() => {
    const adjustHeight = () => {
      if (chatContainerRef.current) {
        const viewportHeight = window.innerHeight;
        const offsetTop = chatContainerRef.current.getBoundingClientRect().top;
        const availableHeight = viewportHeight - offsetTop - 2;
        chatContainerRef.current.style.height = `${availableHeight}px`;
      }
    };

    adjustHeight();
    window.addEventListener("resize", adjustHeight);
    return () => window.removeEventListener("resize", adjustHeight);
  }, []);

  useEffect(() => {
    // Only run when component first mounts
    if (initialLoading) {
      const timer = setTimeout(() => {
        setInitialLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [initialLoading]);

  useEffect(() => {
    // Only proceed if:
    // 1. Initial loading is complete
    // 2. We haven't sent an initial response yet
    // 3. Workspace data exists
    // 4. There's exactly one message from the user
    // 5. We're not already processing a request
    if (
      !initialLoading &&
      !hasGeneratedInitialResponse.current &&
      workspaceData &&
      messages.length === 1 &&
      messages[0].role === "user" &&
      !processingRequest
    ) {
      // Mark that we've sent the initial response
      hasGeneratedInitialResponse.current = true;

      // Now trigger the AI response
      setProcessingRequest(true);
      GetAiResponse(messages).finally(() => setProcessingRequest(false));
    }
  }, [initialLoading, workspaceData, messages, processingRequest]);

  const GetAiResponse = async (updatedMessages) => {
    try {
      const formattedMessages = updatedMessages.map(({ role, content }) => ({
        role,
        content,
      }));

      const { data } = await axios.post("/api/ai-chat", {
        prompt: formattedMessages,
      });

      if (!data.result) throw new Error("Empty AI response");

      const aiResp = {
        _id: `temp-ai-${Date.now()}`,
        role: "ai",
        content: data.result,
        createdAt: Date.now(),
      };

      // Use passed messages to ensure consistency
      const newMessages = [...updatedMessages, aiResp];

      await UpdateMessage({
        messages: newMessages,
        workspaceId: id,
      });

      // Update token usage
      const tokenUsage = countToken(JSON.stringify(aiResp));
      const remTokens = Math.max(0, userDetail?.token - tokenUsage);

      await UpdateToken({
        token: remTokens,
        userId: userDetail?._id,
      });

      setUserDetail((prev) => ({ ...prev, token: remTokens }));

      // Trigger code generation with the updated messages
      // This will notify CodeView that it needs to generate new code
      requestCodeGeneration(newMessages);
    } catch (error) {
      console.error("AI Response Error:", error);
      toast.error("Failed to get AI response");
    }
  };

  const onGenerate = async (input) => {
    if (!input.trim()) return;
    if ((userDetail?.token || 0) < 10) {
      toast.error("Insufficient tokens");
      router.push("/pricing");
      return;
    }

    try {
      setProcessingRequest(true);
      const userMessage = {
        _id: `temp-${Date.now()}`,
        role: "user",
        content: input.trim(),
        createdAt: Date.now(),
      };

      await UpdateMessage({
        messages: [...messages, userMessage],
        workspaceId: id,
      });

      setUserInput("");

      await GetAiResponse([...messages, userMessage]);
      // init coodeView functions
    } catch (error) {
      console.error("Message Submission Error:", error);
      toast.error("Failed to send message");
    } finally {
      setProcessingRequest(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onGenerate(userInput);
    }
  };

  return (
    <div
      ref={chatContainerRef}
      className="relative h-full w-full flex flex-col bg-slate-100 rounded-md border"
    >
      <div className="flex-1 overflow-y-auto scrollbar-hide rounded-lg">
        {messages.length === 0 && !processingRequest && (
          <div className="h-full text-center flex items-center justify-center text-gray-500">
            <p className="w-3/4">Start a conversation by typing below</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`p-3 rounded-lg mb-2 flex gap-2 ${
              msg.role === "user" ? "bg-slate-100" : "bg-purple-50"
            } items-start leading-7`}
          >
            {msg.role === "user" ? (
              <Image
                src={userDetail?.picture || "/placeholder-avatar.png"}
                width={35}
                height={35}
                className="rounded-full mt-1"
                alt="User"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center mt-1">
                <span className="text-white text-sm font-bold">H</span>
              </div>
            )}
            <ReactMarkdown className="flex text-base flex-col text-slate-700 break-words w-full">
              {msg.content}
            </ReactMarkdown>
          </div>
        ))}

        {processingRequest && (
          <div className="p-5 rounded-lg mb-2 flex gap-2 justify-center items-center bg-purple-100">
            <Loader2Icon className="animate-spin text-purple-600" />
            <span className="text-purple-800">Generating response...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2 items-end sticky bottom-0 bg-slate-50 pb-1.5">
        <div className="border p-3 rounded-xl w-full shadow-sm">
          <div className="flex gap-2 items-end">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={Lookup.INPUT_PLACEHOLDER}
              className="outline-none bg-transparent w-full max-h-32 min-h-20 resize-none"
              rows={Math.min(3, userInput.split("\n").length || 1)}
              disabled={processingRequest}
            />
            <button
              disabled={!userInput.trim() || processingRequest}
              onClick={() => onGenerate(userInput)}
              className={`flex-shrink-0 ${
                userInput.trim() && !processingRequest
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-gray-300 cursor-not-allowed"
              } text-white p-2 h-10 w-10 rounded-full flex items-center justify-center`}
            >
              {processingRequest ? (
                <Loader2Icon size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>

          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <div>
              {userDetail?.token !== undefined && (
                <span>{userDetail.token} tokens remaining</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {initialLoading && (
        <div className="p-5 rounded-lg mb-2 flex gap-2 justify-center items-center bg-purple-100">
          <Loader2Icon className="animate-spin text-purple-600" />
          <span className="text-purple-800">Preparing workspace...</span>
        </div>
      )}
    </div>
  );
}

export default React.memo(ChatView);
