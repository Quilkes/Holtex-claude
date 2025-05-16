"use client";

import { api } from "@/convex/_generated/api";
import Lookup from "@/app/constants/Lookup";
import { useMutation, useQuery } from "convex/react";
import { Send, Loader2Icon } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { countToken } from "@/app/constants/functions";
import { StepsList } from "./StepsList";
import useFiles from "@/app/store/useFiles";
import { parseXml } from "@/app/lib/parseXml";
import { Loader } from "@/app/utils/loaders/loader";
import { BACKEND_URL } from "@/app/utils/config";
import axios from "axios";
import uuid4 from "uuid4";
import useCredentials from "@/app/store/useCredentials";
import BuildStepsLoader from "@/app/utils/loaders/BuildStepsLoader";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function ChatView({ steps, setSteps, llmMessages, setLlmMessages }) {
  const { id } = useParams();
  const router = useRouter();
  const { updateUserDetail, userDetail } = useCredentials();
  const { isLoading, setIsLoading } = useFiles();
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const chatContainerRef = useRef();
  const messagesEndRef = useRef();

  // Get messages directly from Convex
  const workspaceData = useQuery(api.workspace.GetWorkspace, {
    workspaceId: id,
  });
  const messages = workspaceData?.messages || [];
  const UpdateTokens = useMutation(api.users.UpdateToken);

  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, steps]);

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

  return (
    <div
      ref={chatContainerRef}
      className="relative flex flex-col w-full h-full bg-white border rounded-md dark:bg-gray-900 dark:border-gray-700 border-slate-200"
    >
      <div
        className="flex-1 overflow-y-auto rounded-lg custom-scrollbar"
        style={{
          "--scrollbar-thumb": "#d1d5db",
          "--scrollbar-track": "transparent",
        }}
      >
        {steps.length === 0 ? (
          <BuildStepsLoader />
        ) : (
          <>
            <StepsList steps={steps} />
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="flex gap-2 items-end sticky bottom-0 bg-slate-50 dark:bg-gray-800 pb-1.5">
        <div className="w-full p-3 border shadow-sm border-slate-200 dark:border-slate-700 dark:bg-gray-900 rounded-xl">
          {isLoading && <Loader />}
          {!isLoading && (
            <>
              <div className="flex items-end gap-2">
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={Lookup.INPUT_PLACEHOLDER}
                  className="w-full bg-transparent outline-none resize-none custom-scrollbar max-h-32 min-h-20"
                  rows={Math.min(3, userInput.split("\n").length || 1)}
                />
                <button
                  disabled={!userInput.trim()}
                  onClick={async () => {
                    if (!userDetail?.token || userDetail.token < 10) {
                      toast("You don't have enough tokens!");
                      router.push("/pricing");
                      return;
                    }
                    try {
                      setIsLoading(true);
                      const newMessage = {
                        role: "user",
                        content: userInput,
                      };

                      const stepsResponse = await axios.post(
                        `${BACKEND_URL}/chat`,
                        {
                          messages: [...llmMessages, newMessage],
                        }
                      );

                      // Calculate and update tokens after template API call
                      const templateTokens = Number(
                        countToken(JSON.stringify(stepsResponse.data))
                      );
                      const remTokensAfterTemplate =
                        Number(userDetail?.token) - templateTokens;

                      // Update user tokens in state
                      updateUserDetail({ token: remTokensAfterTemplate });

                      // Update tokens in database after template call
                      await UpdateTokens({
                        userId: userDetail?._id,
                        token: remTokensAfterTemplate,
                      });

                      setLlmMessages((x) => [...x, newMessage]);
                      setLlmMessages((x) => [
                        ...x,
                        {
                          role: "assistant",
                          content: stepsResponse.data.response,
                        },
                      ]);

                      setSteps((s) => [
                        ...s,
                        ...parseXml(stepsResponse.data.response).map((x) => ({
                          ...x,
                          id: uuid4(),
                          status: "pending",
                        })),
                      ]);
                    } catch (error) {
                      // Handle API request errors
                      console.error("Error processing message:", error);
                      setLlmMessages((x) => [
                        ...x,
                        {
                          role: "assistant",
                          content:
                            "Sorry, there was an error processing your request. Please try again.",
                        },
                      ]);
                    } finally {
                      setUserInput("");
                      setIsLoading(false);
                    }
                  }}
                  className={`flex-shrink-0 ${
                    userInput.trim() && !loading
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                  } text-white p-2 h-10 w-10 rounded-full flex items-center justify-center cursor-pointer`}
                >
                  {loading ? (
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(ChatView);
