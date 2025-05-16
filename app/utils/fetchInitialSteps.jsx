import { parseXml } from "../lib/parseXml";
import axios from "axios";
import { BACKEND_URL } from "./config";
import uuid4 from "uuid4";

export async function fetchInitialSteps(
  messages,
  setSteps,
  setLlmMessages,
  userDetail,
  updateUserDetail,
  countToken,
  UpdateTokens
) {
  try {
    // Validate inputs
    if (!setSteps || typeof setSteps !== "function") {
      console.error("setSteps is not a function:", setSteps);
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

    // Calculate and update tokens after template API call
    const templateTokens = Number(countToken(JSON.stringify(response.data)));
    const remTokensAfterTemplate = Number(userDetail?.token) - templateTokens;

    // Update user tokens in state
    updateUserDetail({ token: remTokensAfterTemplate });

    // Update tokens in database after template call
    await UpdateTokens({
      userId: userDetail?._id,
      token: remTokensAfterTemplate,
    });

    // // Parse and set initial steps
    // setSteps(
    //   parseXml(uiPrompts[0]).map((x) => ({
    //     ...x,
    //     id: uuid4(),
    //     status: "pending",
    //   }))
    // );

    // Post to chat API
    const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
      messages: [...prompts, messages].map((content) => ({
        role: "user",
        content,
      })),
    });

    // Calculate and update tokens after chat API call
    const chatTokens = Number(countToken(JSON.stringify(stepsResponse.data)));
    const remTokensAfterChat = remTokensAfterTemplate - chatTokens;

    // Update user tokens in state
    updateUserDetail({ token: remTokensAfterChat });

    // Update tokens in database after chat call
    await UpdateTokens({
      userId: userDetail?._id,
      token: remTokensAfterChat,
    });

    // Set steps from chat response
    setSteps((s) => [
      ...s,
      ...parseXml(stepsResponse.data.response).map((x) => ({
        ...x,
        id: uuid4(),
        status: "pending",
      })),
    ]);

    // Update message history
    setLlmMessages(
      [...prompts, messages].map((content) => ({
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
  }
}
