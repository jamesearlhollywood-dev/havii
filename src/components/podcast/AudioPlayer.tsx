"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArtworkFrame } from "@/components/visual/ArtworkFrame";

interface AudioPlayerProps {
  audioUrl: string | null;
  title: string;
  showName: string;
  coverImage?: string | null;
}

const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5, 2];
const SKIP_BACK = 15;
const SKIP_FWD = 30;

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function PlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <polygon points="6 4 20 12 6 20 6 4" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

function SkipIcon({ direction }: { direction: "back" | "fwd" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {direction === "back" ? (
        <>
          <path d="M11 19L2 12l9-7" />
          <path d="M22 19l-9-7 9-7" />
        </>
      ) : (
        <>
          <path d="M13 5l9 7-9 7" />
          <path d="M2 5l9 7-9 7" />
        </>
      )}
    </svg>
  );
}

function VolumeIcon({ muted }: { muted: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      {muted ? (
        <>
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </>
      ) : (
        <>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </>
      )}
    </svg>
  );
}

export function AudioPlayer({ audioUrl, title, showName, coverImage }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    const onLoaded = () => {
      setDuration(audio.duration || 0);
      setReady(true);
    };
    const onTime = () => setCurrentTime(audio.currentTime);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [audioUrl]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) audio.pause();
    else audio.play().catch(() => {});
  }, [playing]);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(seconds, audio.duration || 0));
    setCurrentTime(audio.currentTime);
  }, []);

  const skip = useCallback((delta: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    seek(audio.currentTime + delta);
  }, [seek]);

  const onSeekBarClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    seek(ratio * audio.duration);
  }, [seek]);

  const changeVolume = useCallback((value: number) => {
    const audio = audioRef.current;
    setVolume(value);
    setMuted(value === 0);
    if (audio) {
      audio.volume = value;
      audio.muted = value === 0;
    }
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const newMuted = !muted;
    setMuted(newMuted);
    audio.muted = newMuted;
  }, [muted]);

  const changeRate = useCallback((rate: number) => {
    const audio = audioRef.current;
    setPlaybackRate(rate);
    if (audio) audio.playbackRate = rate;
  }, []);

  // No audio URL — show a professional message instead of a broken player
  if (!audioUrl) {
    return (
      <div className="rounded-2xl border border-studio-line bg-studio-charcoal p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-studio-line bg-studio-surface">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-studio-muted">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </div>
        <p className="mt-4 text-sm font-medium text-studio-ink">Audio coming soon</p>
        <p className="mt-1 text-xs text-studio-muted">
          The audio file for this episode hasn&apos;t been published yet. Please check back later.
        </p>
      </div>
    );
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="rounded-2xl border border-studio-line bg-studio-charcoal p-4 sm:p-6">
      <audio ref={audioRef} src={audioUrl} preload="metadata" className="hidden" />

      {/* Artwork + meta */}
      <div className="flex items-center gap-4">
        <div className="shrink-0">
          {coverImage ? (
            <img
              src={coverImage}
              alt={title}
              className="h-16 w-16 rounded-xl border border-studio-line object-cover sm:h-20 sm:w-20"
            />
          ) : (
            <div className="h-16 w-16 sm:h-20 sm:w-20">
              <ArtworkFrame size="sm" label="GH3" subtitle="" className="h-16 w-16 !text-lg sm:h-20 sm:w-20" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium uppercase tracking-wide text-studio-gold">
            {showName}
          </p>
          <p className="mt-0.5 truncate text-sm font-semibold text-studio-ink sm:text-base">
            {title}
          </p>
        </div>
      </div>

      {/* Seek bar */}
      <div className="mt-5">
        <div
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.floor(duration)}
          aria-valuenow={Math.floor(currentTime)}
          tabIndex={0}
          onClick={onSeekBarClick}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") skip(-5);
            if (e.key === "ArrowRight") skip(5);
          }}
          className="group relative h-2 cursor-pointer rounded-full bg-studio-line"
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-studio-gold"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-studio-gold bg-studio-black opacity-0 transition group-hover:opacity-100"
            style={{ left: `${progress}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-xs text-studio-muted">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-between gap-2">
        {/* Skip back */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => skip(-SKIP_BACK)}
            className="flex flex-col items-center rounded-lg px-2 py-1 text-studio-muted transition hover:bg-studio-surface hover:text-studio-ink"
            aria-label={`Skip back ${SKIP_BACK} seconds`}
          >
            <SkipIcon direction="back" />
            <span className="text-[10px] font-medium">15</span>
          </button>

          {/* Play / pause */}
          <button
            type="button"
            onClick={togglePlay}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-studio-gold text-studio-black transition hover:bg-studio-gold-light"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>

          {/* Skip forward */}
          <button
            type="button"
            onClick={() => skip(SKIP_FWD)}
            className="flex flex-col items-center rounded-lg px-2 py-1 text-studio-muted transition hover:bg-studio-surface hover:text-studio-ink"
            aria-label={`Skip forward ${SKIP_FWD} seconds`}
          >
            <SkipIcon direction="fwd" />
            <span className="text-[10px] font-medium">30</span>
          </button>
        </div>

        {/* Playback speed + volume */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Playback rate */}
          <div className="flex items-center gap-1">
            {PLAYBACK_RATES.map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => changeRate(rate)}
                className={`rounded-md px-1.5 py-1 text-xs font-medium transition ${
                  playbackRate === rate
                    ? "bg-studio-gold/15 text-studio-gold"
                    : "text-studio-muted hover:bg-studio-surface hover:text-studio-ink"
                }`}
                aria-label={`Playback speed ${rate}x`}
                aria-pressed={playbackRate === rate}
              >
                {rate}×
              </button>
            ))}
          </div>

          {/* Volume — hidden on small screens */}
          <div className="hidden items-center gap-1.5 sm:flex">
            <button
              type="button"
              onClick={toggleMute}
              className="text-studio-muted transition hover:text-studio-ink"
              aria-label={muted ? "Unmute" : "Mute"}
            >
              <VolumeIcon muted={muted} />
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={(e) => changeVolume(parseFloat(e.target.value))}
              className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-studio-line accent-studio-gold"
              aria-label="Volume"
            />
          </div>
        </div>
      </div>

      {/* Loading hint before metadata arrives */}
      {!ready && (
        <p className="mt-3 text-center text-xs text-studio-muted">Loading audio…</p>
      )}
    </div>
  );
}
