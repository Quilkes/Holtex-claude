import Anthropic from "@anthropic-ai/sdk";
import { getSystemPrompt } from "../constants/Prompt";

const apiKey = process.env.ANTHROPIC_API_KEY;
const anthropic = new Anthropic({ apiKey, requestTimeout: 120000 });

// Default configuration for chat and code generation
const defaultConfig = {
  temperature: 1,
  top_p: 0.95,
  top_k: 40,
  max_tokens: 8192,
};

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

    // Properly format incoming messages before adding to history
    const formattedMessages = messages.map((msg) => {
      // Ensure proper structure for content
      const formattedContent = Array.isArray(msg.content)
        ? msg.content.map((item) => {
            // Make sure each item in content array has type and text
            if (typeof item === "object" && item !== null) {
              return {
                type: item.type || "text",
                text: item.text || item.toString(),
              };
            } else {
              return { type: "text", text: String(item) };
            }
          })
        : [{ type: "text", text: String(msg.content) }];

      return {
        role: msg.role,
        content: formattedContent,
      };
    });

    // Add formatted messages to history
    this.history.push(...formattedMessages);

    try {
      // Debug: log the messages being sent to API
      const apiMessages = this.history
        .filter((msg) => msg.role !== "system")
        .map((msg) => {
          // Ensure proper format for API call
          const validContent = Array.isArray(msg.content)
            ? msg.content.map((item) => {
                if (!item.type) {
                  return { type: "text", text: String(item.text || item) };
                }
                return item;
              })
            : [{ type: "text", text: String(msg.content) }];

          return {
            role: msg.role,
            content: validContent,
          };
        });

      const response = await anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219",
        system: getSystemPrompt(),
        messages: apiMessages,
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

      // Add more detailed logging
      if (
        error.status === 400 &&
        error.error?.type === "invalid_request_error"
      ) {
        console.error(
          "Request data that caused error:",
          JSON.stringify(
            this.history.filter((msg) => msg.role !== "system"),
            null,
            2
          )
        );
      }

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

export const GenCode = new CodeSession();
