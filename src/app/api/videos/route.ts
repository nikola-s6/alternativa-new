import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export type Video = {
  id: string;
  title: string;
  youtubeId: string;
  createdAt: Date;
};

export async function GET() {
  const videos = await prisma.youtubeVideo.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: 3,
  });

  return NextResponse.json(videos);
}
