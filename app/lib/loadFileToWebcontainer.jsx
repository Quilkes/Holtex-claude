export const loadFilesToWebContainer = async (parsedFiles, webContainerRef) => {
  let originalFiles = [];

  for (const file of parsedFiles) {
    let parsedPath = file.path?.split("/") ?? [];
    let currentFileStructure = originalFiles;
    let currentFolder = "";

    while (parsedPath.length) {
      currentFolder = `${currentFolder}/${parsedPath[0]}`.replace("//", "/");
      let currentFolderName = parsedPath[0];
      parsedPath = parsedPath.slice(1);

      if (!parsedPath.length) {
        // It's a file
        let existingFile = currentFileStructure.find(
          (x) => x.path === currentFolder
        );
        if (!existingFile) {
          currentFileStructure.push({
            name: currentFolderName,
            type: "file",
            path: currentFolder,
            content: file.code,
          });
        } else {
          existingFile.content = file.code;
        }

        // Write file to WebContainer
        if (webContainerRef.current) {
          try {
            const parentDir = currentFolder.substring(
              0,
              currentFolder.lastIndexOf("/")
            );
            if (parentDir) {
              await webContainerRef.current.fs.mkdir(parentDir, {
                recursive: true,
              });
            }
            await webContainerRef.current.fs.writeFile(
              currentFolder,
              file.code
            );
          } catch (error) {
            console.error(`Error writing file ${currentFolder}:`, error);
          }
        }
      } else {
        // It's a folder
        let folder = currentFileStructure.find((x) => x.path === currentFolder);
        if (!folder) {
          folder = {
            name: currentFolderName,
            type: "folder",
            path: currentFolder,
            children: [],
          };
          currentFileStructure.push(folder);

          if (webContainerRef.current) {
            try {
              await webContainerRef.current.fs.mkdir(currentFolder, {
                recursive: true,
              });
            } catch (error) {
              console.error(
                `Error creating directory ${currentFolder}:`,
                error
              );
            }
          }
        }
        currentFileStructure = folder.children;
      }
    }
  }

  // Sort and update files state
  const sortFiles = (items) => {
    items.sort((a, b) => {
      if (a.type === "folder" && b.type === "file") return -1;
      if (a.type === "file" && b.type === "folder") return 1;
      return a.name.localeCompare(b.name);
    });
    items.forEach((item) => {
      if (item.type === "folder" && item.children) {
        sortFiles(item.children);
      }
    });
  };

  sortFiles(originalFiles);
  return originalFiles;
};
