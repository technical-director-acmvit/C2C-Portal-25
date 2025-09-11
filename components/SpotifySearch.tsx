'use client';

import { useState } from 'react';
import { Search, Plus, Check } from 'lucide-react';
import { db } from '@/lib/firebase';
import { useSession } from 'next-auth/react';
import { collection, addDoc, serverTimestamp, doc, updateDoc, getDocs, query, where, orderBy, setDoc } from 'firebase/firestore';

type SpotifyTrack = {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  duration_ms: number;
  preview_url: string;
};

type Song = {
  id: string;
  spotifyId: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  imageUrl: string;
  previewUrl: string;
  addedAt: any;
  addedBy: string;
  totalVotes: number;
  currentlyPlaying: boolean;
  playedAt: any;
  votes: { [userId: string]: { votedAt: any; userDisplayName: string } };
};

type SpotifySearchProps = {
  onVote: (song: Song) => void;
  songs: Song[];
};

export function SpotifySearch({ onVote, songs }: SpotifySearchProps) {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(false);

  const searchSpotify = async () => {
    if (!searchQuery.trim() || loading) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      setResults(data.tracks?.items || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const addSong = async (track: SpotifyTrack) => {
    const currentUser = session
      ? {
          uid: (session.user as any)?.id || session.user?.email || 'anonymous',
          displayName: session.user?.name || '',
          email: session.user?.email || '',
        }
      : null;
    if (!currentUser) return;

    try {
      // Check if song already exists
      const existingSong = songs.find(s => s.spotifyId === track.id);
      
      if (existingSong) {
        // Vote for existing song
        onVote(existingSong);
        return;
      }

      // Create new song document
      const songData = {
        spotifyId: track.id,
        title: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        album: track.album.name,
        duration: Math.floor(track.duration_ms / 1000),
        imageUrl: track.album.images[0]?.url || '',
        previewUrl: track.preview_url || '',
        addedAt: serverTimestamp(),
        addedBy: currentUser.uid,
        totalVotes: 1,
        currentlyPlaying: false,
        playedAt: null,
        votes: {
          [currentUser.uid]: {
            votedAt: serverTimestamp(),
            userDisplayName: currentUser.displayName || currentUser.email || 'Anonymous'
          }
        }
      };

      // Add song to Firestore
      const docRef = await addDoc(collection(db, 'songs'), songData);

      // Add event for real-time updates
      await addDoc(collection(db, 'events'), {
        type: 'song_added',
        songId: docRef.id,
        userId: currentUser.uid,
        timestamp: serverTimestamp(),
        data: {
          title: track.name,
          artist: track.artists.map(a => a.name).join(', ')
        }
      });

      // Reorder queue based on votes (create queue doc if missing)
      try {
        const songsQuery = query(
          collection(db, 'songs'),
          where('totalVotes', '>', 0),
          where('currentlyPlaying', '==', false),
          orderBy('totalVotes', 'desc')
        );
        const snapshot = await getDocs(songsQuery);
        const ordered = snapshot.docs.map((d, index) => ({
          songId: d.id,
          votes: (d.data() as any).totalVotes || 0,
          queuePosition: index + 1,
        }));

        const queueRef = doc(db, 'queue', 'current');
        await setDoc(
          queueRef,
          {
            nextSongs: ordered,
            lastUpdated: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (err) {
        console.error('Failed to reorder queue after add:', err);
      }

      // Trigger server to advance/start playback if idle
      try {
        await fetch('/api/spotify/skip', { method: 'POST' });
      } catch (err) {
        console.error('Failed to trigger playback advance:', err);
      }

      console.log('Song added successfully');
    } catch (error) {
      console.error('Error adding song:', error);
    }
  };

  const isAlreadyAdded = (trackId: string) => {
    return songs.some(song => song.spotifyId === trackId);
  };

  const hasUserVoted = (trackId: string) => {
    const song = songs.find(s => s.spotifyId === trackId);
    const currentUserId = (session?.user as any)?.id || session?.user?.email || '';
    return song?.votes?.[currentUserId] ? true : false;
  };

  return (
    <div className="bg-gray-800/80 rounded-xl p-6 mb-6 border border-gray-700/60 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white tracking-tight">Search & Add Songs</h2>
      </div>

      {/* Search Input */}
      <div className="relative mb-5">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && searchSpotify()}
          placeholder="Search for songs..."
          className="w-full bg-gray-900/60 text-white rounded-lg pl-10 pr-28 py-3 focus:outline-none ring-1 ring-gray-700 focus:ring-2 focus:ring-green-500 placeholder:text-gray-500"
        />
        <Search 
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
          size={18} 
        />
        <button
          onClick={searchSpotify}
          disabled={loading || !searchQuery.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-500 hover:bg-green-600 disabled:bg-gray-700/70 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </div>

      {/* Search Results */}
      <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {results.map((track) => {
          const alreadyAdded = isAlreadyAdded(track.id);
          const userVoted = hasUserVoted(track.id);
          
          return (
            <div
              key={track.id}
              className="flex items-center gap-3 bg-gray-900/50 rounded-lg p-3 hover:bg-gray-900/70 transition-colors ring-1 ring-gray-700"
            >
              <img
                src={track.album.images[0]?.url || '/placeholder-album.png'}
                alt={track.album.name}
                className="w-12 h-12 rounded-md object-cover"
              />
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white/90 truncate">
                  {track.name}
                </h3>
                <p className="text-xs text-gray-400 truncate">
                  {track.artists.map(a => a.name).join(', ')} • {track.album.name}
                </p>
                <div className="mt-0.5 text-[11px] text-gray-500">
                  {Math.floor(track.duration_ms / 60000)}:{String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
                </div>
              </div>
              
              <button
                onClick={() => addSong(track)}
                className={`p-2 rounded-full transition-colors ring-1 ${
                  alreadyAdded
                    ? userVoted
                      ? 'bg-green-500 text-white ring-green-500/50'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 ring-gray-700'
                    : 'bg-green-500 hover:bg-green-600 text-white ring-green-500/50'
                }`}
                title={
                  alreadyAdded
                    ? userVoted
                      ? 'You voted for this song'
                      : 'Vote for this song'
                    : 'Add to queue'
                }
              >
                {alreadyAdded ? (
                  userVoted ? <Check size={16} /> : <Plus size={16} />
                ) : (
                  <Plus size={16} />
                )}
              </button>
            </div>
          );
        })}
        
        {results.length === 0 && searchQuery && !loading && (
          <div className="text-center text-gray-400 py-10 text-sm">
            No results found. Try a different search term.
          </div>
        )}
        
        {results.length === 0 && !searchQuery && (
          <div className="text-center text-gray-400 py-10 text-sm">
            Search for songs to add to the queue
          </div>
        )}
      </div>
    </div>
  );
}