# 📝 Notion-Style Notes Feature - Complete Guide

## Overview

Your Aviate app now has a fully-featured Notion-style Notes system with:
- ✅ Rich text editing (TipTap)
- ✅ Create, read, update, delete notes
- ✅ Auto-save to localStorage
- ✅ Responsive sidebar with note list
- ✅ Rename and delete notes
- ✅ AI enhancement button (optional, easily integrated)
- ✅ Clean, minimalist UI

## Quick Start

### Access Notes
```
Navigate to: http://localhost:3000/app/notes
```

### Basic Usage
1. Click **"New Note"** button in the sidebar
2. Type your note title in the editor
3. Write your content using the rich text editor
4. Click formatting buttons in the toolbar (Bold, Italic, Headings, etc.)
5. Notes auto-save as you type (500ms debounce)

## File Structure

```
src/
├── components/notes/
│   ├── NotesLayout.tsx          # Main container component
│   ├── NotesSidebar.tsx         # Left sidebar with note list
│   ├── NoteEditor.tsx           # Main editor with TipTap
│   ├── EditorToolbar.tsx        # Formatting toolbar
│   ├── NoteEditor.css           # Editor styling & TipTap prose
│   ├── NotesSidebar.css         # Sidebar styling
│   └── NotesLayout.css          # Layout & responsive styles
├── hooks/notes/
│   └── useNotes.ts              # Custom hook for note management
├── pages/app/
│   ├── Notes.tsx                # Notes page wrapper
│   └── notes/
│       └── example-ai-api.ts    # AI integration examples
└── main.tsx                     # Updated with /app/notes route
```

## Component Documentation

### NotesLayout.tsx
**Purpose**: Orchestrates the entire Notes experience

**Key Features**:
- Top navigation bar with back button
- Manages note selection and display
- Handles create, update, delete operations
- AI enhancement request handling
- State management

**Props**: None (uses `useNotes` hook internally)

**Usage**:
```tsx
import NotesLayout from '@/components/notes/NotesLayout'

<Route path="notes" element={<NotesLayout />} />
```

### NotesSidebar.tsx
**Purpose**: Displays list of notes and handles note selection

**Props**:
```tsx
interface NotesSidebarProps {
  notes: Note[]                           // Array of all notes
  selectedNoteId: string | null           // Currently selected note
  onSelectNote: (id: string) => void      // Callback when note selected
  onCreateNote: () => void                // Callback to create new note
  onDeleteNote: (id: string) => void      // Callback to delete note
  onRenameNote: (id: string, newTitle: string) => void  // Rename callback
}
```

**Features**:
- List all notes with timestamps (e.g., "2h ago")
- Hover to reveal rename/delete buttons
- Click note to select
- "New Note" button at top
- Empty state message

### NoteEditor.tsx
**Purpose**: Rich text editing with TipTap

**Props**:
```tsx
interface NoteEditorProps {
  note: Note | null                       // Currently selected note
  onUpdate: (id: string, updates: { title: string; content: string }) => void
  onAskAI?: () => void                    // Optional AI enhancement callback
}
```

**Features**:
- Edit title and content
- Auto-save on changes (500ms debounce)
- Save indicator with timestamp
- TipTap rich text editor
- "Ask AI ✨" button in toolbar

**Editor Support**:
- Headings (H1, H2)
- Bold, Italic
- Lists (bullet and numbered)
- Code blocks
- Proper Markdown output

### EditorToolbar.tsx
**Purpose**: Rich text formatting buttons

**Available Formatting**:
- Bold (Ctrl+B)
- Italic (Ctrl+I)
- Heading 1
- Heading 2
- Bullet List
- Ordered List
- Code Block
- Ask AI ✨ (optional)

### useNotes.ts Hook
**Purpose**: Centralized note management with localStorage persistence

**Interface**:
```tsx
interface Note {
  id: string              // Unique identifier
  title: string           // Note title
  content: string         // HTML content from TipTap
  createdAt: number       // Timestamp when created
  updatedAt: number       // Timestamp of last update
}
```

**Methods**:
```tsx
const {
  notes,                  // Array<Note> - all notes
  isLoading,             // boolean - loading state
  createNote,            // (title?: string) => Note
  updateNote,            // (id: string, updates: Partial<Note>) => void
  deleteNote,            // (id: string) => void
  getNoteById,           // (id: string) => Note | undefined
} = useNotes()
```

**Example Usage**:
```tsx
const { notes, createNote, updateNote } = useNotes()

// Create new note
const newNote = createNote('My Title')

// Update note
updateNote(newNote.id, {
  title: 'Updated Title',
  content: '<p>New content</p>'
})
```

## Styling & UI

### Color Scheme
- **Background**: White (#FFFFFF)
- **Text**: Dark gray (#111827 / gray-900)
- **Borders**: Light gray (#E5E7EB / gray-200)
- **Hover**: Subtle gray (#F3F4F6 / gray-100)
- **Active/Selected**: Light blue (#EFF6FF / blue-50)
- **Primary**: Dark (#111827 / gray-900)
- **Accent**: Blue (#3B82F6)

### Responsive Design
- **Desktop** (md+): Full split-screen sidebar + editor
- **Tablet/Mobile**: Stacked layout with sidebar taking 40vh at top
- **Mobile**: Full-width responsive

### Typography
- **Note Title**: 1.875rem (30px), Bold, Line-height 1.2
- **Sidebar Note Title**: 0.875rem (14px), Medium
- **Timestamp**: 0.75rem (12px), Muted

## Data Persistence

### localStorage Implementation
Currently uses browser localStorage for data persistence. Data is stored under the key:
```
Key: 'aviate_notes'
Format: JSON array of Note objects
```

### Swapping to Backend (Supabase/Firebase)

**Step 1**: Update `useNotes.ts` hook

Replace localStorage calls with your backend:

```tsx
// Replace loadNotes effect
useEffect(() => {
  const loadNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
      
      if (error) throw error
      setNotes(data)
    } catch (error) {
      console.error('Error loading notes:', error)
    } finally {
      setIsLoading(false)
    }
  }
  loadNotes()
}, [])

// Replace updateNote
const updateNote = useCallback(async (id: string, updates: Partial<Note>) => {
  try {
    const { error } = await supabase
      .from('notes')
      .update({ ...updates, updated_at: new Date() })
      .eq('id', id)
    
    if (error) throw error
    // Update local state
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n))
  } catch (error) {
    console.error('Error updating note:', error)
  }
}, [])
```

**Step 2**: Create Supabase migration

```sql
-- Create notes table
create table notes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  content text,
  created_at timestamp default now(),
  updated_at timestamp default now(),
  created_at_epoch bigint,
  updated_at_epoch bigint
);

-- Create index for faster queries
create index notes_user_id_updated_at on notes(user_id, updated_at desc);

-- Enable RLS
alter table notes enable row level security;

-- Create policy for users to see their own notes
create policy "Users can manage their own notes"
  on notes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

## AI Integration

### Quick Setup

**Option 1: Using OpenAI**

1. Add to `.env.local`:
```env
VITE_OPENAI_API_KEY=sk-...
```

2. Update `NotesLayout.tsx` `handleAskAI`:
```tsx
const handleAskAI = async () => {
  const selectedNote = getNoteById(selectedNoteId!)
  if (!selectedNote) return

  setIsAILoading(true)
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{
          role: 'user',
          content: `Expand on this note:\n\n${selectedNote.content}`,
        }],
      }),
    })
    
    const data = await response.json()
    updateNote(selectedNoteId!, {
      title: selectedNote.title,
      content: selectedNote.content + '\n\n' + data.choices[0].message.content,
    })
  } finally {
    setIsAILoading(false)
  }
}
```

**Option 2: Using Claude API**

See `src/pages/app/notes/example-ai-api.ts` for Claude implementation

**Option 3: Using Your Backend**

Create backend endpoint `/api/ai/enhance-note`:
```typescript
// Express.js example
app.post('/api/ai/enhance-note', async (req, res) => {
  const { content } = req.body
  
  // Call your AI service
  const enhancement = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: [{
      role: 'user',
      content: `Expand on: ${content}`,
    }],
  })
  
  res.json({ response: enhancement.choices[0].message.content })
})
```

## Customization

### Change Color Theme

Update Tailwind classes in components:

**NotesSidebar.tsx** - Change selected note color:
```tsx
// Change from blue to purple
selectedNoteId === note.id
  ? 'bg-purple-50 text-purple-900'  // Instead of blue-50
  : 'hover:bg-gray-100 text-gray-900'
```

**EditorToolbar.tsx** - Change button colors:
```tsx
// Change from blue to green
className="flex items-center gap-2 px-3 py-2 rounded bg-green-50 text-green-600 hover:bg-green-100"
```

### Add New Formatting Options

Add to `EditorToolbar.tsx`:

```tsx
// Add blockquote button
<ToolButton
  onClick={() => editor.chain().focus().toggleBlockquote().run()}
  isActive={editor.isActive('blockquote')}
  icon={Quote}  // Import from lucide-react
  title="Blockquote"
/>

// Add to StarterKit extensions in NoteEditor.tsx
import Blockquote from '@tiptap/extension-blockquote'

extensions: [
  StarterKit.configure({
    blockquote: {
      HTMLAttributes: {
        class: 'border-l-4 border-blue-500 italic pl-4',
      },
    },
  }),
]
```

### Add Keyboard Shortcuts

```tsx
// In NoteEditor.tsx editor configuration
const editor = useEditor({
  extensions: [StarterKit],
  editorProps: {
    attributes: {
      class: 'prose prose-sm max-w-none focus:outline-none',
    },
  },
})

// Add custom keyboard handlers
useEffect(() => {
  if (!editor) return
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.metaKey && e.key === 's') {
      e.preventDefault()
      // Save manually
    }
  }
  
  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [editor])
```

### Add Tags/Labels

Extend Note interface:
```tsx
interface Note extends BaseNote {
  tags: string[]  // Add this
  color?: string  // Optional: color coding
}

// In NotesSidebar.tsx
{note.tags.map(tag => (
  <span key={tag} className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 mr-1">
    {tag}
  </span>
))}
```

## Performance Optimization

### Debouncing
Currently uses 500ms debounce for auto-save. Adjust in `NoteEditor.tsx`:

```tsx
// Reduce debounce for faster saves
setTimeout(() => {
  onUpdate(note.id, { title, content: editor.getHTML() })
}, 300)  // Changed from 500

// Or use a debounce utility
import { debounce } from 'lodash'
const debouncedUpdate = debounce((updates) => onUpdate(note.id, updates), 1000)
```

### Memoization

Wrap components to prevent unnecessary re-renders:
```tsx
const NoteEditor = React.memo(({ note, onUpdate, onAskAI }) => {
  // component code
})
```

### Virtual Scrolling (for many notes)

For apps with 1000+ notes, add virtual scrolling:
```tsx
import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={600}
  itemCount={notes.length}
  itemSize={80}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      {/* Render note item */}
    </div>
  )}
</FixedSizeList>
```

## Troubleshooting

### Notes Not Saving
1. Check browser DevTools Storage tab for `aviate_notes` key
2. Verify localStorage is enabled
3. Check browser console for errors
4. Try clearing localStorage: `localStorage.removeItem('aviate_notes')`

### Editor Not Showing Content
1. Ensure TipTap extensions are properly imported
2. Check that content is valid HTML
3. Verify `editor.getHTML()` is working in console

### AI Button Not Working
1. Check API keys in `.env.local`
2. Verify CORS headers if calling external API
3. Check network tab in DevTools for API response
4. See example-ai-api.ts for proper setup

### Responsive Layout Issues
1. Verify Tailwind CSS classes are compiling
2. Check media query breakpoints (max-width: 768px)
3. Test on actual mobile devices, not just browser DevTools

## Dependencies

Already installed:
- `@tiptap/react` - Rich text editor
- `@tiptap/starter-kit` - Editor extensions
- `@tiptap/pm` - ProseMirror (required by TipTap)
- `lucide-react` - Icons
- `react-router-dom` - Navigation
- `framer-motion` - Animations (optional, already in your project)

## Future Enhancements

### Short Term
- [ ] Search/filter notes by title or content
- [ ] Sort notes (by date, alphabetical, custom)
- [ ] Note templates
- [ ] Collaborative editing (multiple users)
- [ ] Export to PDF/Markdown

### Medium Term
- [ ] Note categories/folders
- [ ] Pinned notes
- [ ] Share individual notes
- [ ] Full-text search with highlighting
- [ ] Note version history
- [ ] Rich media (images, video, embeds)

### Long Term
- [ ] Offline-first sync with backend
- [ ] AI-powered summaries
- [ ] Smart suggestions and linking
- [ ] Advanced formatting (tables, diagrams)
- [ ] Multi-device sync
- [ ] Team collaboration features

## Support & Resources

- **TipTap Docs**: https://tiptap.dev/
- **React Hooks**: https://react.dev/reference/react/hooks
- **Tailwind CSS**: https://tailwindcss.com/
- **Lucide Icons**: https://lucide.dev/

---

**Status**: ✅ Complete & Ready to Use
**Last Updated**: October 28, 2025
**Version**: 1.0.0
