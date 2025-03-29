import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST - Create a new news article
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { title, content, image, published } = body;

    // Validate input
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Create new news article
    const newsArticle = await prisma.newsArticle.create({
      data: {
        title,
        content,
        image: image || null,
        published: published || false,
      },
    });

    return NextResponse.json(newsArticle);
  } catch (error) {
    console.error('Error creating news article:', error);
    return NextResponse.json(
      { error: 'Failed to create news article' },
      { status: 500 }
    );
  }
}
