import React, { useEffect, useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export function PreviewFrame({ files, webContainerRef }) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  async function startServer() {
    if (!webContainerRef.current) {
      console.error("WebContainer not initialized");
      setError("WebContainer not initialized. Please refresh the page.");
      toast("WebContainer not initialized. Please refresh the page.");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Installing dependencies...");
      const installProcess = await webContainerRef.current.spawn("npm", [
        "install",
      ]);

      installProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            console.log(data);
          },
        })
      );

      await installProcess.exit;

      console.log("Starting dev server...");
      const devProcess = await webContainerRef.current.spawn("npm", [
        "run",
        "dev",
      ]);

      webContainerRef.current.on("server-ready", (port, serverUrl) => {
        console.log("Server is ready at:", serverUrl);
        setUrl(serverUrl);
        setIsLoading(false);
      });

      devProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            console.log(data);
            // If there's an error in the output, capture it
            if (data.includes("Error:") || data.includes("error ")) {
              setError("Error detected in the development server output.");
              toast("Error in preview. Check console for details.");
            }
          },
        })
      );
    } catch (err) {
      console.error("Error starting server:", err);
      setError(`Failed to start the development server: ${err.message}`);
      toast("Server start failed. Please refresh the page.");
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (webContainerRef.current && files.length > 0) {
      startServer();
    }
  }, [webContainerRef.current, files]);

  return (
    <>
      <div className="flex items-center justify-center h-full">
        {error ? (
          <div className="flex flex-col items-center p-6 text-center text-red-500">
            <AlertTriangle className="w-12 h-12 mb-4" />
            <p className="text-lg font-bold">Error</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={startServer}
              className="px-4 py-2 mt-4 text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center p-6 text-center text-white">
            <Loader2 className="w-8 h-8 mb-4 text-blue-500 animate-spin" />
            <p className="text-lg text-gray-400 font-medium">Loading Preview</p>
            <p className="mt-2 text-sm text-gray-400">
              Setting up your environment and installing dependencies...
            </p>
          </div>
        ) : (
          <iframe
            width="100%"
            height="100%"
            src={url}
            title="Preview"
            className="border-none"
          />
        )}
      </div>
    </>
  );
}

export default PreviewFrame;
