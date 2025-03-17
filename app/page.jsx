import { HomeIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-white w-full h-full flex flex-col justify-center items-center">
      <Link href={"/home"} className="mt-3 w-fit">
        <button className="w-fit mb-6 flex items-center justify-center gap-2 py-2 px-4 bg-purple-500 text-white rounded-md hover:bg-slate-100 hover:border-purple-500 border hover:text-purple-500 transition-colors">
          <HomeIcon /> Navigate to HomePage
        </button>
        <div> Landing Page | Introduction Page</div>
      </Link>
    </div>
  );
}
