/**
 * Playlist/Soundscape Library
 * Manages pre-made playlists and user favorites
 */

export interface AudioLayer {
  frequency: number;
  volume: number;
  waveType: 'sine' | 'square' | 'sawtooth' | 'triangle';
  label: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  category: 'lofi' | 'nature' | 'ambient' | 'binaural' | 'custom';
  layers: AudioLayer[];
  icon: string;
  color: string;
  isFavorite: boolean;
  createdAt: number;
}

// Pre-made playlists
const PRE_MADE_PLAYLISTS: Playlist[] = [
  {
    id: 'lofi-beats',
    name: 'Lo-fi Beats',
    description: 'Chill lo-fi hip-hop vibes for relaxed focus',
    category: 'lofi',
    layers: [
      { frequency: 200, volume: 0.4, waveType: 'sine', label: 'Base' },
      { frequency: 40, volume: 0.3, waveType: 'sine', label: 'Binaural Beat' },
    ],
    icon: '🎵',
    color: 'from-purple-500 to-pink-500',
    isFavorite: false,
    createdAt: Date.now(),
  },
  {
    id: 'nature-sounds',
    name: 'Nature Sounds',
    description: 'Forest ambience with gentle rain',
    category: 'nature',
    layers: [
      { frequency: 150, volume: 0.35, waveType: 'sine', label: 'Forest' },
      { frequency: 10, volume: 0.2, waveType: 'sine', label: 'Alpha Waves' },
    ],
    icon: '🌲',
    color: 'from-green-500 to-emerald-500',
    isFavorite: false,
    createdAt: Date.now(),
  },
  {
    id: 'ambient-space',
    name: 'Ambient Space',
    description: 'Deep space ambient for deep work',
    category: 'ambient',
    layers: [
      { frequency: 180, volume: 0.45, waveType: 'sine', label: 'Pad' },
      { frequency: 25, volume: 0.25, waveType: 'sine', label: 'Beta Waves' },
    ],
    icon: '🌌',
    color: 'from-blue-500 to-indigo-500',
    isFavorite: false,
    createdAt: Date.now(),
  },
  {
    id: 'gamma-focus',
    name: 'Gamma Focus',
    description: 'Peak focus with 40Hz gamma waves',
    category: 'binaural',
    layers: [
      { frequency: 200, volume: 0.6, waveType: 'sine', label: 'Base' },
      { frequency: 40, volume: 0.4, waveType: 'sine', label: 'Gamma Waves' },
    ],
    icon: '⚡',
    color: 'from-yellow-500 to-orange-500',
    isFavorite: false,
    createdAt: Date.now(),
  },
  {
    id: 'alpha-calm',
    name: 'Alpha Calm',
    description: 'Relaxed focus with 10Hz alpha waves',
    category: 'binaural',
    layers: [
      { frequency: 200, volume: 0.5, waveType: 'sine', label: 'Base' },
      { frequency: 10, volume: 0.3, waveType: 'sine', label: 'Alpha Waves' },
    ],
    icon: '🧘',
    color: 'from-teal-500 to-cyan-500',
    isFavorite: false,
    createdAt: Date.now(),
  },
  {
    id: 'coffee-shop',
    name: 'Coffee Shop',
    description: 'Ambient coffee shop chatter',
    category: 'ambient',
    layers: [
      { frequency: 160, volume: 0.4, waveType: 'sine', label: 'Ambience' },
      { frequency: 20, volume: 0.2, waveType: 'sine', label: 'Beta Waves' },
    ],
    icon: '☕',
    color: 'from-amber-600 to-orange-600',
    isFavorite: false,
    createdAt: Date.now(),
  },
];

export class PlaylistLibraryManager {
  private playlists: Map<string, Playlist> = new Map();
  private favorites: Set<string> = new Set();
  private storageKey = 'focusync_playlists';
  private favoritesKey = 'focusync_favorites';

  constructor() {
    this.loadFromStorage();
    this.initializeDefaults();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const playlists = JSON.parse(stored);
        playlists.forEach((p: Playlist) => this.playlists.set(p.id, p));
      }

      const favStored = localStorage.getItem(this.favoritesKey);
      if (favStored) {
        this.favorites = new Set(JSON.parse(favStored));
      }
    } catch (error) {
      console.error('Failed to load playlists:', error);
    }
  }

  private initializeDefaults() {
    // Add pre-made playlists if not already present
    PRE_MADE_PLAYLISTS.forEach((p) => {
      if (!this.playlists.has(p.id)) {
        this.playlists.set(p.id, p);
      }
    });
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(Array.from(this.playlists.values())));
      localStorage.setItem(this.favoritesKey, JSON.stringify(Array.from(this.favorites)));
    } catch (error) {
      console.error('Failed to save playlists:', error);
    }
  }

  getAllPlaylists(): Playlist[] {
    return Array.from(this.playlists.values());
  }

  getPlaylistById(id: string): Playlist | undefined {
    return this.playlists.get(id);
  }

  getFavorites(): Playlist[] {
    return Array.from(this.playlists.values()).filter((p) => this.favorites.has(p.id));
  }

  toggleFavorite(id: string): boolean {
    if (this.favorites.has(id)) {
      this.favorites.delete(id);
    } else {
      this.favorites.add(id);
    }
    this.saveToStorage();
    return this.favorites.has(id);
  }

  isFavorite(id: string): boolean {
    return this.favorites.has(id);
  }

  createCustomPlaylist(name: string, description: string, layers: AudioLayer[]): Playlist {
    const id = `custom-${Date.now()}`;
    const playlist: Playlist = {
      id,
      name,
      description,
      category: 'custom',
      layers,
      icon: '🎧',
      color: 'from-slate-500 to-slate-600',
      isFavorite: false,
      createdAt: Date.now(),
    };
    this.playlists.set(id, playlist);
    this.saveToStorage();
    return playlist;
  }

  deletePlaylist(id: string): boolean {
    if (this.playlists.get(id)?.category === 'custom') {
      this.playlists.delete(id);
      this.favorites.delete(id);
      this.saveToStorage();
      return true;
    }
    return false;
  }
}

export const playlistLibrary = new PlaylistLibraryManager();

