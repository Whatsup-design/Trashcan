// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

// import { useEffect } from "react";
// import { useAuthStore } from "./store/useAuthStore";

export const metadata: Metadata = {
  title: "Trashcan Smart",
  description: "Smart waste management system",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const loadAuth = useAuthStore((state) => state.loadAuth);

  // useEffect(() => {
  //   loadAuth();
  // }, [loadAuth]);
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
