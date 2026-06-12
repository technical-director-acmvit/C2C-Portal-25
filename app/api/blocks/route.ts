import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function loadBlockData() {
    const filePath = path.join(process.cwd(), 'public', 'portal', 'blocks.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
}

export async function GET() {
  try {
    const data = loadBlockData();

    return NextResponse.json({ data:data }, { status: 200 });
  } catch (error) {
    console.error('Error in blocks API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
