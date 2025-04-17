import BackButton from "@/app/components/BackButton";

export const metadata = {
  title: "Holtex AI | Pricing Plans",
  description:
    "Discover flexible and affordable pricing plans for Holtex AI to build your app in minutes. Find the best plan that suits your needs.",
};

export default function RootLayout({ children }) {
  return (
    <div>
      <div className=" p-4 bg-white left-0 z-50 ">
        <BackButton />
      </div>
      {children}
    </div>
  );
}
