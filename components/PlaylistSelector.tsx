'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, Music } from 'lucide-react';
import { playlistLibrary, type Playlist } from '@/lib/playlistLibrary';

interface PlaylistSelectorProps {
  onPlaylistSelect: (playlist: Playlist) => void;
  currentPlaylistId?: string;
}

export function PlaylistSelector({ onPlaylistSelect, currentPlaylistId }: PlaylistSelectorProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [favorites, setFavorites] = useState<Playlist[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const allPlaylists = playlistLibrary.getAllPlaylists();
    setPlaylists(allPlaylists);
    setFavorites(playlistLibrary.getFavorites());
  }, []);

  const handleToggleFavorite = (id: string) => {
    playlistLibrary.toggleFavorite(id);
    setFavorites(playlistLibrary.getFavorites());
    setPlaylists(playlistLibrary.getAllPlaylists());
  };

  const handlePlaylistSelect = (playlist: Playlist) => {
    onPlaylistSelect(playlist);
  };

  const displayPlaylists = showFavoritesOnly ? favorites : playlists;
  const filteredPlaylists =
    selectedCategory === 'all'
      ? displayPlaylists
      : displayPlaylists.filter((p) => p.category === selectedCategory);

  const categories = ['all', 'lofi', 'nature', 'ambient', 'binaural', 'custom'];

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
            className="capitalize whitespace-nowrap"
          >
            {cat === 'all' ? '🎵 All' : cat}
          </Button>
        ))}
      </div>

      {/* Favorites Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant={showFavoritesOnly ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className="gap-2"
        >
          <Heart className="w-4 h-4" />
          Favorites ({favorites.length})
        </Button>
      </div>

      {/* Playlists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlaylists.map((playlist) => (
          <motion.div
            key={playlist.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={`p-4 cursor-pointer transition-all border-2 ${
                currentPlaylistId === playlist.id
                  ? 'border-teal-500 bg-teal-950/30'
                  : 'border-slate-700 hover:border-teal-500/50'
              }`}
              onClick={() => handlePlaylistSelect(playlist)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{playlist.icon}</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(playlist.id);
                  }}
                  className="transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      playlistLibrary.isFavorite(playlist.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-slate-400 hover:text-red-500'
                    }`}
                  />
                </button>
              </div>

              <h3 className="font-semibold text-white mb-1">{playlist.name}</h3>
              <p className="text-sm text-slate-400 mb-3">{playlist.description}</p>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Music className="w-3 h-3" />
                <span>{playlist.layers.length} layers</span>
              </div>

              {currentPlaylistId === playlist.id && (
                <div className="mt-3 text-xs text-teal-400 font-semibold">✓ Now Playing</div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredPlaylists.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <Music className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No playlists found</p>
        </div>
      )}
    </div>
  );
}

