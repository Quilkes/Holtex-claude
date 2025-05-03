import BackButton from "@/app/components/BackButton";

export const metadata = {
  title: "Holtex AI | Pricing Plans",
  description:
    "Discover flexible and affordable pricing plans for Holtex AI to build your app in minutes. Find the best plan that suits your needs.",
};

export default function RootLayout({ children }) {
  return (
    <div>
      <div className="left-0 z-50 p-4 bg-white dark:bg-gray-900">
        <BackButton />
      </div>
      {children}
    </div>
  );
}
