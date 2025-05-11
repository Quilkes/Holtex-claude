"use client";

import { motion } from "framer-motion";
import { Rocket, Store, University } from "lucide-react";
import { useEffect, useState } from "react";
import {
  suggestionChips,
  storeTemplates,
  aiChannels,
  supportChats,
} from "./constants/Json";
import Hero from "./components/Hero";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function page() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

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

  return (
    <div className="min-h-screen w-full bg-white ">
      <Header />
      <Hero />

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

      <Footer />
    </div>
  );
}
