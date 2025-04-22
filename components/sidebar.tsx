"use client"

import { useState } from "react"
import { Home, Search, Library, Heart, PlusCircle, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  onRecommendClick: () => void
  currentEmotion: string | null
  onNavigate: (view: string) => void
  currentView: string
}

export function Sidebar({ onRecommendClick, currentEmotion, onNavigate, currentView }: SidebarProps) {
  const [likedSongs, setLikedSongs] = useState<string[]>([])
  const [userPlaylists, setUserPlaylists] = useState<string[]>(["My Workout Mix", "Coding Focus"])

  const handleCreatePlaylist = () => {
    const playlistName = prompt("Enter a name for your new playlist:")
    if (playlistName && playlistName.trim() !== "") {
      setUserPlaylists([...userPlaylists, playlistName.trim()])
    }
  }

  return (
    <div className="w-64 bg-zinc-900 p-6 flex flex-col h-full overflow-hidden shrink-0 max-w-full md:w-64 md:min-w-64 hidden md:flex">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-green-500">♪</span> MoodTunes
        </h1>
      </div>

      <nav className="space-y-6 flex-1 overflow-y-auto">
        <div className="space-y-3">
          <button
            className={cn(
              "flex items-center gap-4 text-zinc-400 hover:text-white transition w-full",
              currentView === "home" && "text-white",
            )}
            onClick={() => onNavigate("home")}
          >
            <Home size={24} />
            <span>Home</span>
          </button>
          <button
            className={cn(
              "flex items-center gap-4 text-zinc-400 hover:text-white transition w-full",
              currentView === "search" && "text-white",
            )}
            onClick={() => onNavigate("search")}
          >
            <Search size={24} />
            <span>Search</span>
          </button>
          <button
            className={cn(
              "flex items-center gap-4 text-zinc-400 hover:text-white transition w-full",
              currentView === "library" && "text-white",
            )}
            onClick={() => onNavigate("library")}
          >
            <Library size={24} />
            <span>Your Library</span>
          </button>
        </div>

        <div className="space-y-3">
          <button
            className="flex items-center gap-4 text-zinc-400 hover:text-white transition w-full"
            onClick={handleCreatePlaylist}
          >
            <PlusCircle size={24} />
            <span>Create Playlist</span>
          </button>
          <button
            className={cn(
              "flex items-center gap-4 text-zinc-400 hover:text-white transition w-full",
              currentView === "liked" && "text-white",
            )}
            onClick={() => onNavigate("liked")}
          >
            <Heart size={24} />
            <span>Liked Songs</span>
          </button>
        </div>

        {userPlaylists.length > 0 && (
          <div className="border-t border-zinc-800 pt-4 mt-4">
            <h3 className="text-sm font-semibold text-zinc-400 mb-2">YOUR PLAYLISTS</h3>
            <div className="space-y-2">
              {userPlaylists.map((playlist, index) => (
                <button
                  key={index}
                  className="text-zinc-400 hover:text-white transition w-full text-left text-sm truncate"
                  onClick={() => onNavigate(`playlist-${index}`)}
                >
                  {playlist}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-zinc-800 pt-6 mt-6">
          <Button
            onClick={onRecommendClick}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
          >
            <Smile className="mr-2 h-4 w-4" />
            Recommend for Me
          </Button>

          {currentEmotion && (
            <div className="mt-4 text-sm text-center">
              <p className="text-zinc-400">Current mood:</p>
              <p className="text-green-500 font-medium">
                {currentEmotion.charAt(0).toUpperCase() + currentEmotion.slice(1)}
              </p>
            </div>
          )}
        </div>
      </nav>

      <div className="mt-auto text-xs text-zinc-400">
        <p>© 2024 MoodTunes</p>
      </div>
    </div>
  )
}
