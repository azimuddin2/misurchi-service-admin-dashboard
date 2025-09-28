import { useEffect, useRef, useState } from 'react';
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
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Control } from 'react-hook-form';

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

type TextEditorProps = {
  name: string;
  control: Control<any>;
  placeholder?: string;
  minHeight?: number;
};

export const TextEditor = ({
  name,
  control,
  placeholder = 'Write description here...',
  minHeight = 400,
}: TextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const format = (command: string, value?: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
    updateFormContent();
  };

  const updateFormContent = (setValue?: (v: string) => void) => {
    const html = editorRef.current?.innerHTML || '';
    setValue?.(html);
    setIsEmpty((editorRef.current?.innerText || '').trim() === '');
  };

  const handleImageInsert = (
    e: React.ChangeEvent<HTMLInputElement>,
    setValue?: (v: string) => void,
  ) => {
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
      updateFormContent(setValue);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Sync editor with form value
        useEffect(() => {
          if (
            editorRef.current &&
            field.value !== editorRef.current.innerHTML
          ) {
            editorRef.current.innerHTML = field.value || '';
            setIsEmpty((field.value || '').trim() === '');
          }
        }, [field.value]);

        return (
          <FormItem>
            <FormControl>
              <div className="bg-white rounded-lg border">
                {/* Toolbar */}
                <div className="lg:px-3 py-2 border-b flex items-center gap-1 flex-wrap justify-end">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e) => handleImageInsert(e, field.onChange)}
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
                  {TOOLBAR_ACTIONS.map(({ icon: Icon, command, label }) => (
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
                <div className="p-4 relative" style={{ minHeight }}>
                  {isEmpty && (
                    <div className="absolute text-sm text-gray-400 pointer-events-none select-none">
                      {placeholder}
                    </div>
                  )}
                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={() => updateFormContent(field.onChange)}
                    className="outline-none text-sm"
                    style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                  />
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
