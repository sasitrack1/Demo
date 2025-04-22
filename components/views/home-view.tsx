"use client"

import { PlaylistGrid } from "@/components/playlist-grid"
import { playlists, type Song } from "@/lib/data"

interface HomeViewProps {
  onPlaySong: (song: Song) => void
}

export function HomeView({ onPlaySong }: HomeViewProps) {
  // Featured playlists for the home view
  const featuredPlaylists = playlists.slice(0, 6)

  // Recently played playlists (mocked)
  const recentlyPlayed = [playlists[2], playlists[4], playlists[1]]

  // Made for you playlists (mocked)
  const madeForYou = [playlists[3], playlists[0], playlists[5]]

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Featured Playlists</h2>
        <PlaylistGrid playlists={featuredPlaylists} onPlaySong={onPlaySong} />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Recently Played</h2>
        <PlaylistGrid playlists={recentlyPlayed} onPlaySong={onPlaySong} />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Made For You</h2>
        <PlaylistGrid playlists={madeForYou} onPlaySong={onPlaySong} />
      </section>
    </div>
  )
}
