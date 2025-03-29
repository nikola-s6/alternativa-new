'use client';

import type React from 'react';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, ImageIcon } from 'lucide-react';
import { fileToBase64, validateImage, compressImage } from '@/lib/image-utils';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface ImageUploaderProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  maxSizeMB?: number;
}

export default function ImageUploader({
  value,
  onChange,
  label = 'Cover Image',
  maxSizeMB = 5,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImage(file, maxSizeMB);
    if (!validation.valid) {
      toast({
        title: 'Error',
        description: validation.message,
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    try {
      // Compress image
      const compressedFile = await compressImage(file);

      // Convert to base64
      const base64 = await fileToBase64(compressedFile);

      // Set the value
      onChange(base64);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process image',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    onChange('');
  };

  return (
    <div className='space-y-2'>
      <label className='block text-sm font-medium text-gray-700'>{label}</label>

      {value ? (
        <div className='relative border rounded-md overflow-hidden'>
          <div className='aspect-video relative'>
            <Image
              src={value || '/placeholder.svg'}
              alt='Cover image'
              fill
              className='object-cover'
            />
          </div>
          <Button
            type='button'
            variant='destructive'
            size='sm'
            className='absolute top-2 right-2'
            onClick={handleRemoveImage}
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
      ) : (
        <div
          className='border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center hover:border-gray-400 transition-colors'
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type='file'
            ref={fileInputRef}
            accept='image/*'
            onChange={handleFileChange}
            className='hidden'
          />

          {isUploading ? (
            <div className='text-center'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto'></div>
              <p className='mt-2 text-sm text-gray-500'>Processing image...</p>
            </div>
          ) : (
            <>
              <div className='flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3'>
                {value ? (
                  <ImageIcon className='h-6 w-6 text-gray-600' />
                ) : (
                  <Upload className='h-6 w-6 text-gray-600' />
                )}
              </div>
              <p className='text-sm text-gray-500'>
                Click to upload or drag and drop
              </p>
              <p className='text-xs text-gray-400 mt-1'>
                PNG, JPG, GIF up to {maxSizeMB}MB
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
