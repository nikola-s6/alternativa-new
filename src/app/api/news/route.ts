import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export type NewsArticle = {
  id: string;
  title: string;
  image: string; // base64 encoded image
  publishDate: Date;
  createdAt: Date;
};

export async function GET(request: NextRequest) {
  // Get the limit parameter from the URL search params
  const limitParam = request.nextUrl.searchParams.get('limit');

  // Convert to number if it exists, otherwise undefined
  const limit = limitParam ? parseInt(limitParam, 10) : undefined;

  const newsArticles = await prisma.newsArticle.findMany({
    where: {
      published: true,
    },
    take: limit, // This will be ignored if limit is undefined
    orderBy: {
      publishDate: 'desc',
    },
    select: {
      createdAt: true,
      title: true,
      image: true,
      id: true,
      publishDate: true
    },
  });

  return NextResponse.json(newsArticles);
}
