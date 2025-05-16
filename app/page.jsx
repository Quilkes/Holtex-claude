"use client";

import { useEffect, useState } from "react";
import Hero from "./components/Hero";
import Header from "./components/Header";

export default function page() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="h-screen w-full bg-white">
      <Header />
      <Hero />
    </div>
  );
}
