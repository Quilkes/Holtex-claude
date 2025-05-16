import React from "react";

export default function BuildStepsLoader() {
  // Create an array to determine how many skeleton items to render
  const skeletonSteps = Array(10).fill(0);

  return (
    <div className="rounded-lg h-fit">
      <div className="h-full p-4 overflow-hidden dark:bg-gray-800">
        <div className="space-y-4">
          {skeletonSteps.map((_, index) => (
            <div
              key={`step-skeleton-${index}`}
              className={`p-4 rounded-lg border ${
                index === 0
                  ? "bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="flex items-center justify-center gap-2 animate-pulse">
                {/* Status icon placeholder */}
                <div
                  className={`w-5 h-5 rounded-full ${
                    index === 0
                      ? "bg-gray-200 dark:bg-gray-700"
                      : index === 1
                        ? "bg-gray-300 dark:bg-gray-700"
                        : "bg-gray-200 dark:bg-gray-600"
                  }`}
                ></div>

                {/* Title placeholder */}
                <div className="w-3/4 h-5 bg-gray-200 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
