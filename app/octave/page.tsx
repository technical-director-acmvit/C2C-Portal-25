'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { useSession } from 'next-auth/react';
import { collection, onSnapshot, doc, updateDoc, addDoc, serverTimestamp, getDoc, setDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { SpotifySearch } from '@/components/SpotifySearch';
import { Queue } from '@/components/Queue';
import { NowPlaying } from '@/components/NowPlaying';
import { VotedSongs } from '@/components/VotedSongs';
import { Session } from 'next-auth';
import { QueueManager } from '@/lib/queueManager';

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

type QueueSong = Song & { queuePosition?: number };

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

export default function OctavePage() {
  const { data: session, status } = useSession();
  const user = session
    ? {
        uid: (session.user as any)?.id || session.user?.email || 'anonymous',
        displayName: session.user?.name || '',
        email: session.user?.email || '',
      }
    : null;
  const [songs, setSongs] = useState<Song[]>([]);
  const [queue, setQueue] = useState<QueueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Start realtime queue maintenance
    const qm = QueueManager.getInstance();
    qm.initRealtime();

    // Listen to songs collection
    const songsUnsubscribe = onSnapshot(
      collection(db, 'songs'),
      (snapshot) => {
        const songsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Song[];
        setSongs(songsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to songs:', error);
        setLoading(false);
      }
    );

    // Listen to queue
    const queueUnsubscribe = onSnapshot(
      doc(db, 'queue', 'current'),
      (doc) => {
        if (doc.exists()) {
          setQueue(doc.data() as QueueData);
        } else {
          // Initialize queue if it doesn't exist
          const initialQueue: QueueData = {
            currentSong: null,
            nextSongs: [],
            isPlaying: false,
            lastUpdated: serverTimestamp()
          };
          setDoc(doc.ref, initialQueue);
          setQueue(initialQueue);
        }
      },
      (error) => {
        console.error('Error listening to queue:', error);
      }
    );

    return () => {
      songsUnsubscribe();
      queueUnsubscribe();
      qm.disposeRealtime();
    };
  }, [user]);

  const handleVote = async (song: Song) => {
    if (!user) return;

    try {
      const songRef = doc(db, 'songs', song.id);
      const songDoc = await getDoc(songRef);
      
      if (songDoc.exists()) {
        const currentData = songDoc.data();
        const hasVoted = currentData.votes?.[user.uid];

        if (hasVoted) {
          // Remove vote
          const updatedVotes = { ...currentData.votes };
          delete updatedVotes[user.uid];
          
          await updateDoc(songRef, {
            votes: updatedVotes,
            totalVotes: Math.max(0, currentData.totalVotes - 1)
          });
        } else {
          // Add vote
          const updatedVotes = {
            ...currentData.votes,
            [user.uid]: {
              votedAt: serverTimestamp(),
              userDisplayName: user.displayName || user.email || 'Anonymous'
            }
          };

          await updateDoc(songRef, {
            votes: updatedVotes,
            totalVotes: (currentData.totalVotes || 0) + 1
          });
        }

        // Add event for real-time updates
        await addDoc(collection(db, 'events'), {
          type: 'vote_added',
          songId: song.id,
          userId: user.uid,
          timestamp: serverTimestamp(),
          data: { action: hasVoted ? 'removed' : 'added' }
        });

        // Update queue order
        await updateQueueOrder();
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const updateQueueOrder = async () => {
    try {
      const songsQuery = query(
        collection(db, 'songs'),
        where('totalVotes', '>', 0),
        where('currentlyPlaying', '==', false),
        orderBy('totalVotes', 'desc')
      );
      const snapshot = await getDocs(songsQuery);
      const votedSongs = snapshot.docs.map((d, index) => ({
        songId: d.id,
        votes: (d.data() as any).totalVotes || 0,
        queuePosition: index + 1
      }));

      const queueRef = doc(db, 'queue', 'current');
      await setDoc(
        queueRef,
        {
          nextSongs: votedSongs,
          lastUpdated: serverTimestamp()
        },
        { merge: true }
      );

      // Add queue update event
      await addDoc(collection(db, 'events'), {
        type: 'queue_updated',
        songId: '',
        userId: user?.uid || '',
        timestamp: serverTimestamp(),
        data: { queueLength: votedSongs.length }
      });
    } catch (error) {
      console.error('Error updating queue order:', error);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Please log in to access Octave</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const currentSong = queue?.currentSong 
    ? (songs.find(s => s.id === queue.currentSong?.songId) || null)
    : null;

  const queueSongs: QueueSong[] = (queue?.nextSongs || [])
    .map(qItem => {
      const base = songs.find(s => s.id === qItem.songId);
      if (!base) return null;
      return {
        ...base,
        queuePosition: qItem.queuePosition
      } as QueueSong;
    })
    .filter((s): s is QueueSong => s !== null)
    .sort((a, b) => (a.queuePosition || 0) - (b.queuePosition || 0));

  const votedSongs = songs.filter(song => 
    song.totalVotes > 0 && 
    !song.currentlyPlaying &&
    !queueSongs.some(q => q.id === song.id)
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-2">
            <span className="text-green-400">Octave</span>
          </h1>
          <p className="text-gray-400 text-center">
            Collaborative music voting powered by Spotify
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Search & Add Songs */}
          <div className="lg:col-span-1">
            <SpotifySearch onVote={handleVote} songs={songs} />
            {votedSongs.length > 0 && (
              <VotedSongs 
                songs={votedSongs} 
                onVote={handleVote}
                currentUser={user}
              />
            )}
          </div>

          {/* Middle Column - Now Playing */}
          <div className="lg:col-span-1">
            <NowPlaying 
              song={currentSong} 
              isPlaying={queue?.isPlaying || false}
              queue={queue}
            />
          </div>

          {/* Right Column - Queue */}
          <div className="lg:col-span-1">
            <Queue 
              songs={queueSongs}
              onVote={handleVote}
              currentUser={user}
            />
          </div>
        </div>
      </div>
    </div>
  );
}