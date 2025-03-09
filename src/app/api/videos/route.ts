import { NextResponse } from 'next/server';

export type Video = {
  id: string;
  title: string;
};

const videos: Video[] = [
  {
    id: 'BLJqMy4q8ac',
    title:
      'Osnivačka konferencija kampanje "Beograd ne može da čeka" (21.08.2024.)',
  },
  {
    id: '2LGyxKyAr2I',
    title:
      'Želimo da budemo tribuni običnih ljudi - Govor Peđe Milosavljevića (12.02.2022.)',
  },
  {
    id: 'C5JXdOISHJI',
    title:
      'Politički sistem u Srbiji je truo i antidemokratski - Govor Filipa Kalmarevića (12.02.2024.)',
  },
  {
    id: 'lkxYlFvBXlU',
    title:
      'Osnivačka konferencija lokalnog pokreta Alternativa za Čukaricu (12.02.2024.)',
  },
];

export async function GET() {
  return NextResponse.json(videos.slice(0, 3));
}
