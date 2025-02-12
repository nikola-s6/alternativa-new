import { NewsSection } from '@/components/home/newsSection';
import { ProgramSection } from '@/components/home/programSection';
import { TeamSection } from '@/components/home/team';
import { HomeSection } from '@/components/home/welcomeSection';
import { YouTubeSection } from '@/components/home/youtube';

export default function Home() {
  return (
    <main>
      <HomeSection />
      <TeamSection />
      <YouTubeSection />
      <ProgramSection />
      <NewsSection />
    </main>
  );
}
