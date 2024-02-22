import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Provider from "./_trpc/Provider";
import Navbar from "~/components/Navbar";

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
        <Provider>
          <div className="md:flex gap-8">
            <Navbar />
            <main className="md:h-screen md:overflow-y-scroll w-full p-8">
              {children}
            </main>
          </div>
        </Provider>
      </body>
    </html>
  );
}
