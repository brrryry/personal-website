"use client";

export const revalidate = 60;

import { useState, useEffect } from "react";

export function SpotifyEmbed() {
  const [song, setSong] = useState({});

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

  if (song.isPlaying) {
    return (
      <>
        <p>
          listening to:{" "}
          <a href={song.songUrl} target="_blank" rel="noreferrer">
            {song.title.toLowerCase()} ({song.artist.toLowerCase()})
          </a>{" "}
          on spotify!
        </p>
      </>
    );
  }

  return (
    <>
      <p>not listening to spotify rn</p>
    </>
  );
}
