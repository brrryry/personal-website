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

let _spotifyCache = {
  timestamp: 0,
  text: null,
  status: null,
  headers: {},
};

export const currentlyPlayingSong = async () => {
  const now = Date.now();

  // Return cached response if it's younger than 10 seconds
  if (_spotifyCache.text !== null && now - _spotifyCache.timestamp < 10_000) {
    //console.log("Using cached Spotify response");
    return new Response(_spotifyCache.text, {
      status: _spotifyCache.status ?? 200,
      headers: _spotifyCache.headers,
    });
  }

  let response = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      next: { revalidate: 10 },
    },
  );

  // If we didn't get a successful 200, try to refresh the access token and retry
  if (response.status !== 200) {
    const token = await getAccessToken();
    access_token = token.access_token;

    response = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        next: { revalidate: 10 },
      },
    );
  }

  if (response.status === 204) {
    return { status: 204 };
  }

  // Clone and read response body to populate cache
  const cloned = response.clone();
  const text = await cloned.text();
  const headersObj = {};
  cloned.headers.forEach((value, key) => {
    headersObj[key] = value;
  });

  _spotifyCache = {
    timestamp: Date.now(),
    text,
    status: response.status,
    headers: headersObj,
  };

  return response;
};
