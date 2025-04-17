import { parseXml } from "../lib/parseXml";
import axios from "axios";
import uuid4 from "uuid4";
import { reactPrompt } from "@/templates/react";
import { nodePrompt } from "@/templates/node";
import { BASE_PROMPT } from "../constants/Prompt";

export async function fetchInitialSteps(
  messages,
  setSteps,
  setLlmMessages,
  setTemplateSet,
  setNewFileFromApiLoading
) {
  try {
    setNewFileFromApiLoading(true);

    // Validate inputs
    if (!setSteps || typeof setSteps !== "function") {
      console.error("setSteps is not a function:", setSteps);
      setNewFileFromApiLoading(false);
      return;
    }

    // First, determine if we should use React or Node
    const templateResponse = await axios
      .post("/api/templates", {
        prompt: messages,
      })
      .catch((error) => {
        console.error("Template API error:", error);
        throw new Error("Failed to fetch template type");
      });

    setTemplateSet(true);
    const answer = templateResponse.data.result;
    const templatePrompts = answer === "react" ? reactPrompt : nodePrompt;

    // Parse and set initial steps
    setSteps(
      parseXml(templatePrompts).map((x) => ({
        ...x,
        id: uuid4(),
        status: "pending",
      }))
    );

    // Now make API call to generate code
    console.log("Generating code...");

    const stepsResponse = await axios.post("/api/gen-ai-codess", {
      messages: [
        {
          role: "user",
          content: BASE_PROMPT,
        },
        {
          role: "user",
          content: `Here is an artifact that contains all files of the project visible to you.
                       Consider the contents of ALL files in the project.
                       ${templatePrompts}
                       Here is a list of files that exist on the file system but are not being shown to you:
                         - .gitignore
                         - package-lock.json`,
        },
        {
          role: "user",
          content: messages,
        },
      ],
    });

    console.log("Code generation response:", stepsResponse.data);

    if (stepsResponse.data && stepsResponse.data.result) {
      // Add the new steps to the existing ones
      setSteps((prevSteps) => [
        ...prevSteps,
        ...parseXml(stepsResponse.data.result).map((x) => ({
          ...x,
          id: uuid4(),
          status: "pending",
        })),
      ]);

      setLlmMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: stepsResponse.data.result },
      ]);
    } else {
      console.error("Invalid steps response format:", stepsResponse.data);
    }
  } catch (error) {
    console.error("Error in fetching initial steps:", error);
  } finally {
    setNewFileFromApiLoading(false);
  }
}
