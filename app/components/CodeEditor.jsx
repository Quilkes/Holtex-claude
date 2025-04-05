import React, { useEffect } from "react";
import Editor, { useMonaco, loader } from "@monaco-editor/react";
import useCodeView from "../store/useCodeView";
import { toast } from "sonner";

export function CodeEditor() {
  const monaco = useMonaco();
  const { selectedFile } = useCodeView();

  useEffect(() => {
    loader.init().catch((error) => {
      console.error("Monaco failed to load:", error);
      toast("Failed to load the Monaco Editor. Please refresh.");
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

      // Set as default theme
      monaco.editor.setTheme("custom-light");
    }
  }, [monaco]);

  if (!selectedFile) {
    return (
      <div className="flex items-center justify-center w-full h-full text-gray-400 bg-white">
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
    <div className="w-full h-full">
      <Editor
        height="100%"
        defaultLanguage={getLanguage(selectedFile.name)}
        theme="custom-light"
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
          <div className="flex items-center justify-center h-full w-full text-gray-400 bg-white">
            Loading editor...
          </div>
        }
      />
    </div>
  );
}
