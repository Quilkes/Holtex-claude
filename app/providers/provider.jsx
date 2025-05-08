"use client";
import React, { useState } from "react";
import { UserDetailContext } from "../context/UserDetailContext";
import AppSidebar from "../(main)/home/components/AppSidebar";

const Provider = ({ children }) => {
  const [userDetail, setUserDetail] = useState(null);

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <div className="flex flex-col h-screen">
        <main className="flex flex-grow overflow-hidden">
          <AppSidebar />
          <div className="flex-grow overflow-auto">{children}</div>
        </main>
      </div>
    </UserDetailContext.Provider>
  );
};

export default Provider;
