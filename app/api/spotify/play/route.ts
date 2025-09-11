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

export async function POST(request: NextRequest) {
  try {
    const { spotifyId, deviceId } = await request.json();

    if (!spotifyId) {
      return NextResponse.json({ error: 'Spotify ID is required' }, { status: 400 });
    }

    const tokenData = await getAccessToken();
    if (!tokenData.access_token) {
      return NextResponse.json({ error: 'Failed to get access token' }, { status: 500 });
    }

    const playResponse = await fetch(
      `https://api.spotify.com/v1/me/player/play${deviceId ? `?device_id=${deviceId}` : ''}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: [`spotify:track:${spotifyId}`]
        })
      }
    );

    if (!playResponse.ok) {
      const errorText = await playResponse.text();
      return NextResponse.json({ error: 'Failed to play track', details: errorText }, { status: playResponse.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Play track error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


