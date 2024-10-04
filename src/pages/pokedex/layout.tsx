import React from "react";
import Navbar from "~/components/navbar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
    {/* h-screen */}
      <main className={`${inter.className} flex  flex-col`}>
        <Navbar />
        {children}
      </main>
    </>
  );
};

export default RootLayout;
