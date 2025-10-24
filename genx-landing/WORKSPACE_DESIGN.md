# Aviate Workspace (Stage Chat + Canvas View)

## Overview

The Aviate Workspace is a split-screen, collaborative thinking environment where users chat with an AI co-pilot on the left while building a live, visual report on the right. This design brings together conversation, creation, and clarity in a single, seamless workspace.

## Architecture

### Component Structure

```
src/components/stage/
├── StageNavbar.tsx          # Top navigation with stage name & export PDF
├── ChatPanel.tsx            # Left panel - AI conversation interface
├── CanvasPanel.tsx          # Right panel - dynamic insights visualization
└── StageWorkspace.tsx       # Main container orchestrating both panels

src/pages/landing/
└── StageDetail.tsx          # Route handler for individual stage workspaces
```

### Routing

- **Route**: `/foundry/:stageId`
- **Supported Stages**: ignite, explore, empathize, differentiate, architect, validate, construct, align
- **Example**: `/foundry/ignite` → Opens the Ignite stage workspace

## Features

### 1. Split-Screen Layout

**Left Panel (Chat Interface)**
- AI co-pilot conversation interface
- User messages displayed in dark bubbles (right-aligned)
- AI responses in light bubbles with borders (left-aligned)
- "Add to Canvas" button on each AI message
- Loading state with animated dots
- Fixed input bar with Send button
- Auto-scroll to latest message

**Right Panel (Dynamic Canvas)**
- Visual representation of insights collected from the chat
- Color-coded insight cards by type:
  - 💡 Insight (blue)
  - 🎯 Pain Point (red)
  - ✨ Idea (purple)
  - 👤 Persona (green)
  - 📊 Market (amber)
  - 🎯 Next Step (indigo)
- Smooth animations when insights are added/removed
- Hover to reveal remove button
- Timestamp for each insight
- Empty state with guidance

**Top Navigation**
- Back button to return to FoundryOS overview
- Stage name and "Stage Workspace" subtitle
- Export PDF button with loading state
- Clean, minimal design

### 2. Chat Interactions

**User Messages**
- Type questions or ideas about the current stage
- Press Enter to send (Shift+Enter for new line)
- Disabled during AI response loading

**AI Responses**
- Context-aware responses based on the stage
- Each response includes stage-specific guidance
- "Add to Canvas" button below each message
- Confirmation animation when added (changes to checkmark for 2 seconds)

### 3. Canvas Management

**Adding Insights**
- Click "Add to Canvas" on any AI message
- System automatically extracts title and description
- Insight type is inferred from message content
- Toast notification confirms addition
- Smooth slide-in animation

**Removing Insights**
- Hover over any card to reveal remove button
- Click to delete
- Smooth fade-out animation
- Card count updates in header

**Organizing Insights**
- Cards stack vertically in order added
- Independent scrolling from chat
- Clean grid layout with consistent spacing

### 4. Export to PDF

**Export Functionality**
- Click "Export PDF" button in top navigation
- Generates professional document with:
  - Stage name as title
  - Stage description
  - Export date/time
  - All canvas insights formatted as cards
  - Brand-aligned design (clean, professional)
- Downloads as `{stagename}-workspace-{date}.pdf`

## File Descriptions

### StageNavbar.tsx
- Persistent top bar (fixed positioning, z-index: 30)
- Back navigation to `/foundryos/get-started`
- Dynamic PDF export with html2pdf.js
- Queries `[data-canvas-export]` DOM element for content
- Loading state during export

### ChatPanel.tsx
- Manages chat message state and UI
- Message types: User (dark) and AI (light)
- Auto-scroll on new messages
- Tracks which messages have been added (for confirmation state)
- Input bar with Send button and keyboard support
- Empty state with guidance

**Exported Interfaces:**
- `ChatMessage`: { id, role, content, timestamp }

### CanvasPanel.tsx
- Displays array of insights in auto-layout grid
- Type-based styling with icons and colors
- Smooth add/remove animations with Framer Motion
- Hover-to-reveal remove button
- Empty state guidance
- Footer info about export functionality

**Exported Interfaces:**
- `CanvasInsight`: { id, title, description, type, messageId, addedAt }

### StageWorkspace.tsx
- Orchestrates Chat and Canvas panels
- Manages messages and insights state
- Mock AI response generation (ready for real API)
- Insight extraction logic (title, description, type inference)
- Handles Add/Remove operations
- Responsive layout (full split-screen on desktop, mobile optimization)

**Features:**
- Framer Motion entry animations for both panels
- Mobile canvas drawer (bottom sheet style)
- Event dispatch for toast notifications

### StageDetail.tsx
- Route parameter handler (`/foundry/:stageId`)
- Stage lookup with validation
- Redirects to `/foundryos/get-started` if stage not found
- Passes stage info to StageWorkspace

## Styling & Design

### Color Palette
- Background: Off-white (`#fafafa`), White (`#ffffff`)
- Text: Dark gray (`#111111`), Gray (`#666666`), Light gray (`#999999`)
- Borders: Light gray (`#e8e8e8`)
- Accents: Blue, Red, Purple, Green, Amber, Indigo (for insight types)

### Typography
- Headings: Semibold to bold
- Body: Regular, medium
- Labels: Small, extra-small (10-12px)

### Spacing
- Base unit: 4px (Tailwind default)
- Panels: 6px padding (`px-6 py-4`)
- Cards: 4px padding (`p-4`)

### Animations
- Entry: Fade + Slide (200-400ms)
- Interactions: Scale + Opacity (100-200ms)
- Transitions: Smooth, spring-based for delightful feel

## State Management

### Messages State
```typescript
const [messages, setMessages] = useState<ChatMessage[]>([])
```
- Array of chat messages
- Each message has unique ID, role, content, timestamp

### Insights State
```typescript
const [insights, setInsights] = useState<CanvasInsight[]>([])
```
- Array of canvas insights
- Automatically organized in display order
- Tied to source message ID

### Loading State
```typescript
const [isLoading, setIsLoading] = useState(false)
```
- True while AI response generating
- Disables input during loading
- Shows typing indicator

## Mock AI Integration

The workspace includes mock AI response generation ready for real API integration:

```typescript
const generateAIResponse = (userMessage: string): string => {
  const responses: Record<string, string[]> = {
    ignite: [...],
    explore: [...],
    // etc
  }
}
```

**To integrate real AI:**
1. Replace `generateAIResponse` function with API call to your backend
2. Update `handleSendMessage` callback to await real API response
3. Maintain the same `ChatMessage` interface

## Mobile Responsiveness

- **Desktop (md+)**: Full split-screen (50/50), both panels visible
- **Mobile**: Stacked layout, chat full-width with canvas drawer at bottom
- **Canvas Drawer**: Fixed bottom sheet, 48px height, scrollable
- All interactions remain functional on mobile

## Future Enhancements

1. **Real AI Integration**: Connect to actual LLM API
2. **Persistence**: Save conversations and canvas to backend
3. **Collaboration**: Real-time multi-user editing with WebSockets
4. **Templates**: Pre-filled canvas templates for each stage
5. **Export Options**: More formats (Word, HTML, Markdown)
6. **AI Customization**: Fine-tune responses based on user preferences
7. **Search**: Search through canvas insights
8. **Categories**: Group insights into collapsible sections
9. **Sharing**: Generate shareable links to workspaces
10. **Analytics**: Track which insights users find most valuable

## Dependencies

- `react`: UI library
- `react-router-dom`: Routing
- `framer-motion`: Animations
- `react-icons`: Icons (FiSend, FiPlus, etc.)
- `html2pdf.js`: PDF export
- `tailwindcss`: Styling

## Development Tips

### Testing the Workspace
1. Navigate to `/foundry/ignite` (or any valid stage)
2. Type a question in the chat input
3. Wait for AI response (~800ms delay for demo)
4. Click "Add to Canvas" on the response
5. Watch it appear on the right panel
6. Click "Export PDF" to download

### Customizing Responses
Edit `generateAIResponse` in `StageWorkspace.tsx` to change the mock AI responses per stage.

### Adjusting Animations
All animations use Framer Motion with configurable:
- `duration`: Animation speed
- `delay`: Stagger effect
- `transition`: Spring, tween, or ease-out
- `initial/animate/exit`: Animation states

### Styling
All components use Tailwind CSS classes. Customize via:
- Direct class modifications
- Tailwind config updates
- CSS custom properties for dynamic values

## Performance Considerations

- Messages and insights are efficiently managed with React keys
- Animations use GPU acceleration (transform, opacity)
- Canvas scrolling is independent from chat
- PDF export runs asynchronously to prevent blocking
- Mock AI response uses setTimeout (replace with real async API call)

---

**Version**: 1.0.0  
**Last Updated**: October 24, 2025  
**Status**: Production Ready (with mock AI)
