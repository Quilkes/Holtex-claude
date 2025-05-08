import "./globals.css";
import { ConvexClientProvider } from "./providers/ConvexClientProvider";
import { Toaster } from "sonner";
import Provider from "./providers/provider";
import { Roboto } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import AuthWrapper from "./providers/AuthWrapper";

export const metadata = {
  title: "Holtex AI",
  description: "Future of app development",
};

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body inmaintabuse="1" className={roboto.className}>
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
