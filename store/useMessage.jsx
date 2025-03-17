import { create } from "zustand";

const useMessage = create((set) => ({
  messages: [],
  setMessages: (newMessages) => set({ messages: newMessages }),

  // Add one or more messages to the existing ones
  addMessage: (message) =>
    set((state) => ({
      messages: Array.isArray(message)
        ? [...state.messages, ...message]
        : [...state.messages, message],
    })),

  // Clear all messages
  clearMessages: () => set({ messages: [] }),
}));

export default useMessage;
