import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import "@mdxeditor/editor/style.css";
import Provider from "./_trpc/Provider";
import Navbar from "~/components/Navbar";
import { Toaster } from "react-hot-toast";

const roboto = Roboto({
  fallback: ["system-ui", "sans-serif"],
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin-ext"],
});

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
      <body className={roboto.className}>
        <Toaster position="top-right" />
        <Provider>
          <div className="md:flex">
            <Navbar />
            <main className="md:p-8 py-20 w-full">{children}</main>
          </div>
        </Provider>
      </body>
    </html>
  );
}
