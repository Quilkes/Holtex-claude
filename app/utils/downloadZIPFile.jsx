import JSZip from "jszip";
import { saveAs } from "file-saver";

export const handleDownloadZipFile = async ({
  webContainerRef,
  setIsDownloadingZipFile,
}) => {
  try {
    setIsDownloadingZipFile(true);
    if (!webContainerRef?.current) {
      console.error("WebContainer is not initialized yet.");
      return;
    }

    const zip = new JSZip();

    async function addFilesToZip(dir, zipFolder) {
      try {
        const entries = await webContainerRef.current.fs.readdir(dir, {
          withFileTypes: true,
        });

        for (const entry of entries) {
          try {
            const fullPath = `${dir}/${entry.name}`;

            if (entry.isDirectory()) {
              const folder = zipFolder.folder(entry.name);
              await addFilesToZip(fullPath, folder);
            } else {
              const fileContent = await webContainerRef.current.fs.readFile(
                fullPath,
                "utf-8"
              );
              zipFolder.file(entry.name, fileContent || "");
            }
          } catch (entryError) {
            console.error(`Error processing entry ${entry.name}:`, entryError);
            // Continue with other entries even if one fails
          }
        }
      } catch (readError) {
        console.error(`Error reading directory ${dir}:`, readError);
        throw readError; // Re-throw to notify the parent function
      }
    }

    await addFilesToZip("/", zip);
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "project.zip");
  } catch (error) {
    console.error("Failed to download zip file:", error);
  } finally {
    setIsDownloadingZipFile(false);
  }
};
