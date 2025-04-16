import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT - Update a news article
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params object before accessing the id
    const { id } = await params;

    // Parse request body
    const body = await request.json();
    const { title, content, image, published, publishDate } = body;

    // Validate input
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Update the news article
    const updatedNewsArticle = await prisma.newsArticle.update({
      where: { id },
      data: {
        title,
        content,
        image: image || null,
        published: published || false,
        publishDate: publishDate ? new Date(publishDate) : undefined,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedNewsArticle);
  } catch (error) {
    console.error('Error updating news article:', error);
    return NextResponse.json(
      { error: 'Failed to update news article' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a news article
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params object before accessing the id
    const { id } = await params;

    // Delete the news article
    await prisma.newsArticle.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting news article:', error);
    return NextResponse.json(
      { error: 'Failed to delete news article' },
      { status: 500 }
    );
  }
}
