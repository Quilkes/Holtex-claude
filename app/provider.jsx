"use client";
import React, { useEffect, useState } from "react";
import { UserDetailContext } from "./context/UserDetailContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import AppSidebar from "./components/AppSidebar";
import { useRouter } from "next/navigation";

const Provider = ({ children }) => {
  const [userDetail, setUserDetail] = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const convex = useConvex();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isAuthChecked) {
      IsAuthenticated();
    }
  }, [isAuthChecked]);

  const IsAuthenticated = async () => {
    if (typeof window === "undefined") return;

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/");
      setIsAuthChecked(true);
      return;
    }

    const user = JSON.parse(storedUser);

    try {
      const result = await convex.query(api.users.GetUser, {
        email: user.email,
      });

      if (!result) {
        router.push("/");
      } else if (!userDetail) {
        setUserDetail(result);
      }
    } catch (error) {
      console.error("Authentication error:", error);
    } finally {
      setIsAuthChecked(true);
    }
  };

  if (!isMounted || !isAuthChecked) {
    return (
      <div className="w-full h-screen grid place-content-center">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY}
    >
      <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
        <div className="flex flex-col h-screen">
          <main className="flex flex-grow overflow-hidden">
            <AppSidebar />
            <div className="flex-grow overflow-auto">{children}</div>
          </main>
        </div>
      </UserDetailContext.Provider>
    </GoogleOAuthProvider>
  );
};

export default Provider;
