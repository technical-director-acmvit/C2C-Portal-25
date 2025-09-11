'use client';

import { Heart, User } from 'lucide-react';

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
  queuePosition?: number;
};

type QueueProps = {
  songs: Song[];
  onVote: (song: Song) => void;
  currentUser: any;
};

export function Queue({ songs, onVote, currentUser }: QueueProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const hasUserVoted = (song: Song) => {
    return song.votes?.[currentUser?.uid] ? true : false;
  };

  return (
    <div className="bg-gray-800/80 rounded-xl p-6 border border-gray-700/60 shadow-sm">
      <h2 className="text-lg font-semibold text-white tracking-tight mb-4">
        Queue ({songs.length})
      </h2>
      
      {songs.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          <div className="text-4xl mb-4">🎵</div>
          <p className="text-lg mb-2">No songs in queue</p>
          <p className="text-sm">Search and vote for songs to get started!</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {songs.map((song, index) => (
            <div
              key={song.id}
              className={`flex items-center gap-3 rounded-lg p-3 transition-colors ring-1 ${
                index === 0 
                  ? 'bg-green-900/20 ring-green-600/40' 
                  : 'bg-gray-900/50 hover:bg-gray-900/70 ring-gray-700'
              }`}
            >
              {/* Queue Position */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                index === 0 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-800 text-gray-300 ring-1 ring-gray-700'
              }`}>
                {index + 1}
              </div>

              {/* Album Art */}
              <img
                src={song.imageUrl || '/placeholder-album.png'}
                alt={song.album}
                className="w-12 h-12 rounded-md object-cover"
              />
              
              {/* Song Info */}
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium truncate ${
                  index === 0 ? 'text-green-400' : 'text-white/90'
                }`}>
                  {song.title}
                </h3>
                <p className="text-xs text-gray-400 truncate">
                  {song.artist} • {song.album}
                </p>
                <div className="flex items-center space-x-2 text-[11px] text-gray-500">
                  <span>{formatDuration(song.duration)}</span>
                  {index === 0 && (
                    <span className="text-green-400 font-semibold">• NEXT</span>
                  )}
                </div>
              </div>
              
              {/* Vote Section */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onVote(song)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-full transition-colors ring-1 ${
                    hasUserVoted(song)
                      ? 'bg-red-500 hover:bg-red-600 text-white ring-red-500/50'
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-300 ring-gray-700'
                  }`}
                  title={hasUserVoted(song) ? 'Remove vote' : 'Vote for this song'}
                >
                  <Heart 
                    size={14} 
                    className={hasUserVoted(song) ? 'fill-current' : ''} 
                  />
                  <span className="text-sm font-semibold">
                    {song.totalVotes}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Queue Stats */}
      {songs.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700/60">
          <div className="flex justify-between text-sm text-gray-400">
            <span>
              Total Duration: {formatDuration(songs.reduce((acc, song) => acc + song.duration, 0))}
            </span>
            <span>
              {songs.reduce((acc, song) => acc + song.totalVotes, 0)} total votes
            </span>
          </div>
        </div>
      )}
      
    </div>
  );
}