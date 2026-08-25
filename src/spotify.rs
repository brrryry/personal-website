use std::sync::Mutex;
use std::time::{SystemTime, UNIX_EPOCH};
use serde::{Serialize, Deserialize};
use reqwest::header::{AUTHORIZATION, CONTENT_TYPE};
use base64::{Engine as _, engine::general_purpose};

lazy_static::lazy_static! {
    static ref SPOTIFY_CACHE: Mutex<Option<CachedResponse>> = Mutex::new(None);
    static ref ACCESS_TOKEN: Mutex<String> = Mutex::new(String::new());
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SpotifyResponse {
    pub artist: String,
    #[serde(rename = "isPlaying")]
    pub is_playing: bool,
    #[serde(rename = "songUrl")]
    pub song_url: String,
    pub title: String,
}

#[derive(Clone)]
struct CachedResponse {
    timestamp: u64,
    response: SpotifyResponse,
}

#[derive(Deserialize)]
struct TokenResponse {
    access_token: String,
}

#[derive(Deserialize)]
struct SpotifyPlayerItem {
    name: String,
    artists: Vec<SpotifyArtist>,
    external_urls: SpotifyUrls,
}

#[derive(Deserialize)]
struct SpotifyArtist {
    name: String,
}

#[derive(Deserialize)]
struct SpotifyUrls {
    spotify: String,
}

#[derive(Deserialize)]
struct SpotifyCurrentlyPlaying {
    is_playing: bool,
    item: Option<SpotifyPlayerItem>,
}

fn get_current_secs() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs()
}

async fn get_access_token() -> Result<String, Box<dyn std::error::Error + Send + Sync>> {
    let _ = dotenvy::dotenv();
    let client_id = std::env::var("SPOTIFY_CLIENT_ID")
        .map_err(|_| "SPOTIFY_CLIENT_ID environment variable not found")?;
    let client_secret = std::env::var("SPOTIFY_CLIENT_SECRET")
        .map_err(|_| "SPOTIFY_CLIENT_SECRET environment variable not found")?;
    let refresh_token = std::env::var("SPOTIFY_REFRESH_TOKEN")
        .map_err(|_| "SPOTIFY_REFRESH_TOKEN environment variable not found")?;

    let client = reqwest::Client::new();
    let auth_header = format!(
        "Basic {}",
        general_purpose::STANDARD.encode(format!("{}:{}", client_id, client_secret))
    );

    let res = client
        .post("https://accounts.spotify.com/api/token")
        .header(AUTHORIZATION, auth_header)
        .header(CONTENT_TYPE, "application/x-www-form-urlencoded")
        .form(&[
            ("grant_type", "refresh_token"),
            ("refresh_token", &refresh_token),
        ])
        .send()
        .await?
        .json::<TokenResponse>()
        .await?;

    Ok(res.access_token)
}

pub async fn get_current_song() -> SpotifyResponse {
    let now = get_current_secs();

    // 1. Check cache first
    {
        if let Ok(cache_guard) = SPOTIFY_CACHE.lock() {
            if let Some(cached) = &*cache_guard {
                if now - cached.timestamp < 10 {
                    return cached.response.clone();
                }
            }
        }
    }

    // 2. Fetch from Spotify API
    match fetch_currently_playing_retry().await {
        Ok(song) => {
            // Update cache
            if let Ok(mut cache_guard) = SPOTIFY_CACHE.lock() {
                *cache_guard = Some(CachedResponse {
                    timestamp: now,
                    response: song.clone(),
                });
            }
            song
        }
        Err(e) => {
            eprintln!("Error fetching Spotify status: {}", e);
            SpotifyResponse {
                artist: String::new(),
                is_playing: false,
                song_url: String::new(),
                title: String::new(),
            }
        }
    }
}

async fn fetch_currently_playing_retry() -> Result<SpotifyResponse, Box<dyn std::error::Error + Send + Sync>> {
    let mut token = {
        if let Ok(t_guard) = ACCESS_TOKEN.lock() {
            t_guard.clone()
        } else {
            String::new()
        }
    };

    if token.is_empty() {
        token = get_access_token().await?;
        if let Ok(mut t_guard) = ACCESS_TOKEN.lock() {
            *t_guard = token.clone();
        }
    }

    let client = reqwest::Client::new();
    let mut res = client
        .get("https://api.spotify.com/v1/me/player/currently-playing")
        .header(AUTHORIZATION, format!("Bearer {}", token))
        .send()
        .await?;

    // Retry once with refreshed token if auth fails (401 status)
    if res.status() == reqwest::StatusCode::UNAUTHORIZED {
        token = get_access_token().await?;
        if let Ok(mut t_guard) = ACCESS_TOKEN.lock() {
            *t_guard = token.clone();
        }
        res = client
            .get("https://api.spotify.com/v1/me/player/currently-playing")
            .header(AUTHORIZATION, format!("Bearer {}", token))
            .send()
            .await?;
    }

    if res.status() == reqwest::StatusCode::NO_CONTENT {
        return Ok(SpotifyResponse {
            artist: String::new(),
            is_playing: false,
            song_url: String::new(),
            title: String::new(),
        });
    }

    if !res.status().is_success() {
        return Err(format!("Spotify API returned status {}", res.status()).into());
    }

    let playing_data = res.json::<SpotifyCurrentlyPlaying>().await?;
    
    if let Some(item) = playing_data.item {
        let artists: Vec<String> = item.artists.into_iter().map(|a| a.name).collect();
        let artist_str = artists.join(", ");
        Ok(SpotifyResponse {
            artist: artist_str,
            is_playing: playing_data.is_playing,
            song_url: item.external_urls.spotify,
            title: item.name,
        })
    } else {
        Ok(SpotifyResponse {
            artist: String::new(),
            is_playing: false,
            song_url: String::new(),
            title: String::new(),
        })
    }
}
