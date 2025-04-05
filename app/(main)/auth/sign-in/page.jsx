"use client";
import React, { useContext, useState, useEffect } from "react";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import axios from "axios";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import uuid4 from "uuid4";
import { toast } from "sonner";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import Head from "next/head";
import { useRouter, useSearchParams } from "next/navigation";

const LoginPage = () => {
  const { setUserDetail, userDetail } = useContext(UserDetailContext);
  const CreateUser = useMutation(api.users.CreateUser);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle redirect from Google OAuth
  useEffect(() => {
    const handleGoogleRedirect = async () => {
      const code = searchParams.get("code");

      if (code) {
        setLoading(true);
        try {
          // Exchange code for tokens
          // You'll need to set this up on your backend
          const tokenResponse = await axios.post("/api/auth/google-token", {
            code,
          });

          // Get user info using the access token
          const userInfo = await axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
              headers: {
                Authorization: `Bearer ${tokenResponse.data.access_token}`,
              },
            }
          );

          const user = userInfo.data;

          if (!user?.email) {
            throw new Error("Email not received from Google");
          }

          const dbUser = await CreateUser({
            name: user?.name || "User",
            email: user?.email,
            picture: user?.picture || "",
            uid: uuid4(),
          });

          if (!dbUser || !Array.isArray(dbUser) || dbUser.length === 0) {
            throw new Error("Invalid user data returned from database");
          }

          // Store user in localStorage and context
          localStorage.setItem("user", JSON.stringify(dbUser[0]));
          setUserDetail(dbUser[0]);

          toast.success("Logged in successfully!");
          router.push("/home");
        } catch (error) {
          console.error("Login process failed:", error);
          toast.error(error.message || "Login failed. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };

    // Redirect if already logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser || userDetail) {
      router.push("/home");
    } else if (searchParams.get("code")) {
      // Handle Google redirect with auth code
      handleGoogleRedirect();
    }
  }, [searchParams, CreateUser, router, setUserDetail, userDetail]);

  const handleGoogleLogin = () => {
    setLoading(true);
    // Construct the Google OAuth URL
    const googleAuthUrl = new URL(
      "https://accounts.google.com/o/oauth2/v2/auth"
    );

    // Add your OAuth parameters
    const params = {
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      redirect_uri: `${window.location.origin}/auth/sign-in`,
      response_type: "code",
      scope: "email profile",
      access_type: "offline",
      prompt: "consent",
    };

    // Add params to URL
    Object.entries(params).forEach(([key, value]) => {
      googleAuthUrl.searchParams.append(key, value);
    });

    // Redirect to Google sign-in
    window.location.href = googleAuthUrl.toString();
  };

  return (
    <>
      <Head>
        <title>Login - Holtex AI</title>
        <meta name="description" content="Login to Holtex AI website builder" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br pt-7 from-purple-50 to-white flex flex-col md:flex-row">
        {/* Left side - Branding and illustration */}
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center items-center md:items-start">
          <div className="max-w-md mx-auto md:mx-0 w-full">
            <h1 className="text-4xl md:text-4xl font-bold text-gray-900 mb-4">
              Welcome to Holtex AI
            </h1>

            <p className="text-xl text-gray-600 mb-8">
              Build powerful web applications with AI assistance
            </p>

            <div className="hidden md:block">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 rounded-full p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-purple-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-gray-700">Drag and drop website builder</p>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 rounded-full p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-purple-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-gray-700">AI-powered design suggestions</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-purple-100 rounded-full p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-purple-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-gray-700">Deploy with one click</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full md:w-1/2 p-6 md:p-0 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
              Sign in to your account
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Continue your journey with Holtex AI
            </p>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-4 text-gray-700 hover:border-purple-500 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              type="button"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
              ) : (
                <>
                  <Image
                    src="/imgs/google.png"
                    alt="Google icon"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                  <span className="text-base font-medium">
                    Sign in with Google
                  </span>
                </>
              )}
            </button>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                By signing in, you agree to our{" "}
                <a
                  href="/terms"
                  className="text-purple-600 hover:text-purple-700"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="text-purple-600 hover:text-purple-700"
                >
                  Privacy Policy
                </a>
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Need help?{" "}
                <a
                  href="/contact"
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
