import Header from "./components/Header";

export const metadata = {
  title: "Holtex AI | Create Your App in Minutes",
  description:
    "Holtex AI makes app development easy and fast. Create powerful apps in minutes with no coding required. Start building today!",
};

export default function RootLayout({ children }) {
  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="sticky top-0 left-0 z-50 w-full bg-white">
        <Header />
      </div>
      {children}
    </div>
  );
}
