import JSZip from "jszip";
import { saveAs } from "file-saver";

export const handleDownload = async ({ webContainerRef }) => {
  if (!webContainerRef?.current) {
    console.error("WebContainer is not initialized yet.");
    return;
  }

  const zip = new JSZip();

  async function addFilesToZip(dir, zipFolder) {
    const entries = await webContainerRef.current.fs.readdir(dir, {
      withFileTypes: true,
    });

    for (const entry of entries) {
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
    }
  }

  await addFilesToZip("/", zip);
  const zipBlob = await zip.generateAsync({ type: "blob" });
  saveAs(zipBlob, "project.zip");
};
