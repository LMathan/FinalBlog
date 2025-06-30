import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link as LinkIcon, 
  Image as ImageIcon,
  Code,
  Quote
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'min-h-96 p-4 focus:outline-none prose max-w-none',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        
        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          
          if (response.ok) {
            const data = await response.json();
            editor.chain().focus().setImage({ src: data.url }).run();
          } else {
            alert('Failed to upload image');
          }
        } catch (error) {
          alert('Error uploading image');
        }
      }
    };
    input.click();
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Content
      </label>
      
      {/* Editor Toolbar */}
      <div className="border border-slate-300 rounded-t-md bg-slate-50 px-3 py-2">
        <div className="flex flex-wrap gap-2">
          <div className="flex border-r border-slate-300 pr-2 mr-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 ${editor.isActive('bold') ? 'bg-slate-200' : ''}`}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 ${editor.isActive('italic') ? 'bg-slate-200' : ''}`}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-2 ${editor.isActive('strike') ? 'bg-slate-200' : ''}`}
            >
              <Underline className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex border-r border-slate-300 pr-2 mr-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 ${editor.isActive('bulletList') ? 'bg-slate-200' : ''}`}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 ${editor.isActive('orderedList') ? 'bg-slate-200' : ''}`}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex border-r border-slate-300 pr-2 mr-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addLink}
              className="p-2"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addImage}
              className="p-2"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`p-2 ${editor.isActive('code') ? 'bg-slate-200' : ''}`}
            >
              <Code className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-2 ${editor.isActive('blockquote') ? 'bg-slate-200' : ''}`}
            >
              <Quote className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Editor Content Area */}
      <div className="border-l border-r border-b border-slate-300 rounded-b-md focus-within:ring-1 focus-within:ring-primary focus-within:border-primary">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
