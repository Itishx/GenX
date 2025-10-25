# Teammate Activity Tracking Feature

## Overview

The Teammate Activity feature allows team members to view what their colleagues are working on—including recent actions, progress updates, and AI-generated summaries—all from within the project settings panel.

## 🎯 Feature Highlights

### 1. **Activity Feed**
- Vertical list of activities sorted by latest first
- Each card shows:
  - **Activity Icon**: Visual indicator (✅ completed, 🚀 started, ✏️ edited, etc.)
  - **Teammate Info**: Avatar + name with gradient background
  - **Timestamp**: "2 hours ago" relative time format
  - **Activity Title**: Short, specific action description
  - **Progress Metric**: Chip showing progress (+12%, Completed Stage 2, etc.)
  - **AI Summary**: 1-2 line description of what was done

### 2. **Time Period Filtering**
Filter activities by:
- **Last 24h**: Recent activity from the past day
- **This Week**: Activities from the past 7 days
- **All Time**: Complete activity history

### 3. **Project Progress Summary** (Right Panel)
Auto-generated insights including:
- **Summary Text**: AI-generated overview of team activity
- **Statistics**: Total actions & unique contributors
- **Key Milestones**: Top completed stages or achievements
- **Generate Full Report**: Export detailed timeline as PDF

## 📍 How to Access

### Opening Teammate Activity

1. Go to `/app/agents` (Project Workspace)
2. Look at the left sidebar with your projects
3. Hover over a project card to reveal the **⚙️ Settings icon**
4. Click the settings icon to open the dropdown menu
5. Select **"View Activity"** (at the top of the menu)
6. The **Teammate Activity** modal opens

### Activity Modal Layout

```
┌─────────────────────────────────────────────────────────┐
│  Teammate Activity                           [Close]     │
│  See what your team's been working on                   │
│                                                          │
│  Filter: [Last 24h] [This Week] [All Time]              │
├──────────────────────┬──────────────────────────────────┤
│                      │                                  │
│  Activity Feed       │  Project Progress Summary        │
│  (Left Panel)        │  (Right Panel)                   │
│                      │                                  │
│  ✅ Aanya Sharma    │  Summary Text                    │
│     Edited the       │  📊 Stats                       │
│     product          │  🏆 Key Milestones              │
│     validation       │  [Generate Full Report]          │
│     framework.       │                                  │
│     1 hour ago       │                                  │
│     +12%             │                                  │
│                      │                                  │
│  ✏️ James Chen       │                                  │
│     Added research   │                                  │
│     notes on market  │                                  │
│     trends.          │                                  │
│     3 hours ago      │                                  │
│                      │                                  │
└──────────────────────┴──────────────────────────────────┘
```

## 🗄️ Database Schema

### activity_log Table
```sql
CREATE TABLE activity_log (
  id UUID PRIMARY KEY,
  project_id UUID,                    -- Links to project
  user_id UUID,                       -- Team member who performed action
  activity_type TEXT,                 -- Type of activity (see below)
  activity_title TEXT,                -- Short title: "Edited product validation"
  activity_description TEXT,          -- AI summary: "Aanya refined the audience persona..."
  metadata JSONB,                     -- Custom data per activity type
  progress_metric TEXT,               -- "+12%", "Completed Stage 2", etc.
  created_at TIMESTAMP,               -- When activity occurred
  updated_at TIMESTAMP
);
```

### Activity Types
- `stage_completed` - ✅ Completed a stage/milestone
- `stage_started` - 🚀 Started working on a stage
- `content_edited` - ✏️ Modified project content
- `note_added` - 📝 Added notes or comments
- `file_uploaded` - 📁 Uploaded files
- `collaboration_invited` - 👥 Invited teammates
- `feedback_given` - 💬 Provided feedback
- `research_added` - 🔍 Added research findings
- `custom_action` - ⚡ Custom action

### activity_summary Table
```sql
CREATE TABLE activity_summary (
  id UUID PRIMARY KEY,
  project_id UUID,                    -- Links to project
  summary_text TEXT,                  -- AI-generated summary
  time_period TEXT,                   -- '24h', 'week', or 'all_time'
  total_actions INT,                  -- Count of activities
  unique_contributors INT,            -- Number of team members
  key_milestones TEXT[],              -- Array of top achievements
  generated_at TIMESTAMP
);
```

## 🔐 Row-Level Security

All activity data is protected with RLS policies:

```sql
-- Users can only see activities from projects they own or collaborate on
CREATE POLICY "Users can view activities from projects they collaborate on"
  ON activity_log FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
      UNION
      SELECT project_id FROM project_collaborators WHERE user_id = auth.uid()
    )
  );
```

## 🛠️ Integration Points

### Adding Activity Logs

When a team member performs an action, log it:

```typescript
// Example: Log when someone completes a stage
await supabase.from('activity_log').insert({
  project_id: activeProjectId,
  user_id: user.id,
  activity_type: 'stage_completed',
  activity_title: 'Completed Stage 4: Audience Research',
  activity_description: 'Aanya finished defining target audience personas and validated them with survey data.',
  progress_metric: 'Stage 4/7',
  metadata: {
    stage_id: 'stage-4',
    stage_name: 'Audience Research',
  },
});
```

### Generating Summaries

The component auto-generates summaries if none exist in the database. For production, integrate an AI service:

```typescript
// In TeammateActivityModal.tsx - handleGenerateReport function
const generateAISummary = async (activities: Activity[]) => {
  // Call your AI API (OpenAI, Anthropic, etc.)
  const response = await fetch('/api/generate-summary', {
    method: 'POST',
    body: JSON.stringify({
      activities,
      timePeriod,
      projectName,
    }),
  });
  
  return response.json();
};
```

## 📊 Component Files

### TeammateActivityModal.tsx
- **Purpose**: Main modal component for viewing activities
- **Features**: 
  - Activity feed with filtering
  - Real-time data loading from Supabase
  - Progress summary generation
  - Report export placeholder
- **Props**:
  - `open`: Boolean to show/hide modal
  - `onClose`: Callback when modal closes
  - `projectId`: UUID of the project
  - `projectName`: Display name of project

### ProjectSidebar.tsx
- **Updated**: Added "View Activity" option to settings menu
- **New Prop**: `onViewActivity?: (project: Project) => void`
- **Behavior**: Settings menu now shows activity option above Edit/Delete

### ProjectWorkspace.tsx
- **Updated**: Added activity modal state and handlers
- **New State**: `activityModalOpen`
- **New Handler**: `handleViewActivity()`
- **Integration**: Passes activity modal to render

## 🚀 Database Deployment

Run the migration to create activity tracking tables:

```bash
# Option 1: Supabase Dashboard
# 1. Go to SQL Editor
# 2. Create new query
# 3. Paste this:
psql -h your-host -U postgres -d postgres -f supabase_migrations_001_create_projects.sql
```

Or run the SQL directly in Supabase dashboard.

## 📈 Usage Scenarios

### Scenario 1: Team Lead Checks Progress
1. Open workspace
2. Click settings ⚙️ on a project
3. Select "View Activity"
4. See what all team members accomplished this week
5. Click "Generate Full Report" to share with stakeholders

### Scenario 2: Catching Up After Time Off
1. Select project
2. Open activity modal
3. Filter to "All Time"
4. Quickly understand the project progression
5. See key milestones achieved

### Scenario 3: Performance Tracking
1. View activities from "This Week"
2. See individual contributions
3. Track progress metrics
4. Identify bottlenecks or delays

## 🎨 UI/UX Details

### Activity Icons
Each activity type has a unique emoji for visual scanning:
- ✅ = Completed
- 🚀 = Started
- ✏️ = Edited
- 📝 = Notes
- 📁 = Files
- 👥 = Collaboration
- 💬 = Feedback
- 🔍 = Research
- ⚡ = Custom

### Color Coding
Progress metrics are color-coded by activity type:
- Green: Completed/Success
- Blue: Started/In Progress
- Purple: Edited/Modified
- Yellow: Notes
- Orange: Files
- Pink: Collaboration
- Indigo: Feedback
- Cyan: Research

### Time Format
Timestamps display as relative time:
- "just now" (< 1 minute)
- "5m ago" (< 1 hour)
- "2h ago" (< 24 hours)
- "3d ago" (< 7 days)
- "Oct 15" (> 1 week)

## ⚙️ Next Steps & Enhancements

### 1. **Activity Logging System**
Create a helper function to log activities throughout the app:

```typescript
// utils/activityLogger.ts
export const logActivity = async (
  projectId: string,
  userId: string,
  activityType: string,
  title: string,
  description?: string,
  metric?: string
) => {
  const { error } = await supabase.from('activity_log').insert({
    project_id: projectId,
    user_id: userId,
    activity_type: activityType,
    activity_title: title,
    activity_description: description,
    progress_metric: metric,
  });

  if (error) console.error('Activity log error:', error);
};
```

### 2. **Real-time Updates with Supabase Realtime**
```typescript
// Listen for new activities
const subscription = supabase
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'activity_log' },
    (payload) => {
      // Add new activity to feed
      setActivities((prev) => [payload.new, ...prev]);
    }
  )
  .subscribe();
```

### 3. **AI Summary Generation**
Integrate with OpenAI or Claude:
```typescript
// Call AI to generate human-friendly summaries
const aiSummary = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [{
    role: "user",
    content: `Summarize this project activity: ${JSON.stringify(activities)}`
  }]
});
```

### 4. **PDF Report Export**
Use a library like jsPDF or Puppeteer:
```typescript
import jsPDF from 'jspdf';

const generatePDF = (activities: Activity[], summary: any) => {
  const doc = new jsPDF();
  // Add activity timeline, charts, summary
  doc.save('project-report.pdf');
};
```

### 5. **Activity Notifications**
Send real-time notifications to teammates:
- Browser notifications
- Email digests
- Slack/Teams integration

### 6. **Activity Analytics Dashboard**
Add charts and metrics:
- Contribution graph (who did what)
- Timeline visualization
- Milestone tracker
- Team velocity metrics

## 🧪 Testing Checklist

- [ ] Activity modal opens from project settings menu
- [ ] Time period filters work (24h, week, all_time)
- [ ] Activities load and display correctly
- [ ] User avatars and names show properly
- [ ] Progress metrics display with correct colors
- [ ] "No activities" state shows when empty
- [ ] Summary section displays statistics
- [ ] Generate Report button works
- [ ] Modal closes properly
- [ ] Data loads only for accessible projects
- [ ] RLS prevents unauthorized access
- [ ] Timestamps format correctly

## 🔍 Troubleshooting

**"Permission denied" error**
- Check RLS policies are enabled on activity tables
- Verify user is project owner or collaborator
- Check auth context is properly initialized

**Activities not appearing**
- Verify activities are being logged to database
- Check time period filter isn't too restrictive
- Ensure user has access to project
- Check browser console for errors

**Modal won't open**
- Verify TeammateActivityModal is imported in ProjectWorkspace
- Check that `onViewActivity` handler is defined
- Ensure project is selected before opening

**Slow loading**
- Add database indexes (already included in migration)
- Limit activities query to reasonable time range
- Consider pagination for large datasets
