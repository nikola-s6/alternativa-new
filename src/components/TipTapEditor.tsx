'use client';

import type React from 'react';

import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  ImageIcon,
  LinkIcon,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Upload,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fileToBase64, validateImage, compressImage } from '@/lib/image-utils';
import { useToast } from '@/hooks/use-toast';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function TiptapEditor({
  content,
  onChange,
  placeholder = 'Start writing...',
}: TiptapEditorProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [imageWidth, setImageWidth] = useState('100%');
  const [imageAlignment, setImageAlignment] = useState('center');
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [imageTab, setImageTab] = useState('url');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [editorKey, setEditorKey] = useState(Date.now());
  const [initialContent, setInitialContent] = useState(content);

  // Force re-render of editor when content changes significantly
  useEffect(() => {
    if (content !== initialContent) {
      console.log('Content changed significantly, recreating editor');
      setInitialContent(content);
      setEditorKey(Date.now());
    }
  }, [content, initialContent]);

  const editor = useEditor({
    // @ts-expect-error works
    key: `editor-${editorKey}`,
    extensions: [
      StarterKit,
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: 'left',
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose max-w-none p-4 min-h-[400px] bg-white rounded-b-md text-gray-900 focus:outline-none',
      },
    },
  });

  // Add image with alignment class
  const addImageWithAlignment = useCallback(
    (editor: Editor, url: string, alignment: string, width: string) => {
      if (!editor) return;

      const imageHtml = `<img src="${url}" class="image-align-${alignment}" style="width: ${width};" />`;
      editor.commands.insertContent(imageHtml);
    },
    []
  );

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImage(file, 5); // 5MB max
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

      // Set preview and URL
      setUploadPreview(base64);
      setImageUrl(base64);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process image',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const addImage = useCallback(() => {
    if (!editor || !imageUrl) return;

    // Insert image with alignment class
    addImageWithAlignment(editor, imageUrl, imageAlignment, imageWidth);

    // Reset form
    setImageUrl('');
    setImageWidth('100%');
    setImageAlignment('center');
    setUploadPreview(null);
    setIsImageDialogOpen(false);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [editor, imageUrl, imageAlignment, imageWidth, addImageWithAlignment]);

  const setLink = () => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter the URL:', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  if (!editor) {
    return null;
  }

  return (
    <div className='border border-gray-300 rounded-md overflow-hidden'>
      <div className='bg-gray-100 p-2 border-b border-gray-300 flex flex-wrap gap-1'>
        {/* Text formatting */}
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-gray-200' : ''}
        >
          <Bold className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-gray-200' : ''}
        >
          <Italic className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''
          }
        >
          <Heading1 className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''
          }
        >
          <Heading2 className='h-4 w-4' />
        </Button>

        {/* Divider */}
        <div className='w-px h-6 bg-gray-300 mx-1'></div>

        {/* Alignment options */}
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={
            editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''
          }
        >
          <AlignLeft className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={
            editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''
          }
        >
          <AlignCenter className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={
            editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''
          }
        >
          <AlignRight className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={
            editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-200' : ''
          }
        >
          <AlignJustify className='h-4 w-4' />
        </Button>

        {/* Divider */}
        <div className='w-px h-6 bg-gray-300 mx-1'></div>

        {/* Lists */}
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
        >
          <List className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
        >
          <ListOrdered className='h-4 w-4' />
        </Button>

        {/* Divider */}
        <div className='w-px h-6 bg-gray-300 mx-1'></div>

        {/* Links and images */}
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={setLink}
          className={editor.isActive('link') ? 'bg-gray-200' : ''}
        >
          <LinkIcon className='h-4 w-4' />
        </Button>

        <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
          <DialogTrigger asChild>
            <Button type='button' variant='ghost' size='sm'>
              <ImageIcon className='h-4 w-4' />
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[500px]'>
            <DialogHeader>
              <DialogTitle>Insert Image</DialogTitle>
            </DialogHeader>

            <Tabs
              defaultValue='upload'
              value={imageTab}
              onValueChange={setImageTab}
              className='mt-2'
            >
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='upload'>Upload Image</TabsTrigger>
                <TabsTrigger value='url'>Image URL</TabsTrigger>
              </TabsList>

              <TabsContent value='upload' className='py-4'>
                <div className='space-y-4'>
                  <div className='flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 cursor-pointer hover:border-gray-400 transition-colors'>
                    <input
                      type='file'
                      ref={fileInputRef}
                      accept='image/*'
                      onChange={handleFileChange}
                      className='hidden'
                      id='image-upload'
                    />
                    <label
                      htmlFor='image-upload'
                      className='cursor-pointer flex flex-col items-center'
                    >
                      <Upload className='h-8 w-8 text-gray-500 mb-2' />
                      <span className='text-sm text-gray-500'>
                        Click to upload or drag and drop
                      </span>
                      <span className='text-xs text-gray-400 mt-1'>
                        PNG, JPG, GIF up to 5MB
                      </span>
                    </label>
                  </div>

                  {isUploading && (
                    <div className='text-center py-2'>
                      <span className='text-sm text-gray-500'>
                        Processing image...
                      </span>
                    </div>
                  )}

                  {uploadPreview && (
                    <div className='mt-4'>
                      <p className='text-sm font-medium mb-2'>Preview:</p>
                      <div className='relative border border-gray-200 rounded-md overflow-hidden'>
                        <img
                          src={uploadPreview || '/placeholder.svg'}
                          alt='Preview'
                          className='max-h-[200px] mx-auto'
                        />
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value='url' className='py-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='imageUrl' className='text-right'>
                    Image URL
                  </Label>
                  <Input
                    id='imageUrl'
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder='https://example.com/image.jpg'
                    className='col-span-3'
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='imageWidth' className='text-right'>
                  Width
                </Label>
                <Input
                  id='imageWidth'
                  value={imageWidth}
                  onChange={(e) => setImageWidth(e.target.value)}
                  placeholder='100% or 500px'
                  className='col-span-3'
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label className='text-right'>Alignment</Label>
                <RadioGroup
                  value={imageAlignment}
                  onValueChange={setImageAlignment}
                  className='col-span-3 flex space-x-4'
                >
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='left' id='left' />
                    <Label htmlFor='left'>Left</Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='center' id='center' />
                    <Label htmlFor='center'>Center</Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='right' id='right' />
                    <Label htmlFor='right'>Right</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <DialogFooter>
              <Button
                type='submit'
                onClick={addImage}
                disabled={!imageUrl || isUploading}
              >
                Insert Image
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Divider */}
        <div className='w-px h-6 bg-gray-300 mx-1'></div>

        {/* Undo/Redo */}
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className='h-4 w-4' />
        </Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
