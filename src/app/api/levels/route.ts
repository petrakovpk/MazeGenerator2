import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
    try {
        const levelsDir = path.join(process.cwd(), 'public/levels');
        const levelFiles = await fs.readdir(levelsDir);
        const levelNames = levelFiles
            .filter(file => file.endsWith('.json'))
            .map(file => file.replace('.json', ''));
        
        const levels: { [key: string]: any } = {};
        for (const name of levelNames) {
            const filePath = path.join(levelsDir, `${name}.json`);
            const fileContent = await fs.readFile(filePath, 'utf-8');
            levels[name] = JSON.parse(fileContent);
        }

        return NextResponse.json(levels);
    } catch (e: unknown) {
        const error = e as { code?: string };
        console.error('Failed to read levels:', error);
        // Если папки нет, возвращаем пустой объект
        if (error.code === 'ENOENT') {
            return NextResponse.json({});
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
} 