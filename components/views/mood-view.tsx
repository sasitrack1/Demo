"use client"

import { PlaylistGrid } from "@/components/playlist-grid"
import { playlists, type Song } from "@/lib/data"

interface MoodViewProps {
  emotion: string
  onPlaySong: (song: Song) => void
}

export function MoodView({ emotion, onPlaySong }: MoodViewProps) {
  // Filter playlists based on emotion
  const emotionPlaylists = playlists.filter((playlist) => playlist.emotion.toLowerCase() === emotion.toLowerCase())

  // Get similar emotions for recommendations
  const getSimilarEmotions = (emotion: string): string[] => {
    switch (emotion.toLowerCase()) {
      case "happy":
        return ["energetic", "chill"]
      case "sad":
        return ["anxious", "chill"]
      case "angry":
        return ["energetic", "anxious"]
      case "anxious":
        return ["sad", "chill"]
      case "energetic":
        return ["happy", "angry"]
      case "chill":
        return ["happy", "sad"]
      default:
        return ["happy", "chill"]
    }
  }

  const similarEmotions = getSimilarEmotions(emotion)
  const similarPlaylists = playlists.filter((playlist) => similarEmotions.includes(playlist.emotion.toLowerCase()))

  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center mr-4">
            <span className="text-2xl">
              {emotion === "happy"
                ? "😊"
                : emotion === "sad"
                  ? "😢"
                  : emotion === "angry"
                    ? "😠"
                    : emotion === "anxious"
                      ? "😰"
                      : emotion === "energetic"
                        ? "⚡"
                        : emotion === "chill"
                          ? "😌"
                          : "🎵"}
            </span>
          </div>
          <div>
            <h2 className="text-3xl font-bold">{emotion.charAt(0).toUpperCase() + emotion.slice(1)} Mood</h2>
            <p className="text-zinc-400">Music that matches how you're feeling right now</p>
          </div>
        </div>

        {emotionPlaylists.length > 0 ? (
          <PlaylistGrid playlists={emotionPlaylists} onPlaySong={onPlaySong} />
        ) : (
          <div className="text-center py-8 bg-zinc-800/50 rounded-lg">
            <p className="text-zinc-400">No playlists found for this mood</p>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">You might also like</h2>
        <PlaylistGrid playlists={similarPlaylists} onPlaySong={onPlaySong} />
      </section>
    </div>
  )
}
