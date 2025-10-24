# Aviate Workspace Implementation Guide

## Quick Start

### 1. Access the Workspace
Navigate to any stage workspace:
- `/foundry/ignite` - Ignite stage
- `/foundry/explore` - Explore stage
- `/foundry/empathize` - Empathize stage
- `/foundry/differentiate` - Differentiate stage
- `/foundry/architect` - Architect stage
- `/foundry/validate` - Validate stage
- `/foundry/construct` - Construct stage
- `/foundry/align` - Align stage

### 2. Using the Chat Interface
1. **Type your question** in the input bar at the bottom left
2. **Press Enter** to send (Shift+Enter for multiline)
3. **Wait for AI response** (~800ms with mock AI)
4. **Review the response** in the chat bubble
5. **Click "Add to Canvas"** to extract and save the insight

### 3. Managing Canvas Insights
- **View**: All insights appear as color-coded cards on the right panel
- **Remove**: Hover over any card and click the X button
- **Organize**: Cards are automatically organized in the order they're added
- **Export**: Click "Export PDF" in the top navigation

## Component Integration Points

### If You Want to Integrate Real AI

In `src/components/stage/StageWorkspace.tsx`, replace the `generateAIResponse` function:

```typescript
// Replace this mock function:
const generateAIResponse = (userMessage: string): string => {
  // ... mock responses
}

// With your real API call:
const generateAIResponse = async (userMessage: string): Promise<string> => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      message: userMessage,
      stage: stageId 
    })
  });
  const data = await response.json();
  return data.response;
}
```

Then update `handleSendMessage` to use `await`:

```typescript
const handleSendMessage = useCallback(async (content: string) => {
  // ... existing user message code
  
  setIsLoading(true)
  
  try {
    const aiResponse = await generateAIResponse(content)
    // ... rest of the code
  } catch (error) {
    console.error('AI response failed:', error)
  } finally {
    setIsLoading(false)
  }
}, [stageName])
```

### If You Want to Persist Data

Add to your backend API endpoints:

1. **Save Conversation**
   - POST `/api/workspaces/:stageId/conversations`
   - Payload: `{ messages: ChatMessage[] }`

2. **Save Canvas Insights**
   - POST `/api/workspaces/:stageId/canvas`
   - Payload: `{ insights: CanvasInsight[] }`

3. **Load Saved Session**
   - GET `/api/workspaces/:stageId`
   - Response: `{ messages, insights, lastUpdated }`

Then update `StageWorkspace.tsx` to fetch and sync:

```typescript
useEffect(() => {
  // Load saved data on mount
  const loadWorkspace = async () => {
    const response = await fetch(`/api/workspaces/${stageId}`);
    const data = await response.json();
    setMessages(data.messages);
    setInsights(data.insights);
  };
  loadWorkspace();
}, [stageId]);

// Auto-save on changes
useEffect(() => {
  // Debounce save to avoid too many requests
  const timer = setTimeout(() => {
    saveWorkspace();
  }, 1000);
  return () => clearTimeout(timer);
}, [messages, insights]);
```

## Customization Options

### Change Insight Types
Edit the `typeConfig` in `src/components/stage/CanvasPanel.tsx`:

```typescript
const typeConfig: Record<CanvasInsight['type'], {...}> = {
  'insight': { color: 'text-blue-600', bgColor: 'bg-blue-50', label: 'Insight', icon: '💡' },
  // Add more types here
}
```

### Customize Animations
All animations are in component files using Framer Motion. Example:

```typescript
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}  // Adjust timing
>
  {/* Content */}
</motion.div>
```

### Modify Colors & Spacing
All styles use Tailwind classes. Edit directly in component classNames or update `tailwind.config.ts`:

```typescript
// In component:
className="px-6 py-4"  // Adjust padding
className="bg-gray-50"  // Change background

// In tailwind.config.ts:
theme: {
  extend: {
    colors: {
      // Add custom colors
    },
    spacing: {
      // Add custom spacing
    }
  }
}
```

## Testing Checklist

- [ ] Navigate to `/foundry/ignite`
- [ ] Chat interface loads without errors
- [ ] Type a message and send it
- [ ] AI response appears after ~800ms
- [ ] "Add to Canvas" button appears on AI message
- [ ] Click "Add to Canvas" and insight appears on right panel
- [ ] Hover over insight card and remove button appears
- [ ] Click remove button and card disappears smoothly
- [ ] Click "Export PDF" and download starts
- [ ] Try other stages (explore, empathize, etc.)
- [ ] Test on mobile - canvas drawer appears at bottom

## Common Customizations

### Change the AI Response Delay
In `StageWorkspace.tsx`:
```typescript
setTimeout(() => {
  // Change 800 to your desired milliseconds
}, 800)
```

### Change PDF Filename Format
In `StageNavbar.tsx`:
```typescript
const filename = `${stageName.toLowerCase()}-workspace-${new Date().toISOString().split('T')[0]}.pdf`
// Customize the format as needed
```

### Modify Toast Notification
The workspace dispatches a custom event. To add a real toast library:

```typescript
// Install: npm install react-hot-toast
import toast from 'react-hot-toast';

// In handleAddToCanvas:
toast.success('Insight added to canvas!');
```

### Change the "Add to Canvas" Button Text
In `ChatPanel.tsx`:
```typescript
<FiPlus className="w-4 h-4" />
Add to Canvas  {/* Change this text */}
```

## Troubleshooting

### Canvas Panel Not Showing on Desktop
- Check that the screen width is `md` or larger (768px+)
- Verify `className="hidden md:flex w-1/2"` is present

### Messages Not Scrolling to Bottom
- Check that `messagesEndRef` is properly placed and `useEffect` hook is firing
- Verify `scrollToBottom()` function is defined

### PDF Export Not Working
- Ensure `html2pdf.js` is installed: `npm list html2pdf.js`
- Check browser console for errors
- Verify `[data-canvas-export]` element exists in DOM

### AI Response Not Appearing
- Check browser console for errors
- Verify `setTimeout` delay hasn't been set to 0 or negative
- Ensure `isLoading` state is being reset

### Styling Issues
- Clear Tailwind CSS cache if classes aren't applying
- Run `npm run build` to verify Tailwind generation
- Check browser DevTools for conflicting styles

## Performance Tips

1. **Optimize Images**: Use WebP format for icons and imagery
2. **Lazy Load**: Load the StageWorkspace component only when needed
3. **Memoize Callbacks**: Use `useCallback` for handlers (already implemented)
4. **Debounce Saves**: If auto-saving to backend, use debounce utility
5. **Virtual Scrolling**: For many insights (100+), implement virtual scrolling

## Accessibility

The workspace includes:
- Semantic HTML structure
- Keyboard navigation (Enter to send, Tab through elements)
- ARIA labels on buttons (title attributes)
- Color contrast ratios meeting WCAG AA

To further improve:
1. Add `aria-label` attributes to buttons
2. Use `aria-live="polite"` for dynamic content
3. Test with screen readers
4. Ensure focus indicators are visible

---

**Need Help?** Check the component JSDoc comments or refer to `WORKSPACE_DESIGN.md` for comprehensive documentation.
