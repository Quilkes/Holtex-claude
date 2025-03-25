import Anthropic from "@anthropic-ai/sdk";
import { getSystemPrompt } from "@/data/Prompt";
import { CHAT_PROMPT } from "@/data/Prompt";

const apiKey = process.env.ANTHROPIC_API_KEY;
const anthropic = new Anthropic({ apiKey, requestTimeout: 120000 });

// Default configuration for chat and code generation
const defaultConfig = {
  temperature: 1,
  top_p: 0.95,
  top_k: 40,
  max_tokens: 8192,
};

class ChatSession {
  constructor() {
    this.history = [
      {
        role: "system",
        content: [{ type: "text", text: CHAT_PROMPT.PROMPT }],
      },
    ];
  }

  async sendMessage(messages) {
    if (!Array.isArray(messages)) {
      throw new Error("sendMessage expects an array of messages.");
    }

    // Append new messages to history
    this.history.push(...messages);

    try {
      const response = await anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219",
        system: CHAT_PROMPT.PROMPT,
        messages: this.history.filter((msg) => msg.role !== "system"),
        max_tokens: 1000,
      });

      const responseText = response?.content?.[0]?.text || "No response.";

      this.history.push({ role: "assistant", content: responseText });

      return responseText;
    } catch (error) {
      console.error("Error in chat session:", error);
      throw error;
    }
  }

  clearHistory() {
    this.history = [];
  }
}

class CodeSession {
  constructor(config = {}) {
    this.history = [
      {
        role: "system",
        content: [{ type: "text", text: getSystemPrompt() }],
      },
    ];
    this.config = { ...defaultConfig, ...config };
    this.retryCount = 0;
    this.MAX_RETRIES = 2;
  }

  async sendMessage(messages) {
    if (!Array.isArray(messages)) {
      throw new Error("sendMessage expects an array of messages.");
    }

    this.history.push(...messages);

    try {
      const response = await anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219",
        system: getSystemPrompt(),
        messages: this.history.filter((msg) => msg.role !== "system"),
        ...this.config,
      });

      // Reset retry count on successful response
      this.retryCount = 0;

      const responseText =
        response?.content?.[0]?.text || "Error: No response text.";

      this.history.push({
        role: "assistant",
        content: [{ type: "text", text: responseText }],
      });

      return { response: { text: () => responseText } };
    } catch (error) {
      console.error("Error in chat session:", error);

      // Check if it's a credit balance error and we haven't exceeded max retries
      if (
        error.status === 400 &&
        error.error?.type === "invalid_request_error" &&
        error.error?.message?.includes("credit balance is too low") &&
        this.retryCount < this.MAX_RETRIES
      ) {
        this.retryCount++;
        console.log(`Retry attempt ${this.retryCount}`);

        // Wait a bit before retrying (optional)
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * this.retryCount)
        );

        // Recursive retry
        return this.sendMessage(messages);
      }

      // If max retries reached or different error, throw the error
      throw error;
    }
  }

  clearHistory() {
    this.history = [
      {
        role: "system",
        content: [{ type: "text", text: getSystemPrompt() }],
      },
    ];
    this.retryCount = 0;
  }
}

export const chatSession = new ChatSession();
export const GenCode = new CodeSession();
