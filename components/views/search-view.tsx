"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { PlaylistGrid } from "@/components/playlist-grid"
import { playlists, type Song, type Playlist } from "@/lib/data"

interface SearchViewProps {
  onPlaySong: (song: Song) => void
}

export function SearchView({ onPlaySong }: SearchViewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<{
    playlists: Playlist[]
    songs: { song: Song; playlist: Playlist }[]
  }>({
    playlists: [],
    songs: [],
  })

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults({ playlists: [], songs: [] })
      return
    }

    const term = searchTerm.toLowerCase()

    // Search playlists
    const matchedPlaylists = playlists.filter(
      (playlist) =>
        playlist.name.toLowerCase().includes(term) ||
        playlist.description.toLowerCase().includes(term) ||
        playlist.emotion.toLowerCase().includes(term),
    )

    // Search songs
    const matchedSongs: { song: Song; playlist: Playlist }[] = []
    playlists.forEach((playlist) => {
      playlist.songs.forEach((song) => {
        if (song.title.toLowerCase().includes(term) || song.artist.toLowerCase().includes(term)) {
          matchedSongs.push({ song, playlist })
        }
      })
    })

    setSearchResults({
      playlists: matchedPlaylists,
      songs: matchedSongs,
    })
  }, [searchTerm])

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
        <Input
          type="text"
          placeholder="Search for songs, artists, or playlists"
          className="pl-10 bg-zinc-800 border-zinc-700 text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {!searchTerm.trim() ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {["Pop", "Rock", "Hip Hop", "Electronic", "Jazz", "Classical", "R&B", "Country", "Metal", "Indie"].map(
            (genre) => (
              <div
                key={genre}
                className="aspect-square rounded-lg bg-gradient-to-br from-purple-700 to-blue-500 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setSearchTerm(genre)}
              >
                <span className="text-xl font-bold">{genre}</span>
              </div>
            ),
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {searchResults.playlists.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Playlists</h2>
              <PlaylistGrid playlists={searchResults.playlists} onPlaySong={onPlaySong} />
            </section>
          )}

          {searchResults.songs.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Songs</h2>
              <div className="bg-zinc-800/50 rounded-lg overflow-hidden">
                {searchResults.songs.map(({ song, playlist }, index) => (
                  <div
                    key={`${song.id}-${index}`}
                    className="flex items-center p-3 hover:bg-zinc-700/50 transition cursor-pointer"
                    onClick={() => onPlaySong(song)}
                  >
                    <div className="w-12 h-12 bg-zinc-700 rounded mr-3 overflow-hidden">
                      <img
                        src={song.coverUrl || playlist.coverUrl || "/placeholder.svg?height=48&width=48"}
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{song.title}</p>
                      <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
                    </div>
                    <div className="text-zinc-400 text-sm">{song.duration}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {searchResults.playlists.length === 0 && searchResults.songs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-zinc-400">No results found for "{searchTerm}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
