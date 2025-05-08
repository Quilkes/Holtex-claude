"use client";

export default function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="flex items-center p-2 text-gray-700 rounded-md dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 hover:text-gray-900 hover:bg-gray-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="purple"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
      <span className="ml-1 font-medium">Back</span>
    </button>
  );
}
