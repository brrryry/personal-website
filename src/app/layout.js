import { Inter } from "next/font/google";
import { headers } from "next/headers";

import "./globals.css";

import Navbar from "@/components/Navbar";
import Tooltip from "@/components/Tooltip";
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
      <body className={`${inter.className} lg:mx-20`}>
        <main className="min-h-screen">
          <SessionProvider>
            <Navbar loggedIn={isLoggedIn} />
            {children}
          </SessionProvider>

          {!hideFooter && (
            <footer className="bg-transparent text-purple-200 p-4 flex flex-col items-center justify-center">
              <hr className="w-full md:w-1/2 border-t border-white/3 my-4" />

              <SpotifyEmbed />

              <div className="flex items-center gap-4">
                <a
                  href="mailto:thisisbryanchan@gmail.com"
                  className="inline-flex items-center p-2 rounded hover:bg-white/5"
                  aria-label="email: thisisbryanchan@gmail.com"
                >
                  <span className="sr-only">email</span>
                  <Tooltip content="email: thisisbryanchan@gmail.com">
                    <span className="inline-flex" aria-hidden="true">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        className="h-4 w-4"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        role="img"
                        aria-hidden="true"
                      >
                        <path d="M3 8.25v7.5A3 3 0 006 19h12a3 3 0 003-3v-7.5" />
                        <path d="M21 6.75a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6.75v.75l9 6 9-6v-.75z" />
                      </svg>
                    </span>
                  </Tooltip>
                </a>

                <a
                  rel="noopener noreferrer"
                  className="inline-flex items-center p-2 rounded hover:bg-white/5"
                  aria-label="Discord: @brrryry"
                >
                  <span className="sr-only">discord: @brrryry</span>
                  <Tooltip content="discord: @brrryry">
                    <span className="inline-flex" aria-hidden="true">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4"
                        role="img"
                        aria-hidden="true"
                      >
                        <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
                      </svg>
                    </span>
                  </Tooltip>
                </a>

                <a
                  href="https://linkedin.com/in/brrryry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center p-2 rounded hover:bg-white/5"
                  aria-label="linkedin profile"
                >
                  <span className="sr-only">linkedin profile</span>
                  <Tooltip content="linkedin profile">
                    <span className="inline-flex" aria-hidden="true">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-4 w-4"
                        role="img"
                        aria-hidden="true"
                      >
                        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5S0 4.881 0 3.5 1.11 1 2.5 1s2.48 1.119 2.48 2.5zM.2 8.98h4.56V24H.2V8.98zM8.982 8.98h4.374v2.082h.062c.609-1.154 2.1-2.372 4.32-2.372 4.62 0 5.472 3.042 5.472 6.992V24h-4.56v-7.614c0-1.818-.032-4.156-2.528-4.156-2.53 0-2.916 1.976-2.916 4.014V24H8.982V8.98z" />
                      </svg>
                    </span>
                  </Tooltip>
                </a>

                <a
                  href="https://github.com/brrryry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center p-2 rounded hover:bg-white/5"
                  aria-label="github profile"
                >
                  <span className="sr-only">github profile</span>
                  <Tooltip content="github profile">
                    <span className="inline-flex" aria-hidden="true">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 bi bi-github"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        role="img"
                        aria-hidden="true"
                      >
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
                      </svg>
                    </span>
                  </Tooltip>
                </a>

                <a
                  href="https://osu.ppy.sh/users/11781698"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center p-2 rounded hover:bg-white/5"
                  aria-label="osu! profile"
                >
                  <span className="sr-only">osu! profile</span>
                  <Tooltip content="osu! profile">
                    <span className="inline-flex" aria-hidden="true">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="#9c7bde"
                      >
                        <path
                          fill="#9c7bde"
                          d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"
                        />
                        <path
                          fill="#9c7bde"
                          d="M16.5 7.5c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 4c-.551 0-1-.449-1-1s.449-1 1-1 1 .449 1 1-.449 1-1 1z"
                        />
                      </svg>
                    </span>
                  </Tooltip>
                </a>

                <a
                  href="https://anilist.co/user/brrryry/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center p-2 rounded hover:bg-white/5"
                  aria-label="anilist profile"
                >
                  <span className="sr-only">anilist profile</span>
                  <Tooltip content="anilist profile">
                    <span className="inline-flex" aria-hidden="true">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="#9c7bde"
                      >
                        <path
                          fill="#9c7bde"
                          d="M6.361 2.943L0 21.056h4.942l1.077-3.133H11.4l1.052 3.133H22.9c.71 0 1.1-.392 1.1-1.101V17.53c0-.71-.39-1.101-1.1-1.101h-6.483V4.045c0-.71-.392-1.102-1.101-1.102h-2.422c-.71 0-1.101.392-1.101 1.102v1.064l-.758-2.166zm2.324 5.948l1.688 5.018H7.144z"
                        />
                      </svg>
                    </span>
                  </Tooltip>
                </a>
              </div>

              {process.env.COMMIT_HASH && (
                <p className="text-sm">
                  current commit:{" "}
                  <a
                    href={`https://github.com/brrryry/personal-website/commit/${process.env.FULL_COMMIT_HASH}`}
                    target="_blank"
                  >
                    {process.env.COMMIT_HASH}
                  </a>
                  {" | "}
                  source code{" "}
                  <a
                    href="https://github.com/brrryry/personal-website"
                    target="_blank"
                  >
                    here
                  </a>
                </p>
              )}
              <p className="text-sm">
                <a href="https://nextjs.org/" target="_blank">
                  next.js
                </a>
                {" | "}
                <a href="https://tailwindcss.com/" target="_blank">
                  tailwindcss
                </a>
              </p>
            </footer>
          )}
        </main>
      </body>
    </html>
  );
}
