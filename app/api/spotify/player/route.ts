import { NextRequest, NextResponse } from 'next/server';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN!;

async function getAccessToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')
    },
    body: `grant_type=refresh_token&refresh_token=${SPOTIFY_REFRESH_TOKEN}`
  });

  return response.json();
}

export async function GET() {
  try {
    const tokenData = await getAccessToken();
    if (!tokenData.access_token) {
      return NextResponse.json({ error: 'Failed to get access token' }, { status: 500 });
    }

    const playerResponse = await fetch('https://api.spotify.com/v1/me/player', {
      headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
    });

    if (playerResponse.status === 204) {
      return NextResponse.json({ isPlaying: false, currentTrack: null });
    }

    const playerData = await playerResponse.json();
    return NextResponse.json(playerData);
  } catch (error) {
    console.error('Get player state error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { action } = await request.json();
    const tokenData = await getAccessToken();
    if (!tokenData.access_token) {
      return NextResponse.json({ error: 'Failed to get access token' }, { status: 500 });
    }

    const endpoint = action === 'pause' 
      ? 'https://api.spotify.com/v1/me/player/pause'
      : 'https://api.spotify.com/v1/me/player/play';

    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Failed to ${action} playback`, details: errorText }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Player control error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


