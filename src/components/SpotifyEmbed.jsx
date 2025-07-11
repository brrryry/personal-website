"use client";

export const revalidate = 60;

import { useState, useEffect } from "react";

export function SpotifyEmbed() {
  const [song, setSong] = useState({});

  useEffect(() => {
    (async () => {
      let song = await fetch("/api/current-spotify", {
        next: {
          revalidate: 5,
        },
      });
      let response = await song.json();
      setSong(response);
    })();
  }, []);

  if (song.isPlaying) {
    return (
      <>
        <p>
          listening to:{" "}
          <a href={song.songUrl} target="_blank">
            {song.title} ({song.artist})
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
