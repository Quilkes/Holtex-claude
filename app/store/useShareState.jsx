import { create } from "zustand";

const useSharedState = create((set) => ({
  // Flag to trigger code generation from chat
  pendingCodeGeneration: false,
  // Latest messages that need to be processed for code generation
  pendingMessages: [],
  // Function to request code generation with the latest messages
  requestCodeGeneration: (messages) =>
    set({
      pendingCodeGeneration: true,
      pendingMessages: messages,
    }),
  // Function to clear the pending state after processing
  clearPendingCodeGeneration: () =>
    set({
      pendingCodeGeneration: false,
      pendingMessages: [],
    }),
}));

export default useSharedState;
