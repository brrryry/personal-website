import { currentlyPlayingSong } from "@/lib/spotify";

export async function GET(req) {
  // Fetch the current song data
  const response = await currentlyPlayingSong();

  if (response.status === 204 || response.status > 400) {
    return new Response(JSON.stringify({ isPlaying: false }), { status: 200 });
  }

  const song = await response.json();

  if (song.item === null) {
    return new Response(JSON.stringify({ isPlaying: false }), { status: 200 });
  }

  const isPlaying = song.is_playing;
  const title = song.item.name;
  const artist = song.item.artists.map((_artist) => _artist.name).join(", ");
  const songUrl = song.item.external_urls.spotify;

  const res = {
    artist,
    isPlaying,
    songUrl,
    title,
  };

  return new Response(JSON.stringify(res), { status: 200 });
}
