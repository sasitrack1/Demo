"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { MusicPlayer } from "@/components/music-player"
import { EmotionDetector } from "@/components/emotion-detector"
import { HomeView } from "@/components/views/home-view"
import { SearchView } from "@/components/views/search-view"
import { LibraryView } from "@/components/views/library-view"
import { LikedSongsView } from "@/components/views/liked-songs-view"
import { MoodView } from "@/components/views/mood-view"
import { playlists, type Song } from "@/lib/data"

export default function Home() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [queue, setQueue] = useState<Song[]>([])
  const [showEmotionDetector, setShowEmotionDetector] = useState(false)
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState("home")

  // Set up initial queue when current song changes
  useEffect(() => {
    if (currentSong) {
      // Find the playlist that contains the current song
      const playlistWithSong = playlists.find((playlist) => playlist.songs.some((song) => song.id === currentSong.id))

      if (playlistWithSong) {
        // Get the index of the current song in the playlist
        const songIndex = playlistWithSong.songs.findIndex((song) => song.id === currentSong.id)

        // Set the queue to be the rest of the songs in the playlist
        setQueue(playlistWithSong.songs.slice(songIndex + 1))
      }
    }
  }, [currentSong])

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song)
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handlePlay = () => {
    setIsPlaying(true)
  }

  const handleNext = () => {
    if (queue.length > 0) {
      setCurrentSong(queue[0])
      setQueue(queue.slice(1))
      setIsPlaying(true)
    }
  }

  const handlePrevious = () => {
    // For simplicity, we're not implementing previous song functionality
    // In a real app, you would need to keep track of the play history
  }

  const handleEmotionDetected = (emotion: string) => {
    setCurrentEmotion(emotion)
    setShowEmotionDetector(false)
    setCurrentView("mood")
  }

  const handleNavigate = (view: string) => {
    setCurrentView(view)
  }

  // Render the current view
  const renderView = () => {
    switch (currentView) {
      case "home":
        return <HomeView onPlaySong={handlePlaySong} />
      case "search":
        return <SearchView onPlaySong={handlePlaySong} />
      case "library":
        return <LibraryView onPlaySong={handlePlaySong} />
      case "liked":
        return <LikedSongsView onPlaySong={handlePlaySong} />
      case "mood":
        return currentEmotion ? (
          <MoodView emotion={currentEmotion} onPlaySong={handlePlaySong} />
        ) : (
          <HomeView onPlaySong={handlePlaySong} />
        )
      default:
        return <HomeView onPlaySong={handlePlaySong} />
    }
  }

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <Sidebar
        onRecommendClick={() => setShowEmotionDetector(true)}
        currentEmotion={currentEmotion}
        onNavigate={handleNavigate}
        currentView={currentView}
      />

      <MobileSidebar
        onRecommendClick={() => setShowEmotionDetector(true)}
        currentEmotion={currentEmotion}
        onNavigate={handleNavigate}
        currentView={currentView}
      />

      <main className="flex-1 overflow-auto p-4 md:p-6 pt-16 md:pt-6">{renderView()}</main>

      {currentSong && (
        <MusicPlayer
          song={currentSong}
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}

      {showEmotionDetector && (
        <EmotionDetector onEmotionDetected={handleEmotionDetected} onClose={() => setShowEmotionDetector(false)} />
      )}
    </div>
  )
}
