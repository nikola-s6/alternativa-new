'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
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
import { Textarea } from '@/components/ui/textarea';
// import { toast } from 'sonner';
//
import { useToast } from '@/hooks/use-toast';
import SecondaryHeader from '@/components/SecondaryHeader';
import { neighborhoods } from '@/config/site';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

const formSchema = z.object({
  name: z.string().nonempty('Поље не сме бити празно'),
  email: z.string().email({
    message: 'Унети исправан емаил формат',
  }),
  phone: z.string().min(9, {
    message: 'Број телефона мора имати 9 цифара',
  }),
  neighborhood: z.string().optional(),
  comment: z.string().optional(),
});

export default function ContactPage() {
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      neighborhood: '',
      comment: '',
    },
  });
  // Pre-fill form with data from URL params if available
  useEffect(() => {
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');

    if (name) form.setValue('name', name);
    if (email) form.setValue('email', email);
    if (phone) form.setValue('phone', phone);
  }, [searchParams, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
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

      toast({
        title: 'Подаци су успешно послати!',
        description: 'Хвала Вам на поверењу!',
        variant: 'confirm',
      });

      form.reset();
    } catch (error) {
      toast({
        title: 'Грешка!',
        description:
          'Дошло је до грешке приликом слања података. Молимо Вас покушајте поново касније!',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main>
      {/* Header Section */}
      <SecondaryHeader title='прикључи се' />

      {/* Form Section */}
      <section className='py-16 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto bg-primary rounded-lg shadow-lg border-8 border-destructive'>
            <div className='w-full bg-destructive p-8'>
              <h2 className='text-4xl font-bold text-white mb-6 text-center'>
                ЧУКАРИЦА НА ПРВОМ МЕСТУ
              </h2>
              <p className='text-white text-lg text-center'>
                Циљ нашег програма јесте покретање Чукарице са мртве тачке, а
                оно што нас издваја јесте озбиљан тим људи који је спреман да
                преузме пуну одговорност за вођење општине, као и да полаже
                рачуне грађанима.
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6 p-8'
              >
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-white'>
                        Име и презиме
                      </FormLabel>
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
                <FormField
                  control={form.control}
                  name='neighborhood'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-white'>
                        Месна заједница
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='bg-white/10 text-white border-white/20'>
                            <SelectValue placeholder='Изаберите месну заједницу' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {neighborhoods.map((neighborhood) => (
                            <SelectItem
                              key={neighborhood.value}
                              value={neighborhood.value}
                            >
                              {neighborhood.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='comment'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-white'>
                        Додатни коментар или питање
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Унесите текст'
                          {...field}
                          className='bg-white/10 text-white placeholder:text-gray-400 border-white/20 min-h-[120px]'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type='submit'
                  className='w-full'
                  disabled={isSubmitting}
                  variant='destructive'
                >
                  {isSubmitting ? 'Слање...' : 'Прикључи се'}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </main>
  );
}
