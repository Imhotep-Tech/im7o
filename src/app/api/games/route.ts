import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const gamesDir = path.join(process.cwd(), 'src/data/games');
    const files = fs.readdirSync(gamesDir);
    
    const games = files.filter(f => f.endsWith('.json')).map(file => {
      const filePath = path.join(gamesDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      return {
        id: data.id,
        title: data.title,
        engineTemplate: data.engineTemplate
      };
    });
    
    return NextResponse.json(games);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load games' }, { status: 500 });
  }
}
