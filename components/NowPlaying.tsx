'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, Volume2 } from 'lucide-react';

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

type QueueData = {
  currentSong: {
    songId: string;
    startedAt: any;
    duration: number;
  } | null;
  nextSongs: {
    songId: string;
    votes: number;
    queuePosition: number;
  }[];
  isPlaying: boolean;
  lastUpdated: any;
};

type NowPlayingProps = {
  song: Song | null;
  isPlaying: boolean;
  queue: QueueData | null;
};

export function NowPlaying({ song, isPlaying, queue }: NowPlayingProps) {
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isControlling, setIsControlling] = useState(false);

  useEffect(() => {
    if (!song || !isPlaying || !queue?.currentSong?.startedAt) return;

    const interval = setInterval(() => {
      const startTime = queue.currentSong?.startedAt?.toDate?.() || new Date();
      const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
      const progressPercent = Math.min((elapsed / song.duration) * 100, 100);
      
      setCurrentTime(elapsed);
      setProgress(progressPercent);
    }, 1000);

    return () => clearInterval(interval);
  }, [song, isPlaying, queue?.currentSong?.startedAt]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = async () => {
    if (isControlling) return;
    
    setIsControlling(true);
    try {
      const response = await fetch('/api/spotify/player', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: isPlaying ? 'pause' : 'resume' 
        })
      });
      
      if (!response.ok) {
        console.error('Failed to control playback');
      }
    } catch (error) {
      console.error('Error controlling playback:', error);
    } finally {
      setIsControlling(false);
    }
  };

  const handleSkip = async () => {
    if (isControlling) return;
    
    setIsControlling(true);
    try {
      const response = await fetch('/api/spotify/skip', {
        method: 'POST'
      });
      
      if (!response.ok) {
        console.error('Failed to skip track');
      }
    } catch (error) {
      console.error('Error skipping track:', error);
    } finally {
      setIsControlling(false);
    }
  };

  if (!song) {
    return (
      <div className="bg-gray-800/80 rounded-xl p-6 border border-gray-700/60 shadow-sm">
        <h2 className="text-lg font-semibold text-white tracking-tight mb-5">Now Playing</h2>
        
        <div className="text-center py-12">
          <div className="w-44 h-44 mx-auto bg-gray-900/60 rounded-lg flex items-center justify-center mb-5 ring-1 ring-gray-700">
            <Volume2 size={44} className="text-gray-500" />
          </div>
          
          <h3 className="text-base font-medium text-gray-400 mb-1">
            No song playing
          </h3>
          <p className="text-sm text-gray-500">
            Add songs to the queue to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/80 rounded-xl p-6 border border-gray-700/60 shadow-sm">
      <h2 className="text-lg font-semibold text-white tracking-tight mb-5">
        Now Playing
      </h2>
      
      <div className="text-center">
        {/* Album Art */}
        <div className="relative mb-5">
          <img
            src={song.imageUrl || '/placeholder-album.png'}
            alt={song.album}
            className={`w-48 h-48 mx-auto rounded-lg object-cover ring-1 ring-gray-700 ${
              isPlaying ? 'animate-pulse' : ''
            }`}
          />
          {isPlaying && (
            <div className="absolute inset-0 bg-green-500/20 rounded-lg animate-pulse" />
          )}
        </div>
        
        {/* Song Info */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-2 truncate">
            {song.title}
          </h3>
          <p className="text-lg text-gray-400 truncate mb-1">
            {song.artist}
          </p>
          <p className="text-sm text-gray-500 truncate">
            {song.album}
          </p>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-5">
          <div className="w-full bg-gray-900/60 ring-1 ring-gray-700 rounded-full h-2 mb-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(song.duration)}</span>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-center space-x-3 mb-6">
          <button
            onClick={handlePlayPause}
            disabled={isControlling}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ring-1 ${
              isControlling
                ? 'bg-gray-800 text-gray-400 ring-gray-700'
                : 'bg-green-500 hover:bg-green-600 text-white ring-green-500/50'
            }`}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          
          <button
            onClick={handleSkip}
            disabled={isControlling}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ring-1 ${
              isControlling
                ? 'bg-gray-800 text-gray-400 ring-gray-700'
                : 'bg-gray-800 hover:bg-gray-700 text-white ring-gray-700'
            }`}
            title="Skip to next"
          >
            <SkipForward size={18} />
          </button>
        </div>
        
        {/* Song Stats */}
        <div className="bg-gray-900/50 rounded-lg p-4 ring-1 ring-gray-700">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {song.totalVotes}
              </div>
              <div className="text-gray-400">Votes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {queue?.nextSongs.length || 0}
              </div>
              <div className="text-gray-400">In Queue</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}