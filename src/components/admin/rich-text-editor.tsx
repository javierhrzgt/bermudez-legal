'use client'

import { useEffect, useRef } from 'react'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/core/fonts/inter.css'
import '@blocknote/mantine/style.css'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useCreateBlockNote()
  const initializedRef = useRef(false)

  // Cargar HTML inicial → bloques (solo una vez)
  useEffect(() => {
    if (initializedRef.current || !editor) return
    initializedRef.current = true

    if (value) {
      const loadContent = async () => {
        const blocks = await editor.tryParseHTMLToBlocks(value)
        editor.replaceBlocks(editor.document, blocks)
      }
      loadContent()
    }
  }, [editor, value])

  // Convertir bloques → HTML estándar (ul, ol, li, h1, etc.)
  const handleChange = async () => {
    const html = await editor.blocksToHTMLLossy(editor.document)
    onChange(html)
  }

  return (
    <div className="border border-input rounded-lg overflow-hidden">
      <BlockNoteView
        editor={editor}
        onChange={handleChange}
        theme="light"
      />
    </div>
  )
}
