"use client"

import { useState } from "react"
import { Grid, List, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PlaylistGrid } from "@/components/playlist-grid"
import { playlists, type Song } from "@/lib/data"

interface LibraryViewProps {
  onPlaySong: (song: Song) => void
}

export function LibraryView({ onPlaySong }: LibraryViewProps) {
  const [viewType, setViewType] = useState<"grid" | "list">("grid")
  const [filterType, setFilterType] = useState<"all" | "playlists" | "artists" | "albums">("all")

  // Mock data for user's library
  const userLibrary = {
    playlists: playlists.slice(0, 4),
    artists: [
      {
        id: "artist-1",
        name: "The Weeknd",
        imageUrl: "https://images.unsplash.com/photo-1618609377864-68609b857e90?w=500&h=500&fit=crop",
      },
      {
        id: "artist-2",
        name: "Billie Eilish",
        imageUrl: "https://images.unsplash.com/photo-1526218626217-dc65a29bb444?w=500&h=500&fit=crop",
      },
      {
        id: "artist-3",
        name: "Drake",
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop",
      },
    ],
    albums: [
      {
        id: "album-1",
        name: "After Hours",
        artist: "The Weeknd",
        imageUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&h=500&fit=crop",
      },
      {
        id: "album-2",
        name: "When We All Fall Asleep",
        artist: "Billie Eilish",
        imageUrl: 'https://images.unsplash.com/photo-1598387846148-47e82ee  artist: "Billie Eilish',
        imageUrl: "https://images.unsplash.com/photo-1598387846148-47e82ee5d3f2?w=500&h=500&fit=crop",
      },
      {
        id: "album-3",
        name: "Certified Lover Boy",
        artist: "Drake",
        imageUrl: "https://images.unsplash.com/photo-1619983081563-430f63602796?w=500&h=500&fit=crop",
      },
    ],
  }

  // Filter content based on selected filter
  const filteredContent = () => {
    switch (filterType) {
      case "playlists":
        return { playlists: userLibrary.playlists, artists: [], albums: [] }
      case "artists":
        return { playlists: [], artists: userLibrary.artists, albums: [] }
      case "albums":
        return { playlists: [], artists: [], albums: userLibrary.albums }
      default:
        return userLibrary
    }
  }

  const content = filteredContent()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button variant={filterType === "all" ? "default" : "outline"} size="sm" onClick={() => setFilterType("all")}>
            All
          </Button>
          <Button
            variant={filterType === "playlists" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("playlists")}
          >
            Playlists
          </Button>
          <Button
            variant={filterType === "artists" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("artists")}
          >
            Artists
          </Button>
          <Button
            variant={filterType === "albums" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("albums")}
          >
            Albums
          </Button>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewType("grid")}
            className={viewType === "grid" ? "bg-zinc-800" : ""}
          >
            <Grid size={20} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewType("list")}
            className={viewType === "list" ? "bg-zinc-800" : ""}
          >
            <List size={20} />
          </Button>
        </div>
      </div>

      {/* Playlists */}
      {content.playlists.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Playlists</h2>
          {viewType === "grid" ? (
            <PlaylistGrid playlists={content.playlists} onPlaySong={onPlaySong} />
          ) : (
            <div className="bg-zinc-800/50 rounded-lg overflow-hidden">
              {content.playlists.map((playlist, index) => (
                <div
                  key={playlist.id}
                  className="flex items-center p-3 hover:bg-zinc-700/50 transition cursor-pointer"
                  onClick={() => {}}
                >
                  <div className="w-12 h-12 bg-zinc-700 rounded mr-3 overflow-hidden">
                    <img
                      src={playlist.coverUrl || "/placeholder.svg?height=48&width=48"}
                      alt={playlist.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{playlist.name}</p>
                    <p className="text-sm text-zinc-400 truncate">Playlist • {playlist.songs.length} songs</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Artists */}
      {content.artists.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Artists</h2>
          {viewType === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {content.artists.map((artist) => (
                <div key={artist.id} className="flex flex-col items-center">
                  <div className="aspect-square w-full rounded-full overflow-hidden mb-3 bg-zinc-800">
                    <img
                      src={artist.imageUrl || "/placeholder.svg?height=200&width=200"}
                      alt={artist.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-center">{artist.name}</h3>
                  <p className="text-sm text-zinc-400">Artist</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-zinc-800/50 rounded-lg overflow-hidden">
              {content.artists.map((artist) => (
                <div key={artist.id} className="flex items-center p-3 hover:bg-zinc-700/50 transition cursor-pointer">
                  <div className="w-12 h-12 bg-zinc-700 rounded-full mr-3 overflow-hidden">
                    <img
                      src={artist.imageUrl || "/placeholder.svg?height=48&width=48"}
                      alt={artist.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{artist.name}</p>
                    <p className="text-sm text-zinc-400 truncate">Artist</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Albums */}
      {content.albums.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Albums</h2>
          {viewType === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {content.albums.map((album) => (
                <div key={album.id} className="flex flex-col">
                  <div className="aspect-square w-full rounded-lg overflow-hidden mb-3 bg-zinc-800">
                    <img
                      src={album.imageUrl || "/placeholder.svg?height=200&width=200"}
                      alt={album.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium truncate">{album.name}</h3>
                  <p className="text-sm text-zinc-400 truncate">{album.artist}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-zinc-800/50 rounded-lg overflow-hidden">
              {content.albums.map((album) => (
                <div key={album.id} className="flex items-center p-3 hover:bg-zinc-700/50 transition cursor-pointer">
                  <div className="w-12 h-12 bg-zinc-700 rounded mr-3 overflow-hidden">
                    <img
                      src={album.imageUrl || "/placeholder.svg?height=48&width=48"}
                      alt={album.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{album.name}</p>
                    <p className="text-sm text-zinc-400 truncate">{album.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {Object.values(content).every((arr) => arr.length === 0) && (
        <div className="text-center py-12">
          <Music size={48} className="mx-auto text-zinc-600 mb-4" />
          <h3 className="text-xl font-bold mb-2">Your library is empty</h3>
          <p className="text-zinc-400">Start adding songs, artists, and playlists to your library</p>
        </div>
      )}
    </div>
  )
}
