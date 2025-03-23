'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  username: z.string().nonempty('Обавезно поље'),
  password: z.string().nonempty('Обавезно поље'),
});

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send email');
      }

      // Simulate successful login
      toast({
        title: 'Успешно сте се пријавили',
        description: 'Добродошли назад!',
      });

      // Redirect to home page after successful login
      router.push('/admin');
    } catch (error) {
      toast({
        title: 'Грешка при пријављивању',
        description: 'Проверите ваше податке и покушајте поново.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='w-full max-w-md'>
        <div className='bg-white rounded-lg shadow-lg overflow-hidden border-8 border-destructive'>
          {/* Logo and Header */}
          <div className='bg-primary p-8 flex flex-col items-center'>
            <Link href='/' className='mb-6'>
              <div className='relative w-32 h-32'>
                <Image
                  src='/logos/white.jpg'
                  alt='Logo'
                  fill
                  className='object-contain'
                />
              </div>
            </Link>
            <h1 className='text-3xl font-bold text-white text-center'>
              ЧУКАРИЦА НА ПРВОМ МЕСТУ
            </h1>
            <p className='text-white/80 mt-2 text-center'>
              Пријавите се на ваш налог
            </p>
          </div>

          {/* Form */}
          <div className='p-8 bg-white'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'
              >
                <FormField
                  control={form.control}
                  name='username'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Корисничко име</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Унесите корисничко име'
                          {...field}
                          disabled={isLoading}
                          className='border-gray-300'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Лозинка</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='••••••••'
                          {...field}
                          disabled={isLoading}
                          className='border-gray-300'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type='submit'
                  className='w-full bg-destructive hover:bg-red-700'
                  disabled={isLoading}
                >
                  {isLoading ? 'Пријављивање...' : 'Пријави се'}
                </Button>
              </form>
            </Form>
          </div>

          {/* Footer */}
          <div className='bg-gray-50 p-6 border-t border-gray-200 text-center'>
            <Link
              href='/'
              className='block mt-4 text-primary hover:underline text-sm'
            >
              Назад на почетну страну
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
