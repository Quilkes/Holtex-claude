import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    // Check if prompt is empty
    if (!prompt || prompt.trim() === "") {
      return NextResponse.json(
        { error: "Empty prompt provided" },
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

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `Enhance this as a software dev. not more than max of 3 lines i.e "I want to develop a......" "${prompt}"`,
        },
      ],
      stream: true,
    });

    // Streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            // Better handling of the chunk structure
            if (chunk.type === "content_block_delta" && chunk.delta?.text) {
              const text = chunk.delta.text;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
              );
            } else if (chunk.type === "message_stop") {
            }
          }
          controller.close();
        } catch (error) {
          console.error("Streaming Error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Anthropic Streaming Error:", error);
    return NextResponse.json(
      { error: error.message || "Streaming failed." },
      { status: 500 }
    );
  }
}
