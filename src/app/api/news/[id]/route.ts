import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch a specific news article
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params object before accessing the id
    const { id } = await params;

    // Fetch the news article
    const newsArticle = await prisma.newsArticle.findUnique({
      where: { id },
    });

    if (!newsArticle) {
      return NextResponse.json(
        { error: 'News article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(newsArticle);
  } catch (error) {
    console.error('Error fetching news article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news article' },
      { status: 500 }
    );
  }
}
