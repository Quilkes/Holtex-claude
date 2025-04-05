import { useEffect, useState } from "react";
import { WebContainer } from "@webcontainer/api";

// Create a module-level variable to store the singleton instance
let webContainerInstance = null;
let bootPromise = null;

export function useWebContainer() {
  const [webcontainer, setWebcontainer] = useState(null);

  useEffect(() => {
    async function initializeWebContainer() {
      // If we already have an instance, use it
      if (webContainerInstance) {
        setWebcontainer(webContainerInstance);
        return;
      }

      // If we're already booting, wait for that promise
      if (bootPromise) {
        try {
          const instance = await bootPromise;
          setWebcontainer(instance);
        } catch (error) {
          console.error("Error while waiting for WebContainer boot:", error);
        }
        return;
      }

      // Start the boot process
      try {
        console.log("Booting WebContainer...");
        // Store the boot promise so other hooks can wait for it
        bootPromise = WebContainer.boot();
        const instance = await bootPromise;
        webContainerInstance = instance;
        setWebcontainer(instance);
        console.log("WebContainer Booted Successfully");
      } catch (error) {
        console.error("Error booting WebContainer:", error);
        // Clear the boot promise so we can try again
        bootPromise = null;
      }
    }

    initializeWebContainer();

    // Cleanup function
    return () => {
      // Note: We don't cleanup the webContainerInstance here
      // as it should persist for the entire application lifecycle
    };
  }, []); // Empty dependency array means this runs once on mount

  return webcontainer;
}
