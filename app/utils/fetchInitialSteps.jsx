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

    if (templateResponse.data && templateResponse.data.result) {
      setTemplateSet(true);
      const answer = templateResponse.data.result;

      const templatePrompts = answer === "react" ? reactPrompt : nodePrompt;

      // Parse and set initial steps
      const parsedInitialSteps = parseXml(templatePrompts);
      console.log("Parsed initial steps:", parsedInitialSteps);

      if (Array.isArray(parsedInitialSteps) && parsedInitialSteps.length > 0) {
        const initialSteps = parsedInitialSteps.map((x) => ({
          ...x,
          id: uuid4(),
          status: "pending",
        }));

        console.log("Setting initial steps:", initialSteps);
        setSteps(initialSteps);

        // Now make API call to generate code
        console.log("Generating code...");
        try {
          const stepsResponse = await axios.post("/api/gen-ai-code", {
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
            const parsedGeneratedSteps = parseXml(stepsResponse.data.result);
            console.log("Parsed generated steps:", parsedGeneratedSteps);

            if (
              Array.isArray(parsedGeneratedSteps) &&
              parsedGeneratedSteps.length > 0
            ) {
              const generatedSteps = parsedGeneratedSteps.map((x) => ({
                ...x,
                id: uuid4(),
                status: "pending",
              }));

              // Add the new steps to the existing ones
              console.log("Adding generated steps:", generatedSteps);
              setSteps([...initialSteps, ...generatedSteps]);

              setLlmMessages((prevMessages) => [
                ...prevMessages,
                { role: "assistant", content: stepsResponse.data.result },
              ]);

              console.log("Steps and messages set successfully");
            } else {
              console.warn("No valid generated steps found in response");
            }
          } else {
            console.error("Invalid steps response format:", stepsResponse.data);
          }
        } catch (codeGenError) {
          console.error("Code generation error:", codeGenError);
        }
      } else {
        console.error("No valid initial steps found in template");
      }
    } else {
      console.error("Invalid template response format:", templateResponse.data);
    }
  } catch (error) {
    console.error("Error in fetching initial steps:", error);
  } finally {
    console.log("fetchInitialSteps completed");
    setNewFileFromApiLoading(false);
  }
}
