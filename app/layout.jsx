import "./globals.css";
import Provider from "./provider";
import ConvexClientProvider from "./ConvexClientProvider";
import { Toaster } from "sonner";

export const metadata = {
  title: "Holtex AI",
  description: "Future of app development",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="inter-font">
      <body>
        <ConvexClientProvider>
          <Provider>
            {children}
            <Toaster />
          </Provider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
