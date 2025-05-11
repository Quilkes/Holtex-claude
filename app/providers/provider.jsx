"use client";
import React from "react";
import AppSidebar from "../(main)/home/components/AppSidebar";

const Provider = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      <main className="flex flex-grow overflow-hidden">
        <AppSidebar />
        <div className="flex-grow overflow-auto">{children}</div>
      </main>
    </div>
  );
};

export default Provider;
