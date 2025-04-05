import { GenCode } from "@/app/configs/AiGenCode";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages)) {
      throw new Error("Invalid request: messages must be an array.");
    }
    const result = await GenCode.sendMessage(messages);

    return NextResponse.json({ result: await result.response.text() });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}
