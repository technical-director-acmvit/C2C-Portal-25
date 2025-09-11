import { NextRequest, NextResponse } from 'next/server';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;

async function getSpotifyToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')
    },
    body: 'grant_type=client_credentials'
  });

  return response.json();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const tokenData = await getSpotifyToken();
    if (!tokenData.access_token) {
      return NextResponse.json({ error: 'Failed to get Spotify token' }, { status: 500 });
    }

    const searchResponse = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`,
      { headers: { 'Authorization': `Bearer ${tokenData.access_token}` } }
    );

    const searchData = await searchResponse.json();
    if (!searchResponse.ok) {
      return NextResponse.json({ error: 'Spotify search failed' }, { status: searchResponse.status });
    }

    return NextResponse.json(searchData);
  } catch (error) {
    console.error('Spotify search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}