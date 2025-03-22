'use client';

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
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  name: z.string().nonempty('Поље не сме бити празно'),
  email: z.string().email({
    message: 'Унети исправан емаил формат',
  }),
  phone: z.string().min(9, {
    message: 'Број телефона мора имати 9 цифара',
  }),
});

export function ContactForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const params = new URLSearchParams({
      name: values.name,
      email: values.email,
      phone: values.phone,
    });

    router.push(`contact?${params.toString()}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-white'>Име и презиме</FormLabel>
              <FormControl>
                <Input
                  placeholder='Унесите име и презиме'
                  {...field}
                  className='bg-white/10 text-white placeholder:text-gray-400 border-white/20'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-white'>Имејл</FormLabel>
              <FormControl>
                <Input
                  placeholder='Унесите имејл'
                  {...field}
                  className='bg-white/10 text-white placeholder:text-gray-400 border-white/20'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-white'>Телефон</FormLabel>
              <FormControl>
                <Input
                  placeholder='Унесите број телефона'
                  {...field}
                  className='bg-white/10 text-white placeholder:text-gray-400 border-white/20'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          variant='destructive'
          className='w-full font-extrabold'
        >
          Прикључи се
        </Button>
      </form>
    </Form>
  );
}
