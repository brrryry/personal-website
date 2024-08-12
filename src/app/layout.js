import { Inter } from "next/font/google";

import { currentlyPlayingSong } from "@/lib/spotify";

import "./globals.css";

import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

let apiCalls = new Map();

export const metadata = {
  title: "bryan",
  description: "a typical cs portfolio",
};

export default async function RootLayout({ children }) {

  let song = "";

  if(!apiCalls.has("last_spotify_call")) apiCalls.set("last_spotify_call", 0);

  if(Date.now() - apiCalls.get("last_spotify_call") > 5000) {
    song = await currentlyPlayingSong();
    apiCalls.set("last_spotify_song", song);
    apiCalls.set("last_spotify_call", Date.now());
  }
  if(apiCalls.has("last_spotify_song") && song == "") {
    song = apiCalls.get("last_spotify_song");
  }

  return (
    <html lang="en">
      <body className={`${inter.className} overflow-x-hidden`}>
        <main className="w-screen">
          <Navbar />
          {children}
          <footer className="bg-transparent text-">
            <p>.oOo.oOo.oOo.oOo.oOo.oOo.oOo.oOo.oOo.oOo.oOo.oOo.oOo.oOo.oOo.</p>

            {song.isPlaying &&
              <>
              <p>listening to: <a href={song.songUrl} target="_blank">{song.title} ({song.artist})</a> on spotify!</p>
              </>
            }

            {!song.isPlaying &&
              <>
              <p>not listening to spotify rn</p>
              </>
            }

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
