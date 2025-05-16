import React, { useEffect, useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import usePreview from "@/app/store/preview/usePreview";

export function PreviewFrame({ files, webContainerRef }) {
  const { url, setUrl } = usePreview();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serverStarted, setServerStarted] = useState(false);

  useEffect(() => {
    let timeoutId;
    let abortController = new AbortController();

    const startServer = async () => {
      if (!webContainerRef.current) {
        console.error("WebContainer not initialized");
        setError("WebContainer not initialized. Please refresh the page.");
        toast.error("WebContainer not initialized. Please refresh the page.");
        setIsLoading(false);
        return;
      }

      try {
        setError(null);
        console.log("Installing dependencies...");
        const installProcess = await webContainerRef.current.spawn("npm", [
          "install",
        ]);

        const installStream = new WritableStream({
          write(data) {
            console.log(data);
          },
        });

        installProcess.output.pipeTo(installStream);
        await installProcess.exit;

        console.log("Starting dev server...");
        const devProcess = await webContainerRef.current.spawn("npm", [
          "run",
          "dev",
        ]);

        // Set up server ready listener before processing output
        webContainerRef.current.on("server-ready", (port, serverUrl) => {
          console.log("Server is ready at:", serverUrl);
          setUrl(serverUrl);
          setIsLoading(false);
          setServerStarted(true);
        });

        // If server doesn't become ready within 30 seconds, show a timeout message
        timeoutId = setTimeout(() => {
          if (!serverStarted && !abortController.signal.aborted) {
            // Only show error if we haven't detected the server yet
            console.log("Server startup taking longer than expected...");
            // Don't set error or loading state here, just a warning
          }
        }, 30000);

        const outputStream = new WritableStream({
          write(data) {
            console.log(data);

            // Look for common server ready indicators
            if (
              data.includes("ready in") ||
              data.includes("Local:") ||
              data.includes("started server") ||
              data.includes("listening at")
            ) {
              // Some frameworks don't trigger server-ready event properly
              // This is a fallback for those cases
              setTimeout(() => {
                if (isLoading && !abortController.signal.aborted) {
                  setIsLoading(false);
                  setServerStarted(true);
                }
              }, 2000);
            }

            // If there's an error in the output but server is already running, don't show it
            if (
              (data.includes("Error:") || data.includes("error ")) &&
              !serverStarted
            ) {
              // Only set error if it's a critical error that prevents server start
              if (
                !data.includes("DeprecationWarning") &&
                !data.includes("ExperimentalWarning") &&
                !data.toLowerCase().includes("compiled with")
              ) {
                setError("Error detected in the development server output.");
                toast.error("Error in preview. Check console for details.");
              }
            }
          },
        });

        devProcess.output.pipeTo(outputStream);
      } catch (err) {
        console.error("Error starting server:", err);
        setError(`Failed to start the development server: ${err.message}`);
        toast.error("Server start failed. Please refresh the page.");
        setIsLoading(false);
      }
    };

    if (webContainerRef.current && files.length > 0) {
      startServer();
    }

    // Return a cleanup function
    return () => {
      abortController.abort();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      // Add any other cleanup needed for the server
    };
  }, [webContainerRef.current, files]); // Directly referencing .current in deps is not recommended

  return (
    <>
      <div className="flex items-center justify-center h-full">
        {error && !serverStarted ? (
          <div className="flex flex-col items-center p-6 text-center text-red-500">
            <AlertTriangle className="w-12 h-12 mb-4" />
            <p className="text-lg font-bold">Error</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={() => {
                setIsLoading(true);
                setError(null);
                // Call startServer again
                if (webContainerRef.current && files.length > 0) {
                  startServer();
                }
              }}
              className="px-4 py-2 mt-4 text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center p-6 text-center text-white">
            <Loader2 className="w-8 h-8 mb-4 text-blue-500 animate-spin" />
            <p className="text-lg text-gray-400 font-medium">
              Initializing Container
            </p>
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
