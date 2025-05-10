import React from "react";
import { MessageCircle, DiscIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="pt-12 mt-16 border-t border-gray-200 w-full relative z-10">
      <div className="text-center">
        <div className="inline-block mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg shadow-purple-500/10">
          Holtex AI is in its experimental stage
        </div>

        <p className="mb-6 text-gray-600">
          Built with ❤️ by Holtex AI. Empowering developers to build smarter.
        </p>

        <div className="flex justify-center gap-4 mb-8">
          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-600 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all"
          >
            <DiscIcon className="w-5 h-5 text-gray-600" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-gray-100 hover:bg-purple-100 hover:text-purple-600 hover:shadow-[0_0_10px_rgba(124,58,237,0.3)] transition-all"
          >
            <MessageCircle className="w-5 h-5 text-gray-600" />
          </a>
        </div>

        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Holtex AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
