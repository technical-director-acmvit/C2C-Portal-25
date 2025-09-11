// app/api/spotify/skip/route.ts
import { NextResponse } from 'next/server';
import { QueueManager } from '@/lib/queueManager';

export async function POST() {
  try {
    const queueManager = QueueManager.getInstance();
    await queueManager.advanceQueue();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Skip track error:', error);
    return NextResponse.json({ error: 'Failed to skip track' }, { status: 500 });
  }
}