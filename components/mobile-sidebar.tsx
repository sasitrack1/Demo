"use client"

import { useState } from "react"
import { Home, Search, Library, Heart, PlusCircle, Smile, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MobileSidebarProps {
  onRecommendClick: () => void
  currentEmotion: string | null
  onNavigate: (view: string) => void
  currentView: string
}

export function MobileSidebar({ onRecommendClick, currentEmotion, onNavigate, currentView }: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [userPlaylists, setUserPlaylists] = useState<string[]>(["My Workout Mix", "Coding Focus"])

  const handleCreatePlaylist = () => {
    const playlistName = prompt("Enter a name for your new playlist:")
    if (playlistName && playlistName.trim() !== "") {
      setUserPlaylists([...userPlaylists, playlistName.trim()])
    }
  }

  const handleNavigate = (view: string) => {
    onNavigate(view)
    setIsOpen(false)
  }

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-30 bg-zinc-800 p-2 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile sidebar overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/80 z-40 md:hidden" onClick={() => setIsOpen(false)} />}

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-zinc-900 p-6 flex flex-col z-50 transform transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="mb-8 mt-8">
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
              onClick={() => handleNavigate("home")}
            >
              <Home size={24} />
              <span>Home</span>
            </button>
            <button
              className={cn(
                "flex items-center gap-4 text-zinc-400 hover:text-white transition w-full",
                currentView === "search" && "text-white",
              )}
              onClick={() => handleNavigate("search")}
            >
              <Search size={24} />
              <span>Search</span>
            </button>
            <button
              className={cn(
                "flex items-center gap-4 text-zinc-400 hover:text-white transition w-full",
                currentView === "library" && "text-white",
              )}
              onClick={() => handleNavigate("library")}
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
              onClick={() => handleNavigate("liked")}
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
                    onClick={() => handleNavigate(`playlist-${index}`)}
                  >
                    {playlist}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-zinc-800 pt-6 mt-6">
            <Button
              onClick={() => {
                setIsOpen(false)
                onRecommendClick()
              }}
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
    </>
  )
}
