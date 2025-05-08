"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Rocket,
  Store,
  University,
  MessageCircle,
  DiscIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  suggestionChips,
  storeTemplates,
  aiChannels,
  supportChats,
} from "./constants/Json";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function page() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const handleHomepage = () => {
    router.push("/home");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const VideoPlayer = () => (
    <div className="w-full border border-purple-500 relative overflow-hidden rounded-lg shadow-lg">
      <video
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/videos/video-promotion.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-white ">
      {/* Header */}
      <header className="sticky top-0 w-full bg-white/80  backdrop-blur-sm border-b  border-gray-100 z-50">
        <div className="container mx-auto px-4 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
                HOLTEX AI
              </h1>
            </motion.div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-gray-700  hover:text-purple-600 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-gray-700  hover:text-purple-600 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#testimonials"
              className="text-gray-700  hover:text-purple-600 transition-colors"
            >
              Testimonials
            </Link>
            <Link
              href="#pricing"
              className="text-gray-700  hover:text-purple-600 transition-colors"
            >
              Pricing
            </Link>
          </nav>

          <div>
            <SignedOut>
              <SignInButton>
                <button className="hidden md:inline-block px-5 py-1 text-purple-600 hover:text-white font-medium rounded-md border hover:bg-purple-700">
                  Sign in
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <button
                className="px-4 py-2 border border-purple-500 text-purple-700 rounded-md hover:bg-purple-50 transition-colors"
                onClick={handleHomepage}
              >
                Home
              </button>
            </SignedIn>
          </div>
        </div>
      </header>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto  px-4 py-16 text-center"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6"
        >
          Holtex Platform
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-xl text-gray-600 max-w-2xl mx-auto mb-10"
        >
          Automatically updated every 5 minutes. Powering AI innovation across
          platforms.
        </motion.p>

        {/* Video */}
        <VideoPlayer />

        {/* Suggestion Chips */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-2 mt-8"
        >
          {suggestionChips.map((chip) => (
            <motion.span
              key={chip}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 cursor-pointer"
            >
              {chip}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>

      {/* Store Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        className="py-16 bg-white"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={itemVariants} className="text-center mb-10">
            <Store className="mx-auto mb-4 text-blue-600" size={48} />
            <h2 className="text-3xl font-bold text-gray-900">Holtex Store</h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {storeTemplates.map((template) => (
              <motion.div
                key={template}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-100 p-4 rounded-lg hover:bg-blue-100 transition-colors text-center"
              >
                <p className="text-gray-800 font-semibold">{template}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* AI Channels Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        className="py-16 bg-gray-50"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={itemVariants} className="text-center mb-10">
            <Rocket className="mx-auto mb-4 text-blue-600" size={48} />
            <h2 className="text-3xl font-bold text-gray-900">AI Everywhere</h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {aiChannels.map((channel) => (
              <motion.div
                key={channel}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all text-center"
              >
                <p className="text-gray-800 font-semibold">{channel}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* University Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        className="py-16 bg-white"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={itemVariants} className="text-center mb-10">
            <University className="mx-auto mb-4 text-blue-600" size={48} />
            <h2 className="text-3xl font-bold text-gray-900">
              Holtex University
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="flex flex-wrap justify-center gap-4"
          >
            {supportChats.map((chat) => (
              <motion.button
                key={chat.name}
                variants={itemVariants}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-gray-100 px-6 py-3 rounded-full hover:bg-blue-100 transition-colors"
              >
                {chat.name}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </motion.section>

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
    </div>
  );
}
