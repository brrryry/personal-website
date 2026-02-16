"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import useSWR from "swr";

// Standard fetcher for SWR
const fetcher = (url) => fetch(url).then((res) => res.json());

export function SpotifyEmbed() {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  const { data: song, error } = useSWR("/api/current-spotify", fetcher, {
    refreshInterval: 10000, // 10s polling
    revalidateOnFocus: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-6 w-48 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
    );
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const activeColor =
    currentTheme === "dark" ? "text-[#f8f8ff]" : "text-[#1e1e1e]";

  if (!song) return <p className={activeColor}>Loading song status...</p>;

  return (
    <p className={activeColor}>
      {song.isPlaying ? (
        <>
          Listening to:{" "}
          <a
            href={song.songUrl}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            {song.title} ({song.artist})
          </a>{" "}
          on Spotify!
        </>
      ) : (
        "Not listening to music right now!"
      )}
    </p>
  );
}
