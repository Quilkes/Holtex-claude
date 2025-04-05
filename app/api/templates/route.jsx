import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

async function sendRequestWithRetry(anthropic, promptContent, retries = 0) {
  try {
    return await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 100,
      system:
        "Return either node or react based on what you think this project should be. Only return a single value: either node or react (Do not return anything extra.)",
      messages: [{ role: "user", content: promptContent }],
    });
  } catch (error) {
    if (error?.type === "overloaded_error" && retries < MAX_RETRIES) {
      console.log(`Retrying request... Attempt ${retries + 1}`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS)); // Wait before retrying
      return sendRequestWithRetry(anthropic, promptContent, retries + 1);
    }
    throw error; // Re-throw the error if the retry limit is reached or another error occurs
  }
}

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    // Extract content from the prompt
    const promptContent =
      prompt && Array.isArray(prompt) ? prompt[0]?.content : null;

    // Check if prompt is empty
    if (typeof promptContent !== "string" || promptContent.trim() === "") {
      return NextResponse.json(
        { error: "Empty or invalid prompt provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing Anthropic API Key" },
        { status: 500 }
      );
    }
    const anthropic = new Anthropic({ apiKey });

    // Send request with retry logic
    const response = await sendRequestWithRetry(anthropic, promptContent);

    // Get the content from the response
    const answer = response.content[0].text.trim();

    // Check if the answer is valid
    if (answer === "react" || answer === "node") {
      return NextResponse.json({ result: answer });
    } else {
      return NextResponse.json(
        { error: "Invalid response format" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Anthropic API Error:", error);
    return NextResponse.json(
      { error: error.message || "Request failed." },
      { status: 500 }
    );
  }
}
