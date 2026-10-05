"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Play, Pause, Mic, Check, CheckCheck } from "lucide-react";

interface TelegramVoiceNoteProps {
  src: string;
  isMe?: boolean;
  roleAccent?: string; // Hex or tailwind color
  timestamp?: string;
  onPlayStateChange?: (isPlaying: boolean) => void;
  messageId?: string;
}

// Générateur pseudo-déterministe d'ondes vocales façon Telegram
function generateWaveformBars(seedStr: string, count = 36): number[] {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }

  const bars: number[] = [];
  const basePattern = [
    6, 12, 18, 10, 16, 24, 19, 13, 26, 22, 15, 28, 17, 11, 20, 25, 14, 22, 27,
    18, 12, 23, 16, 9, 14, 21, 16, 26, 19, 12, 18, 24, 15, 10, 7, 5,
  ];

  for (let i = 0; i < count; i++) {
    const pseudo = Math.abs(Math.sin((hash + i * 37) * 9999));
    const base = basePattern[i % basePattern.length];
    const val = Math.max(4, Math.min(28, Math.round(base * 0.7 + pseudo * 12)));
    bars.push(val);
  }
  return bars;
}

export function TelegramVoiceNote({
  src,
  isMe = false,
  roleAccent = "#0f2744",
  timestamp,
  messageId,
}: TelegramVoiceNoteProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<1 | 1.5 | 2>(1);
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const waveformRef = useRef<HTMLDivElement>(null);

  // Barre d'ondes déterministe
  const bars = useMemo(() => generateWaveformBars(src.slice(0, 120) || "telegram-voice", 36), [src]);

  // Initialisation de l'élément Audio
  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration && (!duration || isNaN(duration) || !isFinite(duration))) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    // Écoute des autres lecteurs pour couper le son quand un autre démarre
    const handleGlobalPlay = (e: CustomEvent) => {
      if (e.detail?.id !== messageId && audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };
    window.addEventListener("has_audio_play" as any, handleGlobalPlay);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      window.removeEventListener("has_audio_play" as any, handleGlobalPlay);
    };
  }, [src, messageId]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Notifier les autres lecteurs
      window.dispatchEvent(new CustomEvent("has_audio_play", { detail: { id: messageId } }));
      audioRef.current.playbackRate = playbackRate;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const handleSpeedToggle = () => {
    const nextRate: 1 | 1.5 | 2 = playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1;
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!waveformRef.current || !audioRef.current) return;
    const rect = waveformRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetTime = ratio * (duration || 5);
    audioRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || !isFinite(secs) || secs < 0) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const progress = duration > 0 ? Math.min(1, currentTime / duration) : 0;
  const currentBarIndex = Math.floor(progress * bars.length);

  // Couleurs dynamiques
  const playButtonBg = isMe ? "bg-white text-[#0f2744]" : "bg-[#0f2744] text-white";
  const activeBarColor = isMe ? "bg-white" : "bg-[#0f2744]";
  const inactiveBarColor = isMe ? "bg-white/40" : "bg-slate-300";
  const speedBtnStyle = isMe
    ? "bg-white/20 text-white hover:bg-white/30"
    : "bg-slate-100 text-slate-700 hover:bg-slate-200";

  return (
    <div
      className={`group/voice select-none flex items-center gap-3 py-1 px-1 min-w-[240px] sm:min-w-[280px] max-w-[340px]`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Bouton Play/Pause circulaire avec anneau de progression SVG */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg className="w-11 h-11 -rotate-90 pointer-events-none" viewBox="0 0 44 44">
          <circle
            cx="22"
            cy="22"
            r="19"
            fill="none"
            stroke={isMe ? "rgba(255,255,255,0.25)" : "rgba(15,39,68,0.12)"}
            strokeWidth="2.5"
          />
          <circle
            cx="22"
            cy="22"
            r="19"
            fill="none"
            stroke={isMe ? "#ffffff" : "#e0521c"}
            strokeWidth="2.5"
            strokeDasharray={2 * Math.PI * 19}
            strokeDashoffset={2 * Math.PI * 19 * (1 - progress)}
            strokeLinecap="round"
            className="transition-all duration-100"
          />
        </svg>

        <button
          type="button"
          onClick={togglePlay}
          title={isPlaying ? "Mettre en pause" : "Écouter le message vocal"}
          className={`absolute w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-transform active:scale-95 ${playButtonBg}`}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>
      </div>

      {/* Ondes audio interactives façon Telegram */}
      <div className="flex-1 flex flex-col justify-center min-w-0">
        <div
          ref={waveformRef}
          onClick={handleWaveformClick}
          className="flex items-center gap-[2.5px] h-7 cursor-pointer py-1"
          title="Cliquez pour avancer ou reculer"
        >
          {bars.map((height, i) => {
            const isPlayed = i <= currentBarIndex;
            return (
              <span
                key={i}
                style={{ height: `${height}px` }}
                className={`w-[2.5px] rounded-full transition-all duration-75 ${
                  isPlayed ? activeBarColor : inactiveBarColor
                } ${isHovered ? "opacity-100" : "opacity-95"}`}
              />
            );
          })}
        </div>

        {/* Pied : temps écoulé, vitesse 1X/1.5X/2X & statut */}
        <div className="flex items-center justify-between text-[11px] font-medium mt-0.5">
          <div className="flex items-center gap-1.5 opacity-90">
            <Mic className="w-3 h-3 opacity-60" />
            <span className="font-mono text-[10.5px]">
              {isPlaying || currentTime > 0
                ? `${formatTime(currentTime)} / ${formatTime(duration || 0)}`
                : formatTime(duration || 0)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Bouton vitesse Telegram */}
            <button
              type="button"
              onClick={handleSpeedToggle}
              title="Vitesse de lecture"
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-tight transition-colors ${speedBtnStyle}`}
            >
              {playbackRate}X
            </button>

            {timestamp && (
              <span className="text-[10px] opacity-75">{timestamp}</span>
            )}

            {isMe && (
              <span className="font-bold text-[10px] text-emerald-300 tracking-wider">Lu</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
