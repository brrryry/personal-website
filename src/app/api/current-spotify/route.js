import { currentlyPlayingSong } from "@/lib/spotify";

export const revalidate = 60

export async function GET(req) {

    const response = await currentlyPlayingSong();

    if (response.status === 204 || response.status > 400) {
      return Response.json({ isPlaying: false });
    }
  
    const song = await response.json();
  
    if (song.item === null) {
      return res.status(200).json({ isPlaying: false });
    }
  
    const isPlaying = song.is_playing;
    const title = song.item.name;
    const artist = song.item.artists.map((_artist) => _artist.name).join(", ");
    const songUrl = song.item.external_urls.spotify;

    return Response.json({
      artist,
      isPlaying,
      songUrl,
      title,
    });
}