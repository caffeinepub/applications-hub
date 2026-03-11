import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "app_music_volume";
const MUSIC_SRC =
  "https://archive.org/download/05-casino-night-zone/05%20Casino%20Night%20Zone.ogg";

export interface MusicPlayerState {
  volume: number;
  setVolume: (vol: number) => void;
  isMuted: boolean;
}

export function useMusicPlayer(): MusicPlayerState {
  const [volume, setVolumeState] = useState<number>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      const parsed = Number.parseInt(stored, 10);
      if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= 100) return parsed;
    }
    return 50;
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasInteracted = useRef<boolean>(false);

  // Initialize audio element once
  useEffect(() => {
    const audio = new Audio(MUSIC_SRC);
    audio.loop = true;
    audio.preload = "none";
    audioRef.current = audio;

    const storedVol = Number.parseInt(
      localStorage.getItem(STORAGE_KEY) ?? "50",
      10,
    );
    const safeVol =
      !Number.isNaN(storedVol) && storedVol >= 1 && storedVol <= 100
        ? storedVol
        : 50;

    if (safeVol === 1) {
      audio.volume = 0;
      audio.muted = true;
    } else {
      audio.volume = safeVol / 100;
      audio.muted = false;
    }

    // Try auto-play
    const tryPlay = () => {
      audio.play().catch(() => {
        // Autoplay blocked — wait for first user interaction
      });
    };
    tryPlay();

    // If autoplay is blocked, start on first user interaction
    const handleInteraction = () => {
      if (!hasInteracted.current) {
        hasInteracted.current = true;
        audio.play().catch(() => {});
        document.removeEventListener("click", handleInteraction);
        document.removeEventListener("keydown", handleInteraction);
        document.removeEventListener("touchstart", handleInteraction);
      }
    };
    document.addEventListener("click", handleInteraction);
    document.addEventListener("keydown", handleInteraction);
    document.addEventListener("touchstart", handleInteraction);

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  // Sync volume changes to audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (volume === 1) {
      audio.volume = 0;
      audio.muted = true;
    } else {
      audio.muted = false;
      audio.volume = volume / 100;
    }
    localStorage.setItem(STORAGE_KEY, String(volume));
  }, [volume]);

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.min(100, Math.max(1, Math.round(vol)));
    setVolumeState(clamped);
    // If user interacts via slider, start playback
    if (!hasInteracted.current && audioRef.current) {
      hasInteracted.current = true;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  const isMuted = volume === 1;

  return { volume, setVolume, isMuted };
}
