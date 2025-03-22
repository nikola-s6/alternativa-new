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
import { toast } from 'sonner';
import SecondaryHeader from '@/components/SecondaryHeader';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  phone: z.string().min(9, {
    message: 'Phone number must be at least 9 digits.',
  }),
  comment: z.string().optional(),
});

export default function ContactPage() {
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
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
      console.log(values);

      toast('test', {
        description: "We'll get back to you as soon as possible.",
      });

      form.reset();
    } catch (error) {
      toast('greska', {
        description: 'Your form was not submitted. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <SecondaryHeader title='прикључи се' />
    </div>
  );
}
