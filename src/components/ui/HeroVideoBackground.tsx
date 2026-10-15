"use client";

import { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface HeroVideoBackgroundProps {
  src?: string;
  className?: string;
}

export function HeroVideoBackground({
  src = "/videos/31718-388172974.mp4",
  className = ""
}: HeroVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Attempt autoplay
    video.play().catch(() => {
      // Autoplay requires muted on modern browsers
      video.muted = true;
      setIsMuted(true);
      video.play().catch(() => setIsPlaying(false));
    });
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <div 
      className={`absolute inset-0 top-0 left-0 right-0 h-[880px] sm:h-[960px] overflow-hidden pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadedData={() => setIsLoaded(true)}
        className={`w-full h-full object-cover object-center scale-[1.02] transition-opacity duration-1000 ${
          isLoaded ? "opacity-40" : "opacity-0"
        }`}
      >
        <source src={src} type="video/mp4" />
        <source src="/31718-388172974.mp4" type="video/mp4" />
      </video>

      {/* Cinematic Overlays: Pure Black, Warm Champagne Gold Tint & Radial Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/80 to-[#08080A]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_10%,_#08080A_85%)]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#C5A059]/20 via-transparent to-[#DFBA73]/10 mix-blend-screen" />
      
      {/* Subtle Digital Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none" 
        style={{ 
          backgroundImage: "linear-gradient(to right, rgba(212,175,55,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,175,55,0.15) 1px, transparent 1px)", 
          backgroundSize: "44px 44px" 
        }} 
      />

      {/* Floating Micro Video Controls (Pure Glass & Champagne Gold Indicator) */}
      <div className="absolute bottom-6 right-6 pointer-events-auto z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-xs text-neutral-300 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-neutral-400 uppercase tracking-wider pr-1">
          <span className={`h-1.5 w-1.5 rounded-full ${isPlaying ? "bg-[#DFBA73] shadow-[0_0_8px_#DFBA73] animate-pulse" : "bg-neutral-600"}`} />
          Cinematic
        </span>
        <button
          type="button"
          onClick={togglePlay}
          className="p-1 rounded-full hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          title={isPlaying ? "Pause background video" : "Play background video"}
          aria-label={isPlaying ? "Pause background video" : "Play background video"}
        >
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 text-[#DFBA73]" />}
        </button>
        <button
          type="button"
          onClick={toggleMute}
          className="p-1 rounded-full hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          title={isMuted ? "Unmute audio" : "Mute audio"}
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
        >
          {isMuted ? <VolumeX className="h-3.5 w-3.5 text-neutral-500" /> : <Volume2 className="h-3.5 w-3.5 text-[#DFBA73]" />}
        </button>
      </div>
    </div>
  );
}
