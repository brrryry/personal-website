import { Inter } from "next/font/google";
import { headers } from "next/headers";

import "./globals.css";

import Navbar from "@/components/Navbar";
import { SpotifyEmbed } from "@/components/SpotifyEmbed";

import { SessionProvider } from "@/components/SessionContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "bryan",
  description: "a typical cs portfolio",
};

export default async function RootLayout({ children, hideFooter = false }) {
  // Get the headers to check if the user is logged in
  const hdrs = await headers();
  const isLoggedIn = hdrs.get("isLoggedIn") === "true";

  return (
    <html lang="en">
      <body className={`${inter.className} overflow-x-hidden`}>
        <main className="w-screen">
          <SessionProvider>
            <Navbar loggedIn={isLoggedIn} />
            {children}
          </SessionProvider>

          {!hideFooter && (
            <footer className="bg-transparent text-purple-200 p-4 flex flex-col items-center justify-center">
              <p>
                ...................................................................
              </p>

              <SpotifyEmbed />

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
          )}
        </main>
      </body>
    </html>
  );
}
