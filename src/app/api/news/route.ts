import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export type NewsArticle = {
  id: string;
  title: string;
  image: string; // base64 encoded image
  createdAt: Date;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ limit?: number }> }
) {
  const p = await params;

  const limit = p?.limit;
  console.log(limit);

  const newsArticles = await prisma.newsArticle.findMany({
    where: {
      published: true,
    },
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      createdAt: true,
      title: true,
      image: true,
      id: true,
    },
  });
  console.log(newsArticles);

  return NextResponse.json(newsArticles);
}
