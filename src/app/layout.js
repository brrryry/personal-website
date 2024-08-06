import { Inter } from "next/font/google";

import "./globals.css";
import "katex/dist/katex.min.css"; // `rehype-katex` does not import the CSS for you

import { exec } from "child_process";

import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "bryan",
  description: "a typical cs portfolio",
};

export default async function RootLayout({ children }) {
  console.log(process.env.COMMIT_HASH);
  return (
    <html lang="en">
      <body className={`${inter.className} overflow-x-hidden`}>
        <main className="w-screen">
          <Navbar />
          {children}
          <footer className="bg-transparent text-">
            <p>.oOo.oOo.oOo.oOo.oOo.oOo.oOo.oOo.oOo.oOo.oOo.oOo.oOo.oOo.oOo.</p>
            {process.env.COMMIT_HASH && (
              <p>
                last commit hash:{" "}
                <a
                  href={`https://github.com/brrryry/personal-website/commit/${process.env.FULL_COMMIT_HASH}`}
                  target="_blank"
                >
                  {process.env.COMMIT_HASH}
                </a>{" "}
                | web version: {process.env.APP_VERSION}
              </p>
            )}
            <p>
              <a href="https://nextjs.org/" target="_blank">
                next.js
              </a>
              {" | "}
              <a href="https://tailwindcss.com/" target="_blank">
                tailwindcss
              </a>
              {" | "}
              <a href="https://vercel.com/" target="_blank">
                vercel
              </a>
            </p>
            <p>
              source code available{" "}
              <a
                href="https://github.com/brrryry/personal-website"
                target="_blank"
              >
                here
              </a>
            </p>
          </footer>
        </main>
      </body>
    </html>
  );
}
