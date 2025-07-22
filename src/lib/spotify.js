let access_token = "";

export let currentSong = {};

async function getAccessToken() {
  const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });
  return response.json();
}

export const currentlyPlayingSong = async () => {
  let response = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      next: {
        revalidate: 5,
      },
    },
  );

  if (response.status == 200) return response;

  const token = await getAccessToken();
  access_token = token.access_token;

  return fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export function pollCurrentlyPlayingSong(intervalSeconds, callback) {
  let intervalId = setInterval(async () => {
    try {
      const response = await currentlyPlayingSong();
      const data = await response.json();
      callback(data);
    } catch (error) {
      console.error("Error polling currently playing song:", error);
    }
  }, intervalSeconds * 1000);

  return () => clearInterval(intervalId);
}