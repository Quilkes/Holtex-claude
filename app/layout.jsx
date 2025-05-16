import "./globals.css";
import { ConvexClientProvider } from "./providers/ConvexClientProvider";
import { Toaster } from "sonner";
import Provider from "./providers/provider";
import { Roboto, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import AuthWrapper from "./providers/AuthWrapper";

export const metadata = {
  title: "Holtex AI",
  description: "Future of app development",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body inmaintabuse="1" className={inter.className}>
          <ConvexClientProvider>
            <AuthWrapper>
              <Provider>{children}</Provider>
              <Toaster />
            </AuthWrapper>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
