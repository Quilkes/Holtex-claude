import BackButton from "@/app/components/BackButton";

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
