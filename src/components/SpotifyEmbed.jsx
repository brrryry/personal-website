"use client";

export const revalidate = 60;

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export function SpotifyEmbed() {
  const [song, setSong] = useState({});
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchCurrent = async () => {
      try {
        const res = await fetch("/api/current-spotify", {
          next: { revalidate: 10 },
        });
        const data = await res.json();
        if (data.status === 204) {
          if (mounted) setSong({ isPlaying: false });
          return;
        }
        if (mounted) setSong(data);
      } catch (err) {
        // handle or ignore
      }
    };

    fetchCurrent(); // initial fetch
    const intervalId = setInterval(fetchCurrent, 10000); // poll every 10s

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const currentTheme = mounted
    ? theme === "system"
      ? resolvedTheme
      : theme
    : "light";

  const activeColor =
    currentTheme === "dark" ? "text-[#f8f8ff]" : "text-[#1e1e1e]";
  const inactiveColor =
    currentTheme === "dark" ? "text-purple-200" : "text-purple-700";

  if (song.isPlaying) {
    return (
      <>
        <p className={activeColor}>
          Listening to:{" "}
          <a href={song.songUrl} target="_blank" rel="noreferrer">
            {song.title.toLowerCase()} ({song.artist.toLowerCase()})
          </a>{" "}
          on Spotify!
        </p>
      </>
    );
  }

  return (
    <>
      <p className={activeColor}>Not listening to music right now!</p>
    </>
  );
}
