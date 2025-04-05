"use client";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import Lookup from "../constants/Lookup";
import { useMutation, useQuery } from "convex/react";
import { Send, Loader2Icon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useContext, useEffect, useState, useRef } from "react";
import { countToken } from "../constants/functions";
import { StepsList } from "../utils/StepsList";
import useFiles from "../store/useFiles";
import { parseXml } from "../lib/parseXml";
import { Loader } from "../utils/loader";

function ChatView() {
  const { id } = useParams();
  const { userDetail } = useContext(UserDetailContext);
  const { steps, setSteps, templateSet, llmMessages, setLlmMessages } =
    useFiles();
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef();
  const messagesEndRef = useRef();

  // Get messages directly from Convex
  const workspaceData = useQuery(api.workspace.GetWorkspace, {
    workspaceId: id,
  });
  const messages = workspaceData?.messages || [];

  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, steps]);

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
      className="relative flex flex-col w-full h-full bg-white border rounded-md border-slate-200"
    >
      <div className="flex-1 overflow-y-auto rounded-lg scrollbar-hide">
        {steps.length === 0 ? (
          <div className="flex items-center justify-center w-full h-full">
            <p>No steps available</p>
          </div>
        ) : (
          <>
            <StepsList />
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="flex gap-2 items-end sticky bottom-0 bg-slate-50 pb-1.5">
        <div className="w-full p-3 border shadow-sm border-slate-200 rounded-xl">
          {(loading || !templateSet) && <Loader />}
          {!(loading || !templateSet) && (
            <>
              <div className="flex items-end gap-2">
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={Lookup.INPUT_PLACEHOLDER}
                  className="w-full bg-transparent outline-none resize-none max-h-32 min-h-20"
                  rows={Math.min(3, userInput.split("\n").length || 1)}
                  disabled={loading}
                />
                <button
                  disabled={!userInput.trim()}
                  onClick={async () => {
                    const newMessage = {
                      role: "user",
                      content: userInput,
                    };

                    setLoading(true);
                    const stepsResponse = await axios.post(
                      "/api/gen-ai-codesss",
                      {
                        messages: [...llmMessages, newMessage],
                      }
                    );
                    setLoading(false);

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
                        status: "pending",
                      })),
                    ]);
                  }}
                  className={`flex-shrink-0 ${
                    userInput.trim() && !loading
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-gray-100 cursor-not-allowed"
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
