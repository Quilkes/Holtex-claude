import Header from "@/app/components/Header";

export const metadata = {
  title: "Holtex AI | Pricing Plans",
  description: "Discover flexible and affordable pricing plans for Holtex AI to build your app in minutes. Find the best plan that suits your needs.",
};

export default function RootLayout({ children }) {
  return (
    <div>
      <div className="sticky top-0 left-0 z-50 bg-white  w-full">
        <Header />
      </div>
      {children}
    </div>
  );
}
