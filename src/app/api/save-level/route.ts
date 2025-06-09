import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, data } = body;

        if (!name || !data) {
            return NextResponse.json({ message: 'Missing name or data' }, { status: 400 });
        }

        const levelsDir = path.join(process.cwd(), 'public/levels');
        await fs.mkdir(levelsDir, { recursive: true });
        
        const filePath = path.join(levelsDir, `${name}.json`);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));

        return NextResponse.json({ message: 'Level saved successfully' });
    } catch (error) {
        console.error('Failed to save level:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
} 