import React, { useEffect, useState } from "react";
import Editor, { useMonaco, loader } from "@monaco-editor/react";
import useCodeView from "@/app/store/useCodeView";
import { toast } from "sonner";

export function CodeEditor() {
  const monaco = useMonaco();
  const { selectedFile } = useCodeView();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for dark mode on mount and when it changes
  useEffect(() => {
    // Check if dark mode is active (either via class or system preference)
    const checkDarkMode = () => {
      const isDark =
        document.documentElement.classList.contains("dark") ||
        (window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      setIsDarkMode(isDark);
    };

    // Initial check
    checkDarkMode();

    // Watch for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => checkDarkMode();

    // Add listener with compatibility for older browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange); // Older implementation
    }

    // Watch for class changes on html element (for manual toggles)
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      // Clean up listeners
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    loader.init().catch((error) => {
      console.error("Monaco failed to load:", error);
      toast.error("Failed to load the Monaco Editor. Please refresh.");
    });
  }, []);

  useEffect(() => {
    if (monaco) {
      // Define the light theme
      monaco.editor.defineTheme("custom-light", {
        base: "vs", // Use "vs" for light base
        inherit: true,
        rules: [
          { token: "", foreground: "#374151" }, // Darker foreground for light theme
          { token: "comment", foreground: "#9CA3AF", fontStyle: "italic" },
          { token: "keyword", foreground: "#2563EB" }, // Blue keyword
          { token: "string", foreground: "#16A38A" }, // Green string
          { token: "number", foreground: "#C2410C" }, // Orange number
          { token: "regexp", foreground: "#C2410C" },
        ],
        colors: {
          "editor.background": "#F9FAFB", // Equivalent to bg-slate-100
          "editor.foreground": "#374151",
          "editor.lineHighlightBackground": "#E5E7EB", // Lighter line highlight
          "editor.lineHighlightBorder": "#E5E7EB",
          "editorCursor.foreground": "#1F2937",
          "editor.selectionBackground": "#D1D5DB",
          "editor.inactiveSelectionBackground": "#E5E7EB",
          "editorLineNumber.foreground": "#9CA3AF",
          "editorLineNumber.activeForeground": "#374151",
          "editorIndentGuide.background": "#E5E7EB",
          "editorIndentGuide.activeBackground": "#D1D5DB",
          "editor.selectionHighlightBackground": "#D1D5DB80",
          "editor.wordHighlightBackground": "#D1D5DB80",
          "editor.findMatchBackground": "#FBBF2480",
          "editor.findMatchHighlightBackground": "#FBBF2440",
        },
      });

      // Define the dark theme
      monaco.editor.defineTheme("custom-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "comment", foreground: "#6B7280", fontStyle: "italic" },
          { token: "keyword", foreground: "#93C5FD" }, // Light blue for keywords
          { token: "string", foreground: "#6EE7B7" }, // Light green for strings
          { token: "number", foreground: "#FDBA74" }, // Light orange for numbers
          { token: "regexp", foreground: "#FDBA74" },
        ],
        colors: {
          "editor.background": "#1F2937", // Dark gray background
          "editor.foreground": "#E5E7EB",
          "editor.lineHighlightBackground": "#374151",
          "editor.lineHighlightBorder": "#374151",
          "editorCursor.foreground": "#F9FAFB",
          "editor.selectionBackground": "#4B5563",
          "editor.inactiveSelectionBackground": "#374151",
          "editorLineNumber.foreground": "#6B7280",
          "editorLineNumber.activeForeground": "#D1D5DB",
          "editorIndentGuide.background": "#374151",
          "editorIndentGuide.activeBackground": "#4B5563",
          "editor.selectionHighlightBackground": "#4B556380",
          "editor.wordHighlightBackground": "#4B556380",
          "editor.findMatchBackground": "#F59E0B80",
          "editor.findMatchHighlightBackground": "#F59E0B40",
        },
      });

      // Set theme based on dark mode state
      monaco.editor.setTheme(isDarkMode ? "custom-dark" : "custom-light");
    }
  }, [monaco, isDarkMode]);

  if (!selectedFile) {
    return (
      <div className="flex items-center justify-center w-full h-full text-gray-400 bg-white dark:bg-gray-900 dark:text-gray-400">
        Select a file to view its contents
      </div>
    );
  }

  const getLanguage = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    const languageMap = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      py: "python",
      css: "css",
      html: "html",
      json: "json",
      md: "markdown",
    };
    return languageMap[ext] || "plaintext";
  };

  return (
    <div className="w-full h-full bg-white dark:bg-gray-900">
      <Editor
        height="100%"
        defaultLanguage={getLanguage(selectedFile.name)}
        theme={isDarkMode ? "custom-dark" : "custom-light"}
        value={selectedFile.content || ""}
        options={{
          readOnly: true,
          minimap: { enabled: true },
          fontSize: 14,
          wordWrap: "on",
          scrollBeyondLastLine: false,
          renderLineHighlight: "all",
          lineNumbers: "on",
          roundedSelection: true,
          selectOnLineNumbers: true,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          glyphMargin: false,
          folding: true,
          renderIndentGuides: true,
          contextmenu: true,
        }}
        loading={
          <div className="flex items-center justify-center w-full h-full text-gray-400 bg-white dark:bg-gray-900 dark:text-gray-400">
            Loading editor...
          </div>
        }
      />
    </div>
  );
}
