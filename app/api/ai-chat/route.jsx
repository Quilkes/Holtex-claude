import { chatSession } from "@/configs/AiGenCode";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!Array.isArray(prompt)) {
      return NextResponse.json(
        { error: "Prompt must be an array of messages." },
        { status: 400 }
      );
    }

    const formattedMessages = prompt
      .filter((msg) => msg.role && msg.content)
      .map((msg) => ({
        role: msg.role === "ai" ? "assistant" : msg.role,
        content: msg.content,
      }));

    const result = await chatSession.sendMessage(formattedMessages);

    return NextResponse.json({ result });
  } catch (e) {
    console.error("Error calling Anthropic API:", e);
    return NextResponse.json({ error: e.message || e }, { status: 500 });
  }
}
