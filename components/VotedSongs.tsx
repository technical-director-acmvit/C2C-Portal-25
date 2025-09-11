'use client';

import { Heart, Users } from 'lucide-react';

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

type VotedSongsProps = {
  songs: Song[];
  onVote: (song: Song) => void;
  currentUser: any;
};

export function VotedSongs({ songs, onVote, currentUser }: VotedSongsProps) {
  const sortedSongs = songs.sort((a, b) => b.totalVotes - a.totalVotes);

  const hasUserVoted = (song: Song) => {
    return song.votes?.[currentUser?.uid] ? true : false;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getVoterNames = (song: Song) => {
    const voters = Object.values(song.votes || {});
    if (voters.length <= 3) {
      return voters.map(v => v.userDisplayName).join(', ');
    }
    return `${voters.slice(0, 2).map(v => v.userDisplayName).join(', ')} +${voters.length - 2} others`;
  };

  return (
    <div className="bg-gray-800/80 rounded-xl p-6 mt-6 border border-gray-700/60 shadow-sm">
      <h2 className="text-lg font-semibold text-white tracking-tight mb-4 flex items-center">
        <Users size={18} className="mr-2 text-blue-400" />
        Voted Songs ({songs.length})
      </h2>
      
      {songs.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          <Heart size={32} className="mx-auto mb-3 opacity-50" />
          <p>No voted songs yet</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {sortedSongs.map((song, index) => (
            <div
              key={song.id}
              className="flex items-center gap-3 bg-gray-900/50 rounded-lg p-3 hover:bg-gray-900/70 transition-colors ring-1 ring-gray-700"
            >
              {/* Rank */}
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">
                {index + 1}
              </div>

              {/* Album Art */}
              <img
                src={song.imageUrl || '/placeholder-album.png'}
                alt={song.album}
                className="w-10 h-10 rounded-md object-cover"
              />
              
              {/* Song Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white/90 text-sm truncate">
                  {song.title}
                </h3>
                <p className="text-xs text-gray-400 truncate">
                  {song.artist}
                </p>
                <div className="text-[11px] text-gray-500 mt-1" title={getVoterNames(song)}>
                  {getVoterNames(song)}
                </div>
              </div>
              
              {/* Vote Button */}
              <button
                onClick={() => onVote(song)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs transition-colors ring-1 ${
                  hasUserVoted(song)
                    ? 'bg-red-500 hover:bg-red-600 text-white ring-red-500/50'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300 ring-gray-700'
                }`}
                title={hasUserVoted(song) ? 'Remove vote' : 'Vote for this song'}
              >
                <Heart 
                  size={12} 
                  className={hasUserVoted(song) ? 'fill-current' : ''} 
                />
                <span className="font-semibold">
                  {song.totalVotes}
                </span>
              </button>
            </div>
          ))}
        </div>
      )}
      
      {songs.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700/60 text-center">
          <p className="text-xs text-gray-400">
            Vote for songs to move them up in the queue
          </p>
        </div>
      )}
    </div>
  );
}