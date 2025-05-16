"use client";

import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import useCredentials from "../store/useCredentials";

export default function AuthWrapper({ children }) {
  const { user, isSignedIn } = useUser();
  const { setUserDetail } = useCredentials();
  const createUser = useMutation(api.users.CreateUser);

  useEffect(() => {
    const saveUserToDb = async () => {
      if (isSignedIn && user) {
        try {
          const dbUser = await createUser({
            name:
              user?.fullName ||
              user?.username ||
              user?.primaryEmailAddress.emailAddress.split("@")[0] ||
              "User",
            email: user?.primaryEmailAddress.emailAddress,
            picture:
              user?.imageUrl || "https://www.flaticon.com/free-icons/user",
            clerkId: user?.id,
          });

          // Check if dbUser is an array or a single object and handle accordingly
          if (Array.isArray(dbUser) && dbUser.length > 0) {
            setUserDetail(dbUser[0]);
          } else {
            setUserDetail(dbUser);
          }
        } catch (error) {
          console.error("Error saving user to database:", error);
        }
      }
    };

    saveUserToDb();
  }, [user, isSignedIn, createUser, setUserDetail]);

  return children;
}
