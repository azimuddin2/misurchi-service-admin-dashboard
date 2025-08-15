'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ImageIcon,
  ArrowRight,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AppButton } from '@/components/shared/app-button';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';

// -------------------- Toolbar Config --------------------
const TOOLBAR_ACTIONS = [
  { icon: Bold, command: 'bold', label: 'Bold' },
  { icon: Italic, command: 'italic', label: 'Italic' },
  { icon: Underline, command: 'underline', label: 'Underline' },
];

const ALIGN_ACTIONS = [
  { icon: AlignLeft, command: 'justifyLeft', label: 'Align Left' },
  { icon: AlignCenter, command: 'justifyCenter', label: 'Align Center' },
  { icon: AlignRight, command: 'justifyRight', label: 'Align Right' },
  { icon: AlignJustify, command: 'justifyFull', label: 'Justify' },
];

// -------------------- Validation Schema --------------------
const aboutUsSchema = z.object({
  content: z
    .string({ required_error: 'About us content is required' })
    .min(100, 'About us content must be at least 100 letters'),
});

export default function AboutUsForm() {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const form = useForm({
    resolver: zodResolver(aboutUsSchema),
    defaultValues: { content: '' },
  });

  const {
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  // -------------------- Editor Formatting --------------------
  const format = (command: string, value?: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus(); // Keep editor focused
    document.execCommand(command, false, value);
    updateFormContent();
  };

  const updateFormContent = () => {
    const html = editorRef.current?.innerHTML || '';
    setValue('content', html, { shouldValidate: true });
    setIsEmpty((editorRef.current?.innerText || '').trim() === '');
  };

  const handleImageInsert = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.src = event.target?.result as string;
      img.alt = file.name;
      img.style.maxWidth = '100%';
      img.style.margin = '8px 0';

      const range = window.getSelection()?.getRangeAt(0);
      range ? range.insertNode(img) : editorRef.current?.appendChild(img);
      editorRef.current?.focus();
      setIsEmpty(false);
      updateFormContent();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // -------------------- Submit --------------------
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const toastId = toast.loading('Saving about us...');
    try {
      // Simulate API
      await new Promise((res) => setTimeout(res, 1000));
      toast.success('About us saved successfully');
      console.log('Submitted Data:', data);
    } catch {
      toast.error('Failed to save about us');
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="rounded max-w-7xl">
      <h2 className="text-xl font-medium mb-3 ml-1">About Us</h2>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* About Us Editor */}
          <FormField
            control={control}
            name="content"
            render={() => (
              <FormItem>
                <FormControl>
                  <div className="w-full">
                    <div className="bg-white rounded-lg border">
                      {/* Toolbar */}
                      <div className="lg:px-3 py-2 border-b flex items-center gap-1 flex-wrap justify-end">
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleImageInsert}
                          className="hidden"
                        />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  fileInputRef.current?.click();
                                }}
                                type="button"
                              >
                                <ImageIcon className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Insert Image</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {/* Font Size */}
                        <Select
                          defaultValue="3"
                          onValueChange={(v) => format('fontSize', v)}
                        >
                          <SelectTrigger className="w-16 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">10</SelectItem>
                            <SelectItem value="2">13</SelectItem>
                            <SelectItem value="3">16</SelectItem>
                            <SelectItem value="4">18</SelectItem>
                            <SelectItem value="5">24</SelectItem>
                          </SelectContent>
                        </Select>

                        {/* Formatting */}
                        {TOOLBAR_ACTIONS.map(
                          ({ icon: Icon, command, label }) => (
                            <TooltipProvider key={command}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      format(command);
                                    }}
                                    type="button"
                                  >
                                    <Icon className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>{label}</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ),
                        )}

                        {/* Alignment */}
                        {ALIGN_ACTIONS.map(({ icon: Icon, command, label }) => (
                          <TooltipProvider key={command}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    format(command);
                                  }}
                                  type="button"
                                >
                                  <Icon className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>{label}</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>

                      {/* Content Area */}
                      <div className="p-4 relative min-h-[400px] lg:min-h-[600px]">
                        {isEmpty && (
                          <div className="absolute text-sm text-gray-400 pointer-events-none select-none">
                            Write description here...
                          </div>
                        )}
                        <div
                          ref={editorRef}
                          contentEditable
                          suppressContentEditableWarning
                          onInput={updateFormContent}
                          className="outline-none text-sm"
                          style={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <AppButton
            className="w-full text-gray-50 border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 m-0"
            content={
              <div className="flex justify-center items-center space-x-2 font-semibold">
                <p className="uppercase">
                  {isSubmitting ? 'Saving...' : 'Save Change'}
                </p>
                <ArrowRight />
              </div>
            }
          />
        </form>
      </Form>
    </div>
  );
}
