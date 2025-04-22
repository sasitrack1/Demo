"use client"

import { useState, useEffect } from "react"
import { Heart, Clock } from "lucide-react"
import { playlists, type Song } from "@/lib/data"

interface LikedSongsViewProps {
  onPlaySong: (song: Song) => void
}

export function LikedSongsView({ onPlaySong }: LikedSongsViewProps) {
  // In a real app, this would be stored in a database or local storage
  const [likedSongs, setLikedSongs] = useState<Song[]>([])

  // For demo purposes, populate with some random songs
  useEffect(() => {
    const allSongs: Song[] = []
    playlists.forEach((playlist) => {
      playlist.songs.forEach((song) => {
        allSongs.push(song)
      })
    })

    // Randomly select 10 songs
    const randomSongs: Song[] = []
    const songsCopy = [...allSongs]
    for (let i = 0; i < 10 && songsCopy.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * songsCopy.length)
      randomSongs.push(songsCopy[randomIndex])
      songsCopy.splice(randomIndex, 1)
    }

    setLikedSongs(randomSongs)
  }, [])

  return (
    <div>
      <div className="flex items-end space-x-6 mb-8">
        <div className="w-52 h-52 bg-gradient-to-br from-pink-600 to-purple-700 flex items-center justify-center rounded-lg shadow-lg">
          <Heart size={64} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-medium uppercase">Playlist</p>
          <h1 className="text-5xl font-bold mb-4">Liked Songs</h1>
          <p className="text-zinc-400">{likedSongs.length} songs</p>
        </div>
      </div>

      <div className="bg-zinc-900/30 rounded-lg overflow-hidden">
        <div className="grid grid-cols-[16px_4fr_3fr_1fr] gap-4 px-4 py-2 border-b border-zinc-800 text-zinc-400 text-sm">
          <div>#</div>
          <div>Title</div>
          <div>Album</div>
          <div className="flex justify-end">
            <Clock size={16} />
          </div>
        </div>

        {likedSongs.length > 0 ? (
          likedSongs.map((song, index) => (
            <div
              key={`${song.id}-${index}`}
              className="grid grid-cols-[16px_4fr_3fr_1fr] gap-4 px-4 py-3 hover:bg-zinc-800 transition cursor-pointer items-center"
              onClick={() => onPlaySong(song)}
            >
              <div className="text-zinc-400">{index + 1}</div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-zinc-800 rounded mr-3 overflow-hidden">
                  <img
                    src={song.coverUrl || "/placeholder.svg?height=40&width=40"}
                    alt={song.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{song.title}</p>
                  <p className="text-sm text-zinc-400">{song.artist}</p>
                </div>
              </div>
              <div className="text-zinc-400 truncate">Album Name</div>
              <div className="text-zinc-400 text-right">{song.duration}</div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center">
            <p className="text-zinc-400">No liked songs yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
