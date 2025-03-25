import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { title, youtubeId } = body;

    // Validate input
    if (!title || !youtubeId) {
      return NextResponse.json(
        { error: 'Title and YouTube ID are required' },
        { status: 400 }
      );
    }

    // Check if we already have 3 videos
    const videoCount = await prisma.youtubeVideo.count();

    if (videoCount >= 3) {
      return NextResponse.json(
        { error: 'Maximum of 3 videos allowed' },
        { status: 400 }
      );
    }

    // Create new video
    const newVideo = await prisma.youtubeVideo.create({
      data: {
        title,
        id: youtubeId, // Using youtubeId as the primary key
        createdAt: new Date(),
      },
    });

    return NextResponse.json(newVideo);
  } catch (error) {
    console.error('Error adding video:', error);
    return NextResponse.json({ error: 'Failed to add video' }, { status: 500 });
  }
}
