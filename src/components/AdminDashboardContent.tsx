'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, LogOut } from 'lucide-react';

// Define the Video type
type Video = {
  id?: string;
  title: string;
  youtubeId: string;
};

export default function AdminDashboardContent() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [newVideo, setNewVideo] = useState<Video>({ title: '', youtubeId: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Fetch videos on component mount
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/videos');

        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }

        const data = await response.json();
        setVideos(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load videos. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [router, toast]);

  // Handle adding a new video
  const handleAddVideo = async () => {
    // Validate inputs
    if (!newVideo.title.trim() || !newVideo.youtubeId.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in both title and YouTube ID fields.',
        variant: 'destructive',
      });
      return;
    }

    // Check if we've reached the maximum number of videos
    if (videos.length >= 3) {
      toast({
        title: 'Error',
        description:
          'Maximum of 3 videos allowed. Please delete a video before adding a new one.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newVideo),
      });

      if (!response.ok) {
        throw new Error('Failed to add video');
      }

      const addedVideo = await response.json();

      // Update local state
      setVideos([...videos, addedVideo]);

      // Reset form
      setNewVideo({ title: '', youtubeId: '' });

      toast({
        title: 'Видео додат',
        description: 'Успешно додат видео.',
        variant: 'confirm',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add video. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle deleting a video
  const handleDeleteVideo = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/videos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete video');
      }

      // Update local state
      setVideos(videos.filter((video) => video.id !== id));

      toast({
        title: 'Видео обрисан',
        description: 'Успешно обрисан видео.',
        variant: 'confirm',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete video. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout');

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Redirect to login page
      router.push('/login');

      toast({
        title: 'Успешно одјављивање',
        description: 'Успешно сте се одјавили.',
        variant: 'confirm',
      });
    } catch (error) {
      toast({
        title: 'Грешка',
        description: 'Одјављивање није успело. Покушајте поново.',
        variant: 'destructive',
      });
    }
  };

  return (
    <main>
      <section
        className='py-16 relative overflow-hidden'
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,51,110,0.95), rgba(0,51,110,0.8)), url('/cukarica/slika2.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className='container mx-auto px-4'>
          <div className='flex justify-between items-center'>
            <h1 className='text-4xl font-extrabold text-white'>Админ Панел</h1>
            <Button
              variant='destructive'
              onClick={handleLogout}
              className='flex items-center gap-2'
            >
              <LogOut className='h-4 w-4' />
              Одјави се
            </Button>
          </div>
        </div>
      </section>

      <section className='py-16 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <div className='bg-primary rounded-lg shadow-lg border-8 border-destructive mb-8'>
              <div className='w-full bg-destructive p-8'>
                <h2 className='text-4xl font-bold text-white mb-6 text-center'>
                  Управљање YouTube Видеима
                </h2>
                <p className='text-white text-lg text-center'>
                  Додајте, уредите или обришите YouTube видее који се приказују
                  на сајту. Максимално 3 видеа.
                </p>
              </div>

              <div className='p-8'>
                {/* Video Table */}
                <div className='mb-8 overflow-hidden bg-white rounded-lg border border-gray-200'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          Наслов
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          YouTube ID
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          Акције
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {isLoading ? (
                        <tr>
                          <td
                            colSpan={3}
                            className='px-6 py-4 text-center text-sm text-gray-500'
                          >
                            Учитавање...
                          </td>
                        </tr>
                      ) : videos.length === 0 ? (
                        <tr>
                          <td
                            colSpan={3}
                            className='px-6 py-4 text-center text-sm text-gray-500'
                          >
                            Нема видеа. Додајте нови видео испод.
                          </td>
                        </tr>
                      ) : (
                        videos.map((video) => (
                          <tr key={video.id}>
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                              {video.title}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                              {video.youtubeId}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                              <Button
                                variant='destructive'
                                size='sm'
                                onClick={() => handleDeleteVideo(video.id!)}
                                className='flex items-center gap-1'
                              >
                                <Trash2 className='h-4 w-4' />
                                Обриши
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Add Video Form */}
                <div className='bg-gray-50 p-6 rounded-lg border border-gray-200'>
                  <h3 className='text-lg font-medium text-gray-900 mb-4'>
                    Додај нови видео
                  </h3>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                    <div>
                      <label
                        htmlFor='title'
                        className='block text-sm font-medium text-gray-700 mb-1'
                      >
                        Наслов
                      </label>
                      <Input
                        id='title'
                        value={newVideo.title}
                        onChange={(e) =>
                          setNewVideo({ ...newVideo, title: e.target.value })
                        }
                        placeholder='Унесите наслов видеа'
                        disabled={isSaving || videos.length >= 3}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor='youtubeId'
                        className='block text-sm font-medium text-gray-700 mb-1'
                      >
                        YouTube ID
                      </label>
                      <Input
                        id='youtubeId'
                        value={newVideo.youtubeId}
                        onChange={(e) =>
                          setNewVideo({
                            ...newVideo,
                            youtubeId: e.target.value,
                          })
                        }
                        placeholder='нпр. dQw4w9WgXcQ'
                        disabled={isSaving || videos.length >= 3}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleAddVideo}
                    disabled={isSaving || videos.length >= 3}
                    className='w-full'
                  >
                    {isSaving ? 'Додавање...' : 'Додај Видео'}
                  </Button>

                  {videos.length >= 3 && (
                    <p className='mt-2 text-sm text-destructive'>
                      Достигнут је максималан број видеа (3). Обришите постојећи
                      видео да бисте додали нови.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
