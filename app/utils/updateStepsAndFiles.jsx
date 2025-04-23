export const updateStepsAndFiles = async (
  steps,
  files,
  setSteps,
  setFiles,
  webContainerRef
) => {
  // Ensure steps is an array before filtering
  if (!Array.isArray(steps)) {
    console.warn("Steps is not an array:", steps);
    return; // Exit early if steps is not an array
  }

  let originalFiles = Array.isArray(files) ? [...files] : [];
  let updateHappened = false;

  // Now filter steps safely
  const stepStatus = steps.filter(
    (step) => step && step.status === "completed"
  );

  for (const step of stepStatus) {
    updateHappened = true;
    if (step?.type === "CreateFile") {
      let parsedPath = step.path?.split("/") ?? [];
      let currentFileStructure = originalFiles;
      let currentFolder = "";

      while (parsedPath.length) {
        currentFolder = `${currentFolder}/${parsedPath[0]}`.replace("//", "/");
        let currentFolderName = parsedPath[0];
        parsedPath = parsedPath.slice(1);

        if (!parsedPath.length) {
          let file = currentFileStructure.find((x) => x.path === currentFolder);
          if (!file) {
            currentFileStructure.push({
              name: currentFolderName,
              type: "file",
              path: currentFolder,
              content: step.code,
            });
          } else {
            file.content = step.code;
          }

          // Ensure WebContainer is ready before writing files
          if (webContainerRef?.current) {
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
                step.code
              );
            } catch (error) {
              console.error(`Error writing file ${currentFolder}:`, error);
            }
          }
        } else {
          let folder = currentFileStructure.find(
            (x) => x.path === currentFolder
          );
          if (!folder) {
            folder = {
              name: currentFolderName,
              type: "folder",
              path: currentFolder,
              children: [],
            };
            currentFileStructure.push(folder);

            if (webContainerRef?.current) {
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
          currentFileStructure = folder.children || [];
        }
      }
    }
  }

  if (updateHappened) {
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

    setFiles([...originalFiles]);
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.status === "pending" ? { ...step, status: "completed" } : step
      )
    );
  }
};
