import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";
import { Toaster } from "sonner";
import Provider from "./provider";
import { Roboto } from "next/font/google";

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
    <html lang="en">
      <body inmaintabuse="1" className={roboto.className}>
        <ConvexClientProvider>
          <Provider>{children}</Provider>
          <Toaster />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
