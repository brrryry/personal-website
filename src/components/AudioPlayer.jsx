"use client";

import React, { useState, useRef, useEffect } from "react";

export function AudioPlayer({ src, title = "Audio Track", artist }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [hasError, setHasError] = useState(false);

  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Reset states if src changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setHasError(false);
  }, [src]);

  // Handle play/pause click
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().catch((err) => {
        console.error("Playback failed:", err);
      });
    } else {
      audioRef.current.pause();
    }
  };

  // Time update
  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Metadata loaded (duration)
  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const onDurationChange = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Audio ended
  const onEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Audio loading/playback error
  const onError = (e) => {
    console.error("Audio element error:", e);
    setHasError(true);
  };

  // Format time (e.g., 03:45)
  const formatTime = (time) => {
    if (isNaN(time) || !isFinite(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Handle progress bar change (seek)
  const handleProgressChange = (e) => {
    if (!audioRef.current) return;
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Toggle mute
  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  if (!isMounted) {
    return (
      <div className="w-full max-w-xl mx-auto my-6 p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10 animate-pulse h-24" />
    );
  }

  // Safely URL-encode the src to handle spaces and special characters
  const encodedSrc = src ? encodeURI(src) : "";

  return (
    <div className="w-full max-w-xl mx-auto my-6 p-5 rounded-2xl bg-gradient-to-r from-purple-950/10 to-indigo-950/10 dark:from-purple-950/20 dark:to-indigo-950/20 border border-purple-500/20 shadow-xl backdrop-blur-md transition-all duration-300 hover:shadow-purple-500/5">
      <audio
        ref={audioRef}
        src={encodedSrc}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onDurationChange={onDurationChange}
        onEnded={onEnded}
        onError={onError}
        preload="metadata"
      />

      <div className="flex flex-col gap-4">
        {/* Track info & volume controls */}
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h4 className="text-base font-semibold text-purple-950 dark:text-purple-100 truncate">
              {title}
            </h4>
            {artist && (
              <p className="text-xs text-purple-800/60 dark:text-purple-300/60 font-medium">
                {artist}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Volume Button */}
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-lg text-purple-800 dark:text-purple-200 hover:bg-purple-500/10 transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted || volume === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
                  />
                </svg>
              )}
            </button>

            {/* Volume slider */}
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-16 md:w-20 accent-purple-600 cursor-pointer h-1 rounded-lg bg-purple-200 dark:bg-purple-950"
            />
          </div>
        </div>

        {/* Playback Controls & Timeline */}
        <div className="flex items-center gap-4">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            disabled={hasError}
            className={`flex items-center justify-center w-12 h-12 rounded-full ${hasError ? "bg-red-500/80 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 hover:scale-105 active:scale-95"} text-white shadow-lg transition-all duration-200`}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {hasError ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
            ) : isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5 translate-x-0.5"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>

          {/* Timeline slider */}
          <div className="flex-1 flex flex-col gap-1">
            <input
              type="range"
              ref={progressBarRef}
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleProgressChange}
              disabled={hasError}
              className="w-full accent-purple-600 cursor-pointer h-1.5 rounded-lg bg-purple-200 dark:bg-purple-950/60"
            />
            <div className="flex justify-between text-xs text-purple-800/60 dark:text-purple-300/60 font-semibold select-none">
              <span>{hasError ? "--:--" : formatTime(currentTime)}</span>
              <span>{hasError ? "--:--" : formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {hasError && (
          <p className="text-center text-xs text-red-500 font-semibold mt-1">
            Failed to load audio. Please verify the file path.
          </p>
        )}
      </div>
    </div>
  );
}
