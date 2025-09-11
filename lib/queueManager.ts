import { db } from '@/lib/firebase';
import { playTrackServer } from '@/lib/spotifyServer';
import { 
  doc, 
  updateDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  addDoc,
  serverTimestamp,
  onSnapshot,
  setDoc
} from 'firebase/firestore';

export class QueueManager {
  private static instance: QueueManager;
  private isProcessing = false;
  private unsubscribeSongsListener: (() => void) | null = null;
  private unsubscribeQueueListener: (() => void) | null = null;

  static getInstance() {
    if (!QueueManager.instance) {
      QueueManager.instance = new QueueManager();
    }
    return QueueManager.instance;
  }

  initRealtime() {
    // Avoid double listeners
    if (!this.unsubscribeSongsListener) {
      const songsRef = collection(db, 'songs');
      this.unsubscribeSongsListener = onSnapshot(songsRef, async () => {
        // Recompute queue order whenever songs or votes change
        await this.reorderQueue();
      });
    }

    if (!this.unsubscribeQueueListener) {
      const queueRef = doc(db, 'queue', 'current');
      this.unsubscribeQueueListener = onSnapshot(queueRef, async (snapshot) => {
        if (!snapshot.exists()) {
          await setDoc(queueRef, {
            currentSong: null,
            nextSongs: [],
            isPlaying: false,
            lastUpdated: serverTimestamp()
          }, { merge: true });
          return;
        }

        const data = snapshot.data() as any;
        // If nothing is playing but there are queued songs, start playback
        if (!data.currentlyPlaying && !data.currentSong && Array.isArray(data.nextSongs) && data.nextSongs.length > 0) {
          await this.advanceQueue();
        }
      });
    }
  }

  disposeRealtime() {
    if (this.unsubscribeSongsListener) {
      this.unsubscribeSongsListener();
      this.unsubscribeSongsListener = null;
    }
    if (this.unsubscribeQueueListener) {
      this.unsubscribeQueueListener();
      this.unsubscribeQueueListener = null;
    }
  }

  async advanceQueue() {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    
    try {
      // Get current queue state
      const queueRef = doc(db, 'queue', 'current');
      const queueDoc = await getDoc(queueRef);
      
      if (!queueDoc.exists()) {
        console.log('Queue document does not exist');
        return;
      }

      const queueData = queueDoc.data();
      const nextSongs = queueData.nextSongs || [];

      if (nextSongs.length === 0) {
        console.log('No songs in queue');
        // Stop playback
        await this.updateQueueState(null, false);
        return;
      }

      // Get the highest-voted song (first in queue)
      const nextSongData = nextSongs[0];
      const nextSongRef = doc(db, 'songs', nextSongData.songId);
      const nextSongDoc = await getDoc(nextSongRef);

      if (!nextSongDoc.exists()) {
        console.error('Next song not found');
        return;
      }

      const nextSong = nextSongDoc.data();

      // Update current song to not playing
      if (queueData.currentSong) {
        const currentSongRef = doc(db, 'songs', queueData.currentSong.songId);
        await updateDoc(currentSongRef, {
          currentlyPlaying: false,
          playedAt: serverTimestamp()
        });
      }

      // Play the new song via Spotify (server-side)
      try {
        await playTrackServer(nextSong.spotifyId);
      } catch (e) {
        console.error('Spotify play request failed', e);
        return;
      }

      // Update new song as currently playing
      await updateDoc(nextSongRef, {
        currentlyPlaying: true,
        playedAt: null
      });

      // Update queue with new current song
      const newCurrentSong = {
        songId: nextSongData.songId,
        startedAt: serverTimestamp(),
        duration: nextSong.duration
      };

      // Remove the now-playing song from nextSongs and reorder positions
      const updatedNextSongs = nextSongs
        .slice(1)
        .map((song: { songId: string; votes: number; queuePosition: number }, index: number) => ({
          ...song,
          queuePosition: index + 1
        }));

      await updateDoc(queueRef, {
        currentSong: newCurrentSong,
        nextSongs: updatedNextSongs,
        isPlaying: true,
        lastUpdated: serverTimestamp()
      });

      // Add event
      await addDoc(collection(db, 'events'), {
        type: 'song_playing',
        songId: nextSongData.songId,
        userId: 'system',
        timestamp: serverTimestamp(),
        data: {
          title: nextSong.title,
          artist: nextSong.artist
        }
      });

      console.log(`Now playing: ${nextSong.title} by ${nextSong.artist}`);

      // Schedule next advance
      this.scheduleNextAdvance(nextSong.duration);

    } catch (error) {
      console.error('Error advancing queue:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  private scheduleNextAdvance(duration: number) {
    // Schedule advance 5 seconds before song ends
    const advanceTime = Math.max((duration - 5) * 1000, 5000);
    
    setTimeout(() => {
      this.advanceQueue();
    }, advanceTime);
  }

  private async updateQueueState(currentSong: any, isPlaying: boolean) {
    const queueRef = doc(db, 'queue', 'current');
    await updateDoc(queueRef, {
      currentSong,
      isPlaying,
      lastUpdated: serverTimestamp()
    });
  }

  async startQueue() {
    try {
      const queueRef = doc(db, 'queue', 'current');
      const queueDoc = await getDoc(queueRef);
      
      if (!queueDoc.exists()) {
        console.log('No queue to start');
        return;
      }

      const queueData = queueDoc.data();
      
      // If there's no current song but there are songs in queue, start playing
      if (!queueData.currentSong && queueData.nextSongs?.length > 0) {
        await this.advanceQueue();
      }
    } catch (error) {
      console.error('Error starting queue:', error);
    }
  }

  async reorderQueue() {
    try {
      // Get all songs with votes, ordered by votes descending
      const songsQuery = query(
        collection(db, 'songs'),
        where('totalVotes', '>', 0),
        where('currentlyPlaying', '==', false),
        orderBy('totalVotes', 'desc')
      );

      const songsSnapshot = await getDocs(songsQuery);
      const songs = songsSnapshot.docs.map(d => ({
        id: d.id,
        ...(d.data() as { totalVotes: number })
      }));

      // Create new queue order
      const newNextSongs = songs.map((song, index) => ({
        songId: song.id,
        votes: song.totalVotes,
        queuePosition: index + 1
      }));

      // Ensure queue doc exists and update
      const queueRef = doc(db, 'queue', 'current');
      await setDoc(
        queueRef,
        {
        nextSongs: newNextSongs,
        lastUpdated: serverTimestamp()
        },
        { merge: true }
      );

      console.log('Queue reordered successfully');
    } catch (error) {
      console.error('Error reordering queue:', error);
    }
  }
}

// lib/spotifyController.ts
export class SpotifyController {
  private static instance: SpotifyController;

  static getInstance() {
    if (!SpotifyController.instance) {
      SpotifyController.instance = new SpotifyController();
    }
    return SpotifyController.instance;
  }

  async getCurrentPlayback() {
    try {
      const response = await fetch('/api/spotify/player');
      if (!response.ok) return null;
      
      return await response.json();
    } catch (error) {
      console.error('Error getting playback state:', error);
      return null;
    }
  }

  async playTrack(spotifyId: string) {
    try {
      const response = await fetch('/api/spotify/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spotifyId })
      });

      return response.ok;
    } catch (error) {
      console.error('Error playing track:', error);
      return false;
    }
  }

  async pausePlayback() {
    try {
      const response = await fetch('/api/spotify/player', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'pause' })
      });

      return response.ok;
    } catch (error) {
      console.error('Error pausing playback:', error);
      return false;
    }
  }

  async resumePlayback() {
    try {
      const response = await fetch('/api/spotify/player', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resume' })
      });

      return response.ok;
    } catch (error) {
      console.error('Error resuming playback:', error);
      return false;
    }
  }
}