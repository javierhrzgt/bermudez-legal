'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  X,
} from 'lucide-react'
import { useState, useCallback } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'text-gray-600 mb-4',
          },
        },
        heading: {
          HTMLAttributes: {
            class: 'font-serif font-bold text-gray-600',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc list-inside space-y-2 mb-6 text-gray-600 pl-4',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal list-inside space-y-2 mb-6 text-gray-600 pl-4',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'text-gray-600 leading-relaxed',
          },
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'min-h-[300px] px-4 py-3 text-sm text-gray-600',
        style: `
          ul { list-style-type: disc; margin-left: 1.5em; margin-bottom: 0.5em; }
          ol { list-style-type: decimal; margin-left: 1.5em; margin-bottom: 0.5em; }
          li { margin-bottom: 0.25em; }
          h1 { font-size: 2.25rem; font-weight: 700; margin-top: 4rem; margin-bottom: 2rem; }
          h2 { font-size: 1.875rem; font-weight: 700; margin-top: 3rem; margin-bottom: 1.5rem; }
          h3 { font-size: 1.5rem; font-weight: 600; margin-top: 2rem; margin-bottom: 1rem; }
        `,
      },
    },
  })

  const setLink = useCallback(() => {
    if (linkUrl) {
      editor?.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
    } else {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run()
    }
    setLinkUrl('')
    setShowLinkInput(false)
  }, [editor, linkUrl])

  const handleAddLink = () => {
    const url = prompt('Ingresa la URL del enlace:')
    if (url) {
      editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
  }

  if (!editor) {
    return null
  }

  return (
    <div className="border border-input rounded-lg overflow-hidden bg-background">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-input bg-muted/30">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-accent transition-colors ${
            editor.isActive('bold') ? 'bg-accent text-accent-foreground' : ''
          }`}
          title="Negrita (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-accent transition-colors ${
            editor.isActive('italic') ? 'bg-accent text-accent-foreground' : ''
          }`}
          title="Cursiva (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-accent transition-colors ${
            editor.isActive('underline') ? 'bg-accent text-accent-foreground' : ''
          }`}
          title="Subrayado (Ctrl+U)"
        >
          <UnderlineIcon className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-accent transition-colors ${
            editor.isActive('heading', { level: 1 }) ? 'bg-accent text-accent-foreground' : ''
          }`}
          title="Título 1"
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-accent transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-accent text-accent-foreground' : ''
          }`}
          title="Título 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-accent transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'bg-accent text-accent-foreground' : ''
          }`}
          title="Título 3"
        >
          <Heading3 className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-accent transition-colors ${
            editor.isActive('bulletList') ? 'bg-accent text-accent-foreground' : ''
          }`}
          title="Lista con viñetas"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-accent transition-colors ${
            editor.isActive('orderedList') ? 'bg-accent text-accent-foreground' : ''
          }`}
          title="Lista numerada"
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        <button
          type="button"
          onClick={handleAddLink}
          className={`p-2 rounded hover:bg-accent transition-colors ${
            editor.isActive('link') ? 'bg-accent text-accent-foreground' : ''
          }`}
          title="Insertar enlace"
        >
          <LinkIcon className="h-4 w-4" />
        </button>

        {editor.isActive('link') && (
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="p-2 rounded hover:bg-accent transition-colors text-red-500"
            title="Quitar enlace"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}
