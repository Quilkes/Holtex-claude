import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";
import { Toaster } from "sonner";
import Provider from "./provider";

export const metadata = {
  title: "Holtex AI",
  description: "Future of app development",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="inter-font">
      <body inmaintabuse="1">
        <ConvexClientProvider>
          <Provider>{children}</Provider>
          <Toaster />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
