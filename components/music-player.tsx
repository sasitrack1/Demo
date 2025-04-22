"use client"

import { useState, useRef } from "react"
import ReactPlayer from "react-player"
import { Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import type { Song } from "@/lib/data"

interface MusicPlayerProps {
  song: Song
  isPlaying: boolean
  onPlay: () => void
  onPause: () => void
  onNext: () => void
  onPrevious: () => void
}

export function MusicPlayer({ song, isPlaying, onPlay, onPause, onNext, onPrevious }: MusicPlayerProps) {
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const playerRef = useRef<ReactPlayer>(null)

  const handleProgress = (state: { played: number }) => {
    setProgress(state.played)
  }

  const handleDuration = (duration: number) => {
    setDuration(duration)
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    if (value[0] > 0 && isMuted) {
      setIsMuted(false)
    }
  }

  const handleSeek = (value: number[]) => {
    if (playerRef.current) {
      playerRef.current.seekTo(value[0])
    }
    setProgress(value[0])
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  const VolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={20} />
    if (volume < 0.5) return <Volume1 size={20} />
    return <Volume2 size={20} />
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-4">
      <div className="hidden">
        <ReactPlayer
          ref={playerRef}
          url={song.youtubeUrl}
          playing={isPlaying}
          volume={isMuted ? 0 : volume}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onEnded={onNext}
          config={{
            youtube: {
              playerVars: {
                controls: 0,
                disablekb: 1,
                fs: 0,
                modestbranding: 1,
                iv_load_policy: 3,
              },
            },
          }}
          width="0"
          height="0"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center w-1/4">
          <div className="w-14 h-14 bg-zinc-800 rounded mr-3 overflow-hidden">
            <img
              src={song.coverUrl || "/placeholder.svg?height=56&width=56"}
              alt={song.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="truncate">
            <p className="font-medium truncate">{song.title}</p>
            <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
          </div>
        </div>

        <div className="flex flex-col items-center w-2/4">
          <div className="flex items-center gap-4 mb-2">
            <button onClick={onPrevious} className="text-zinc-400 hover:text-white transition">
              <SkipBack size={20} />
            </button>

            <button
              onClick={isPlaying ? onPause : onPlay}
              className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center hover:scale-105 transition"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </button>

            <button onClick={onNext} className="text-zinc-400 hover:text-white transition">
              <SkipForward size={20} />
            </button>
          </div>

          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-zinc-400 w-10 text-right">{formatTime(progress * duration)}</span>

            <Slider value={[progress]} min={0} max={1} step={0.001} onValueChange={handleSeek} className="w-full" />

            <span className="text-xs text-zinc-400 w-10">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-1/4 justify-end">
          <button onClick={toggleMute} className="text-zinc-400 hover:text-white transition">
            <VolumeIcon />
          </button>

          <Slider value={[volume]} min={0} max={1} step={0.01} onValueChange={handleVolumeChange} className="w-24" />
        </div>
      </div>
    </div>
  )
}
