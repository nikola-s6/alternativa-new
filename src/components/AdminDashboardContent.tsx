'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, LogOut, Plus, Edit, Trash } from 'lucide-react';
import TiptapEditor from '@/components/TipTapEditor';
import '../app/editor-styles.css'; // Import the editor styles
import ImageUploader from '@/components/ImageUploader';
import { NewsArticle } from '@/app/api/news/route';

// Define the Video type
type Video = {
  id?: string;
  title: string;
  youtubeId: string;
};

export default function AdminDashboardContent() {
  // Video state
  const [videos, setVideos] = useState<Video[]>([]);
  const [newVideo, setNewVideo] = useState<Video>({ title: '', youtubeId: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // News state
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [isSavingNews, setIsSavingNews] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState<string>('');
  const [newsMode, setNewsMode] = useState<'create' | 'edit' | 'delete'>(
    'create'
  );
  const [newsForm, setNewsForm] = useState({
    title: '',
    content: '',
    image: '',
    published: false,
  });
  const [editorKey, setEditorKey] = useState(Date.now());

  const { toast } = useToast();
  const router = useRouter();

  // Fetch videos on component mount
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/videos');

        if (!response.ok) {
          // If unauthorized, the middleware should redirect, but just in case
          if (response.status === 401) {
            router.push('/');
            return;
          }
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

  // Fetch news articles on component mount
  useEffect(() => {
    const fetchNewsArticles = async () => {
      try {
        const response = await fetch('/api/news');

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/');
            return;
          }
          throw new Error('Failed to fetch news articles');
        }

        const data = await response.json();
        setNewsArticles(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load news articles. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingNews(false);
      }
    };

    fetchNewsArticles();
  }, [router, toast]);

  // Fetch a specific news article when selected for editing
  useEffect(() => {
    if (newsMode === 'edit' && selectedNewsId) {
      const fetchNewsArticle = async () => {
        try {
          setIsSavingNews(true);
          const response = await fetch(`/api/news/${selectedNewsId}`);

          if (!response.ok) {
            throw new Error('Failed to fetch news article');
          }

          const data = await response.json();
          console.log('Fetched article data:', data);

          // Force editor to recreate with new content
          setEditorKey(Date.now());

          // Set form data
          setNewsForm({
            title: data.title,
            content: data.content,
            image: data.image || '',
            published: data.published,
          });

          setIsSavingNews(false);
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Failed to load news article. Please try again.',
            variant: 'destructive',
          });
          setIsSavingNews(false);
        }
      };

      fetchNewsArticle();
    }
  }, [selectedNewsId, newsMode, toast]);

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

  // Handle creating a new news article
  const handleCreateNews = async () => {
    // Validate inputs
    if (!newsForm.title.trim() || !newsForm.content.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in both title and content fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSavingNews(true);

    try {
      const response = await fetch('/api/admin/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newsForm),
      });

      if (!response.ok) {
        throw new Error('Failed to create news article');
      }

      const addedNews = await response.json();

      // Update local state
      setNewsArticles([addedNews, ...newsArticles]);

      // Reset form with empty values
      setNewsForm({
        title: '',
        content: '',
        image: '',
        published: false,
      });

      // Force editor to recreate with empty content
      setEditorKey(Date.now());

      toast({
        title: 'Вест креирана',
        description: 'Вест је успешно креирана',
        variant: 'confirm',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create news article. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSavingNews(false);
    }
  };

  // Handle updating a news article
  const handleUpdateNews = async () => {
    // Validate inputs
    if (!newsForm.title.trim() || !newsForm.content.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in both title and content fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSavingNews(true);

    try {
      const response = await fetch(`/api/admin/news/${selectedNewsId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newsForm),
      });

      if (!response.ok) {
        throw new Error('Failed to update news article');
      }

      const updatedNews = await response.json();

      // Update local state
      setNewsArticles(
        newsArticles.map((news) =>
          news.id === updatedNews.id ? updatedNews : news
        )
      );

      toast({
        title: 'Вест измењена',
        description: 'Вест је успешно измењена!',
        variant: 'confirm',
      });

      // Reset form and selection
      setNewsForm({
        title: '',
        content: '',
        image: '',
        published: false,
      });
      setSelectedNewsId('');
      setNewsMode('create');

      // Force editor to recreate with empty content
      setEditorKey(Date.now());
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update news article. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSavingNews(false);
    }
  };

  // Handle deleting a news article
  const handleDeleteNews = async () => {
    if (!selectedNewsId) {
      toast({
        title: 'Error',
        description: 'Please select a news article to delete.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch(`/api/admin/news/${selectedNewsId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete news article');
      }

      // Update local state
      setNewsArticles(
        newsArticles.filter((news) => news.id !== selectedNewsId)
      );

      // Reset selection
      setSelectedNewsId('');

      toast({
        title: 'Вест обрисана',
        description: 'Нова вест је успешно обрисана!',
        variant: 'confirm',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete news article. Please try again.',
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

  // Reset form when changing news mode
  useEffect(() => {
    if (newsMode === 'create') {
      setNewsForm({
        title: '',
        content: '',
        image: '',
        published: false,
      });
      setSelectedNewsId('');

      // Force editor to recreate with empty content
      setEditorKey(Date.now());
    }
  }, [newsMode]);

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
            {/* YouTube Videos Section */}
            <div className='bg-primary rounded-lg shadow-lg border-8 border-destructive mb-16'>
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

            {/* News Management Section */}
            <div className='bg-primary rounded-lg shadow-lg border-8 border-destructive'>
              <div className='w-full bg-destructive p-8'>
                <h2 className='text-4xl font-bold text-white mb-6 text-center'>
                  Управљање Вестима
                </h2>
                <p className='text-white text-lg text-center'>
                  Креирајте, уредите или обришите вести које се приказују на
                  сајту.
                </p>
              </div>

              <div className='p-8'>
                <Tabs
                  defaultValue='create'
                  onValueChange={(value) =>
                    setNewsMode(value as 'create' | 'edit' | 'delete')
                  }
                >
                  <TabsList className='grid w-full grid-cols-3 mb-8'>
                    <TabsTrigger
                      value='create'
                      className='flex items-center gap-2'
                    >
                      <Plus className='h-4 w-4' />
                      Креирај
                    </TabsTrigger>
                    <TabsTrigger
                      value='edit'
                      className='flex items-center gap-2'
                    >
                      <Edit className='h-4 w-4' />
                      Уреди
                    </TabsTrigger>
                    <TabsTrigger
                      value='delete'
                      className='flex items-center gap-2'
                    >
                      <Trash className='h-4 w-4' />
                      Обриши
                    </TabsTrigger>
                  </TabsList>

                  {/* Create News Tab */}
                  <TabsContent value='create'>
                    <div className='space-y-6'>
                      <div>
                        <label
                          htmlFor='newsTitle'
                          className='block text-sm font-medium text-white mb-1'
                        >
                          Наслов
                        </label>
                        <Input
                          id='newsTitle'
                          value={newsForm.title}
                          onChange={(e) =>
                            setNewsForm({ ...newsForm, title: e.target.value })
                          }
                          placeholder='Унесите наслов вести'
                          className='bg-white/10 text-white placeholder:text-gray-400 border-white/20'
                          disabled={isSavingNews}
                        />
                      </div>

                      <div>
                        <ImageUploader
                          value={newsForm.image || ''}
                          onChange={(value) =>
                            setNewsForm({ ...newsForm, image: value })
                          }
                          label='Насловна слика'
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-white mb-1'>
                          Садржај
                        </label>
                        <TiptapEditor
                          key={`create-${editorKey}`}
                          content={newsForm.content}
                          onChange={(content) =>
                            setNewsForm({ ...newsForm, content })
                          }
                          placeholder='Унесите садржај вести...'
                        />
                      </div>

                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          className='bg-white checked:bg-destructive'
                          id='newsPublished'
                          checked={newsForm.published}
                          onCheckedChange={(checked) =>
                            setNewsForm({
                              ...newsForm,
                              published: checked as boolean,
                            })
                          }
                        />
                        <label
                          htmlFor='newsPublished'
                          className='text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                        >
                          Објави одмах
                        </label>
                      </div>

                      <Button
                        onClick={handleCreateNews}
                        disabled={isSavingNews}
                        className='w-full'
                        variant='destructive'
                      >
                        {isSavingNews ? 'Креирање...' : 'Креирај Вест'}
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Edit News Tab */}
                  <TabsContent value='edit'>
                    <div className='space-y-6'>
                      <div>
                        <label
                          htmlFor='selectNewsToEdit'
                          className='block text-sm font-medium text-white mb-1'
                        >
                          Изаберите вест за уређивање
                        </label>
                        <Select
                          value={selectedNewsId}
                          onValueChange={setSelectedNewsId}
                        >
                          <SelectTrigger className='bg-white/10 text-white border-white/20'>
                            <SelectValue placeholder='Изаберите вест' />
                          </SelectTrigger>
                          <SelectContent>
                            {isLoadingNews ? (
                              <SelectItem value='loading' disabled>
                                Учитавање...
                              </SelectItem>
                            ) : newsArticles.length === 0 ? (
                              <SelectItem value='empty' disabled>
                                Нема вести
                              </SelectItem>
                            ) : (
                              newsArticles.map((news) => (
                                <SelectItem key={news.id} value={news.id}>
                                  {news.title}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      {selectedNewsId && (
                        <>
                          <div>
                            <label
                              htmlFor='editNewsTitle'
                              className='block text-sm font-medium text-white mb-1'
                            >
                              Наслов
                            </label>
                            <Input
                              id='editNewsTitle'
                              value={newsForm.title}
                              onChange={(e) =>
                                setNewsForm({
                                  ...newsForm,
                                  title: e.target.value,
                                })
                              }
                              placeholder='Унесите наслов вести'
                              className='bg-white/10 text-white placeholder:text-gray-400 border-white/20'
                              disabled={isSavingNews}
                            />
                          </div>

                          <div>
                            <ImageUploader
                              value={newsForm.image || ''}
                              onChange={(value) =>
                                setNewsForm({ ...newsForm, image: value })
                              }
                              label='Cover Image (optional)'
                            />
                          </div>

                          <div>
                            <label className='block text-sm font-medium text-white mb-1'>
                              Садржај
                            </label>
                            {isSavingNews ? (
                              <div className='bg-white/10 rounded-md p-4 text-center text-white'>
                                <p>Loading editor content...</p>
                              </div>
                            ) : (
                              <TiptapEditor
                                key={`edit-${editorKey}`}
                                content={newsForm.content}
                                onChange={(content) =>
                                  setNewsForm({ ...newsForm, content })
                                }
                                placeholder='Унесите садржај вести...'
                              />
                            )}
                          </div>

                          <div className='flex items-center space-x-2'>
                            <Checkbox
                              className='bg-white'
                              id='editNewsPublished'
                              checked={newsForm.published}
                              onCheckedChange={(checked) =>
                                setNewsForm({
                                  ...newsForm,
                                  published: checked as boolean,
                                })
                              }
                            />
                            <label
                              htmlFor='editNewsPublished'
                              className='text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                            >
                              Објављено
                            </label>
                          </div>

                          <Button
                            onClick={handleUpdateNews}
                            disabled={isSavingNews}
                            className='w-full'
                            variant='destructive'
                          >
                            {isSavingNews ? 'Ажурирање...' : 'Ажурирај Вест'}
                          </Button>
                        </>
                      )}
                    </div>
                  </TabsContent>

                  {/* Delete News Tab */}
                  <TabsContent value='delete'>
                    <div className='space-y-6'>
                      <div>
                        <label
                          htmlFor='selectNewsToDelete'
                          className='block text-sm font-medium text-white mb-1'
                        >
                          Изаберите вест за брисање
                        </label>
                        <Select
                          value={selectedNewsId}
                          onValueChange={setSelectedNewsId}
                        >
                          <SelectTrigger className='bg-white/10 text-white border-white/20'>
                            <SelectValue placeholder='Изаберите вест' />
                          </SelectTrigger>
                          <SelectContent>
                            {isLoadingNews ? (
                              <SelectItem value='loading' disabled>
                                Учитавање...
                              </SelectItem>
                            ) : newsArticles.length === 0 ? (
                              <SelectItem value='empty' disabled>
                                Нема вести
                              </SelectItem>
                            ) : (
                              newsArticles.map((news) => (
                                <SelectItem key={news.id} value={news.id}>
                                  {news.title}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      {selectedNewsId && (
                        <div className='bg-red-50 border border-red-200 rounded-md p-4'>
                          <h4 className='text-lg font-medium text-red-800 mb-2'>
                            Потврда брисања
                          </h4>
                          <p className='text-red-700 mb-4'>
                            Да ли сте сигурни да желите да обришете изабрану
                            вест? Ова акција се не може поништити.
                          </p>
                          <Button
                            variant='destructive'
                            onClick={handleDeleteNews}
                            className='w-full'
                          >
                            Обриши Вест
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
