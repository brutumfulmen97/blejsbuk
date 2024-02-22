import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "./_trpc/Provider";
import Navbar from "~/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blejsbuk",
  description: "Social network for developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
      </head>
      <body className={inter.className}>
        <Provider>
          <div className="flex gap-8">
            <Navbar />
            <main className="h-screen overflow-y-scroll w-full p-8">
              {children}
            </main>
          </div>
        </Provider>
      </body>
    </html>
  );
}
