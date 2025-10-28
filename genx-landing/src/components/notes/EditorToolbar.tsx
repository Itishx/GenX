import React from 'react'
import { Editor } from '@tiptap/react'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  Heading1,
  Heading2,
  Sparkles,
} from 'lucide-react'

interface EditorToolbarProps {
  editor: Editor | null
  onAskAI?: () => void
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor, onAskAI }) => {
  if (!editor) return null

  const ToolButton = ({
    onClick,
    isActive,
    icon: Icon,
    title,
  }: {
    onClick: () => void
    isActive?: boolean
    icon: React.ComponentType<any>
    title: string
  }) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded hover:bg-gray-100 transition-colors ${
        isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-600'
      }`}
    >
      <Icon size={18} />
    </button>
  )

  return (
    <div className="border-b border-gray-200 bg-gray-50 px-6 py-2 flex items-center gap-1 flex-wrap">
      <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
        <ToolButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          icon={Bold}
          title="Bold (Ctrl+B)"
        />
        <ToolButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          icon={Italic}
          title="Italic (Ctrl+I)"
        />
      </div>

      <div className="flex items-center gap-1 border-r border-gray-300 px-2">
        <ToolButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          icon={Heading1}
          title="Heading 1"
        />
        <ToolButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          icon={Heading2}
          title="Heading 2"
        />
      </div>

      <div className="flex items-center gap-1 border-r border-gray-300 px-2">
        <ToolButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          icon={List}
          title="Bullet List"
        />
        <ToolButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          icon={ListOrdered}
          title="Numbered List"
        />
      </div>

      <div className="flex items-center gap-1 px-2">
        <ToolButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          icon={Code}
          title="Code Block"
        />
      </div>

      {onAskAI && (
        <div className="ml-auto">
          <button
            onClick={onAskAI}
            className="flex items-center gap-2 px-3 py-2 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-sm font-medium"
          >
            <Sparkles size={16} />
            Ask AI ✨
          </button>
        </div>
      )}
    </div>
  )
}

export default EditorToolbar
