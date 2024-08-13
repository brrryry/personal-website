import { currentlyPlayingSong } from "@/lib/spotify";

const apiCalls = new Map();

const timeLimit = 10000; // 10 seconds time limit between new 


export async function GET(req) {
    const currentTime = Date.now();
    const cachedSong = apiCalls.get("last-song");
    const cachedTime = apiCalls.get("last-time");

    // Check if there is a cached response and if it's still valid
    if (cachedTime && currentTime - cachedTime < timeLimit) {
        return new Response(JSON.stringify(cachedSong), { status: 200 });
    }

    // Fetch the current song data
    const response = await currentlyPlayingSong();

    apiCalls.set("last-time", currentTime); //regardless of response, assert cache time

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
        title
    };

    // Cache the new response and timestamp
    apiCalls.set("last-song", res);

    return new Response(JSON.stringify(res), { status: 200 });
}
