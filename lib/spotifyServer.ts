import { NextResponse } from 'next/server';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID as string;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET as string;
const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN as string;

async function getAccessToken(): Promise<string> {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')
    },
    body: `grant_type=refresh_token&refresh_token=${SPOTIFY_REFRESH_TOKEN}`
  });

  const data = await response.json() as { access_token?: string };
  if (!data.access_token) {
    throw new Error('Failed to acquire Spotify access token');
  }
  return data.access_token;
}

export async function playTrackServer(spotifyId: string, deviceId?: string): Promise<void> {
  if (!spotifyId) throw new Error('spotifyId is required');

  const accessToken = await getAccessToken();

  const playResponse = await fetch(
    `https://api.spotify.com/v1/me/player/play${deviceId ? `?device_id=${deviceId}` : ''}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uris: [`spotify:track:${spotifyId}`]
      })
    }
  );

  if (!playResponse.ok) {
    const errorText = await playResponse.text();
    throw new Error(`Spotify play failed: ${errorText}`);
  }
}


