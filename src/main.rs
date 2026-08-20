use std::net::SocketAddr;
use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};
use axum::{
    routing::get,
    response::{Response, IntoResponse},
    http::{StatusCode, header, Uri},
    Router,
    Json,
};
use clap::{Parser, Subcommand};
use notify::{Watcher, RecursiveMode, Event};
use shadow_rs::shadow;

mod generator;
mod spotify;

shadow!(shadow);

pub const COMMIT_HASH: &str = shadow::COMMIT_HASH;

#[derive(Parser)]
#[command(name = "portfolio")]
#[command(about = "Bryan Chan's Portfolio Site Generator and Server", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands {
    /// Compiles Markdown and JSON templates to dist/ static files
    Build,
    /// Starts the Axum web server to serve the dist/ static files
    Serve,
    /// Builds, serves, and watches for file changes — rebuilds automatically
    Dev,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Load .env if present
    let _ = dotenvy::dotenv();

    let cli = Cli::parse();

    match cli.command {
        Some(Commands::Build) => {
            generator::build_site()?;
        }
        Some(Commands::Serve) => {
            run_server().await?;
        }
        Some(Commands::Dev) => {
            // Initial build
            generator::build_site()?;
            // Spawn watcher on a background thread
            let debounce: Arc<Mutex<Option<Instant>>> = Arc::new(Mutex::new(None));
            let debounce_clone = debounce.clone();
            std::thread::spawn(move || {
                let (tx, rx) = std::sync::mpsc::channel::<notify::Result<Event>>();
                let mut watcher = notify::recommended_watcher(move |res| {
                    let _ = tx.send(res);
                }).expect("Failed to create watcher");
                for dir in &["posts", "templates", "static"] {
                    if std::path::Path::new(dir).exists() {
                        watcher.watch(std::path::Path::new(dir), RecursiveMode::Recursive)
                            .expect("Failed to watch directory");
                    }
                }
                println!("\x1b[32m[dev]\x1b[0m Watching posts/, templates/, static/ for changes...");
                loop {
                    match rx.recv() {
                        Ok(Ok(_event)) => {
                            // Debounce: only rebuild if no event in the last 300ms
                            let should_rebuild = {
                                let mut last = debounce_clone.lock().unwrap();
                                let now = Instant::now();
                                let rebuild = last.map_or(true, |t| now.duration_since(t) > Duration::from_millis(300));
                                *last = Some(now);
                                rebuild
                            };
                            if should_rebuild {
                                std::thread::sleep(Duration::from_millis(150));
                                println!("\x1b[32m[dev]\x1b[0m Change detected — rebuilding...");
                                match generator::build_site() {
                                    Ok(()) => println!("\x1b[32m[dev]\x1b[0m Rebuild complete."),
                                    Err(e) => eprintln!("\x1b[31m[dev]\x1b[0m Build error: {}", e),
                                }
                            }
                        }
                        Ok(Err(e)) => eprintln!("[dev] Watch error: {:?}", e),
                        Err(_) => break,
                    }
                }
            });
            run_server().await?;
        }
        None => {
            // Run build first, then start server
            generator::build_site()?;
            run_server().await?;
        }
    }

    Ok(())
}

async fn run_server() -> Result<(), Box<dyn std::error::Error>> {
    let port = std::env::var("PORT")
        .unwrap_or_else(|_| "3000".to_string())
        .parse::<u16>()
        .unwrap_or(3000);

    let app = Router::new()
        .route("/api/current-spotify", get(get_spotify))
        .fallback(fallback_handler);

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    println!("Web server starting on http://localhost:{}", port);
    
    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}

// Axum Handlers

async fn get_spotify() -> impl IntoResponse {
    let song = spotify::get_current_song().await;
    Json(song)
}

async fn fallback_handler(uri: Uri) -> Response {
    let path_str = uri.path();
    
    // Resolve empty/root path to index.html
    let clean_path = if path_str == "/" {
        "index.html"
    } else {
        path_str.trim_start_matches('/')
    };

    // 1. Try exact file from dist/
    let file_path = PathBuf::from("dist").join(clean_path);
    if file_path.is_file() {
        return serve_file(&file_path).await;
    }

    // 2. Try appending .html (e.g. /about -> dist/about.html)
    let html_file_path = PathBuf::from("dist").join(format!("{}.html", clean_path));
    if html_file_path.is_file() {
        return serve_file(&html_file_path).await;
    }

    // 3. Try index.html in a subdirectory
    let index_file_path = PathBuf::from("dist").join(clean_path).join("index.html");
    if index_file_path.is_file() {
        return serve_file(&index_file_path).await;
    }

    // 4. Default 404
    Response::builder()
        .status(StatusCode::NOT_FOUND)
        .header(header::CONTENT_TYPE, "text/plain")
        .body(axum::body::Body::from("404 Not Found"))
        .unwrap()
}

async fn serve_file(path: &Path) -> Response {
    match tokio::fs::read(path).await {
        Ok(bytes) => {
            let mime = get_mime_type(path);
            Response::builder()
                .status(StatusCode::OK)
                .header(header::CONTENT_TYPE, mime)
                .body(axum::body::Body::from(bytes))
                .unwrap()
        }
        Err(e) => {
            eprintln!("Error reading file: {}", e);
            Response::builder()
                .status(StatusCode::INTERNAL_SERVER_ERROR)
                .body(axum::body::Body::from("Internal Server Error"))
                .unwrap()
        }
    }
}

fn get_mime_type(path: &Path) -> &'static str {
    match path.extension().and_then(|s| s.to_str()) {
        Some("html") => "text/html; charset=utf-8",
        Some("css") => "text/css",
        Some("js") => "application/javascript",
        Some("jpg") | Some("jpeg") => "image/jpeg",
        Some("png") => "image/png",
        Some("svg") => "image/svg+xml",
        Some("pdf") => "application/pdf",
        Some("ico") => "image/x-icon",
        Some("mp3") => "audio/mpeg",
        Some("json") => "application/json",
        Some("woff2") => "font/woff2",
        Some("woff") => "font/woff",
        Some("ttf") => "font/ttf",
        _ => "application/octet-stream",
    }
}
