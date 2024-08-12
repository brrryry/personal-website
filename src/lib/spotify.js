

async function getAccessToken() {
    const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;
  
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
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
    const { access_token } = await getAccessToken();

    if(!access_token) return {isPlaying: false}

    const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: {
        Authorization: `Bearer ${access_token}`,
        },
    });

    if (response.status === 204 || response.status > 400) {
        return {isPlaying: false}
      }
    
      const song = await response.json();
    
      if (song.item === null) {
        return res.status(200).json({ isPlaying: false });
      }
    
      const isPlaying = song.is_playing;
      const title = song.item.name;
      const artist = song.item.artists.map((_artist) => _artist.name).join(", ");
      const songUrl = song.item.external_urls.spotify;

    
      return {
        isPlaying,
        title,
        artist,
        songUrl
      };
};