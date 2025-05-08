import BackButton from "./components/BackButton";

export default function RootLayout({ children }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="left-0 z-50 p-4 bg-white dark:bg-gray-900">
        <BackButton />
      </div>
      {children}
    </div>
  );
}
