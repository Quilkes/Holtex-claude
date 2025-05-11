import React from "react";

export default function ChatHistoryLoader() {
  const skeletons = Array(6).fill(0);

  return (
    <div className="space-y-3 p-2">
      {skeletons.map((_, index) => (
        <div key={index} className="rounded-xl shadow-sm animate-pulse">
          <div className="h-8 bg-gray-200 flex justify-center items-center dark:bg-gray-700 px-4 py-3">
            <div className="w-2/3 h-4 bg-gray-300 dark:bg-gray-600 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
