import { parseXml } from "../lib/parseXml";
import axios from "axios";
import { BACKEND_URL } from "./config";
import uuid4 from "uuid4";

export async function fetchInitialSteps(messages, setSteps, setLlmMessages) {
  try {
    // Validate inputs
    if (!setSteps || typeof setSteps !== "function") {
      console.error("setSteps is not a function:", setSteps);
      setNewFileFromApiLoading(false);
      return;
    }

    // First, determine if we should use React or Node
    const response = await axios
      .post(`${BACKEND_URL}/template`, {
        prompt: messages,
      })
      .catch((error) => {
        console.error("Template API error:", error);
        throw new Error("Failed to fetch template type");
      });

    const { prompts, uiPrompts } = response.data;

    // Parse and set initial steps
    setSteps(
      parseXml(uiPrompts[0]).map((x) => ({
        ...x,
        id: uuid4(),
        status: "pending",
      }))
    );

    const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
      messages: [...prompts, messages].map((content) => ({
        role: "user",
        content,
      })),
    });

    console.log(messages);

    console.log("Steps response:", stepsResponse);

    setSteps((s) => [
      ...s,
      ...parseXml(stepsResponse.data.response).map((x) => ({
        ...x,
        id: uuid4(),
        status: "pending",
      })),
    ]);

    setLlmMessages(
      [...prompts, prompt].map((content) => ({
        role: "user",
        content,
      }))
    );

    setLlmMessages((x) => [
      ...x,
      { role: "assistant", content: stepsResponse.data.response },
    ]);
  } catch (error) {
    console.error("Error in fetching initial steps:", error);
  } finally {
  }
}
