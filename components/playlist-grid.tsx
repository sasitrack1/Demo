"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import type { Playlist, Song } from "@/lib/data"

interface PlaylistGridProps {
  playlists: Playlist[]
  onPlaySong: (song: Song) => void
}

export function PlaylistGrid({ playlists, onPlaySong }: PlaylistGridProps) {
  const [expandedPlaylist, setExpandedPlaylist] = useState<string | null>(null)

  const togglePlaylist = (playlistId: string) => {
    if (expandedPlaylist === playlistId) {
      setExpandedPlaylist(null)
    } else {
      setExpandedPlaylist(playlistId)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {playlists.map((playlist) => (
        <div key={playlist.id} className="flex flex-col">
          <div
            className="bg-zinc-800 rounded-lg p-4 hover:bg-zinc-700 transition cursor-pointer group relative"
            onClick={() => togglePlaylist(playlist.id)}
          >
            <div className="aspect-square mb-4 bg-zinc-700 rounded-md overflow-hidden relative">
              <img
                src={playlist.coverUrl || "/placeholder.svg?height=200&width=200"}
                alt={playlist.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-green-500 rounded-full p-3 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <Play fill="black" size={24} className="text-black ml-0.5" />
                </div>
              </div>
            </div>
            <h3 className="font-bold truncate">{playlist.name}</h3>
            <p className="text-sm text-zinc-400 mt-1 truncate">{playlist.description}</p>
          </div>

          {expandedPlaylist === playlist.id && (
            <div className="bg-zinc-800/50 rounded-lg mt-2 overflow-hidden">
              {playlist.songs.map((song, index) => (
                <div
                  key={song.id}
                  className="flex items-center p-3 hover:bg-zinc-700/50 transition cursor-pointer"
                  onClick={() => onPlaySong(song)}
                >
                  <div className="w-8 text-center text-zinc-400 mr-3">{index + 1}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{song.title}</p>
                    <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
                  </div>
                  <div className="text-zinc-400 text-sm">{song.duration}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
