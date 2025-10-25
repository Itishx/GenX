# Project-Based Workspace System Implementation Guide

## 🚀 Overview

The `/app/agents` page has been redesigned to introduce a **project-based workspace system**. Users can now create, manage, and switch between up to **two projects** at a time, each linked to an operating system (FoundryOS or LaunchOS).

## 📋 Implementation Summary

### New Components Created

1. **ProjectWorkspace.tsx** - Main orchestrator component
   - Manages project state and database operations
   - Handles project creation, selection, and navigation
   - Loads projects from Supabase with RLS protection
   - Limits users to 2 projects maximum

2. **ProjectModal.tsx** - Project creation/configuration modal
   - Form fields: Project Name, Description, Industry, Goal
   - OS selection with visual cards (FoundryOS/LaunchOS)
   - Validation and error handling
   - Smooth animations and interactions

3. **ProjectSidebar.tsx** - Left sidebar navigation
   - Displays all user projects in a vertical list
   - Shows OS type with icon indicators
   - Active project highlighting with orange accent
   - User profile section at bottom with sign-out option
   - Project cards with hover effects

4. **ProjectTabs.tsx** - Top navigation bar
   - Shows active project name on left
   - Tab navigation in center (max 2 projects)
   - Action buttons on right: Export & New Project
   - Smooth tab switching with layout animations
   - Orange gradient highlight for active tab

5. **EmptyProjectState.tsx** - Empty state UI
   - Shown when no projects exist
   - Centered call-to-action card
   - Animated folder icon with floating effect
   - Clear messaging and single button to create project

### Database Schema

**Projects Table** (`projects`)
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key to auth.users)
- name (TEXT, Required)
- description (TEXT, Optional)
- industry (TEXT, Optional)
- goal (TEXT, Optional)
- os (TEXT, Enum: 'foundryos' | 'launchos')
- is_active (BOOLEAN, Default: true)
- created_at (TIMESTAMP, Default: now())
- updated_at (TIMESTAMP, Default: now())
```

**Key Features:**
- Row-Level Security (RLS) policies for user data isolation
- Indexes on `user_id` and `created_at` for performance
- Automatic `updated_at` timestamp with trigger
- Unique constraint on `(user_id, name)` to prevent duplicate project names

## 🎨 Design System Integration

### Color Scheme
- **Primary Orange Gradient**: `from-[#ff6b00] to-[#ff9248]` (orange-500 to orange-600)
- **Accent Colors**: Orange for active states, interactive elements
- **Base Colors**: White backgrounds, gray text (#111111, #555555, #999999)
- **Border Colors**: Light amber (#eaeaea), subtle shadows

### Typography & Spacing
- Clean, minimal interface with consistent rounded corners (`rounded-2xl`, `rounded-lg`)
- Smooth transitions (`transition-all ease-in-out 250ms`)
- Hover effects with subtle lift (`hover:translate-y-[-2px]`)
- Responsive design with mobile-first approach

## 🔄 User Flow

### 1. First Time User
```
Visit /app/agents 
→ Empty state with "Create your first project" card
→ Click "Create Project"
→ Fill modal form (name, description, industry, goal, OS selection)
→ Click "Continue"
→ Project created and stored in database
→ Navigate to selected OS workspace (/foundryos/get-started or /launchos/get-started)
```

### 2. Existing User with Projects
```
Visit /app/agents
→ Sidebar shows list of projects (max 2)
→ Active project highlighted in orange
→ Click different project in sidebar to switch
→ Top tabs show active projects with smooth transition
→ Can create new project if under limit of 2
→ Export button available to download project data
```

### 3. Project Management
- **Create**: Max 2 projects per user enforced at UI and database level
- **Switch**: Click project in sidebar or tabs to switch
- **Export**: Download project metadata as JSON
- **Delete**: Can be added via delete button if needed (not in current MVP)

## 🔐 Security Implementation

### Row-Level Security (RLS)
All database operations are protected by RLS policies:
- Users can only view their own projects
- Users can only create projects for themselves
- Users can only update/delete their own projects
- Enforced at database level for maximum security

### Data Flow
```
Frontend (ProjectWorkspace.tsx)
    ↓
Supabase Client (with auth token)
    ↓
RLS Policies (verify auth.uid() = user_id)
    ↓
Database (projects table)
```

## 🛠️ Setup Instructions

### 1. Database Migration
Run the provided SQL migration in your Supabase SQL editor:

```bash
# Copy the contents of: supabase_migrations_001_create_projects.sql
# Paste into Supabase Dashboard → SQL Editor → New Query
# Execute the query
```

### 2. Update Environment Variables
Ensure your `.env.local` has Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Import Components
The `Agents.tsx` file now uses the new `ProjectWorkspace` component:
```typescript
import ProjectWorkspace from '@/components/ProjectWorkspace'

const Agents: React.FC = () => {
  return <ProjectWorkspace />
}
```

### 4. Start Development Server
```bash
npm run dev
# Navigate to http://localhost:5173/app/agents
```

## 🎯 Key Features

### ✅ Completed
- [x] Project creation with modal form
- [x] Project listing in sidebar
- [x] Project switching with navigation
- [x] Top navigation with tabs (max 2 projects)
- [x] Empty state UI
- [x] Export functionality (JSON)
- [x] User profile section with sign-out
- [x] Database schema with RLS
- [x] Responsive design
- [x] Smooth animations with Framer Motion
- [x] Orange gradient accent throughout
- [x] Clean, minimal design system

### 🔄 Next Steps (Optional Enhancements)
- [ ] Delete project functionality
- [ ] Edit project details
- [ ] Project sharing/collaboration
- [ ] Project templates
- [ ] Duplicate project
- [ ] Project archival
- [ ] Workspace notifications
- [ ] Recent activity log
- [ ] Search/filter projects

## 📱 Responsive Behavior

### Desktop
- Sidebar: 256px fixed left panel
- Main content: Full remaining width
- Tabs: Horizontal tab navigation with project names

### Tablet/Mobile (Future Enhancement)
- Sidebar could collapse into drawer
- Tabs become dropdown selector
- Mobile-optimized spacing and touch targets

## 🐛 Troubleshooting

### Projects Not Loading
1. Check Supabase connection in console
2. Verify RLS policies are correctly set
3. Ensure user is authenticated

### Modal Not Submitting
1. Verify form validation (name and OS required)
2. Check browser console for errors
3. Ensure database write permissions

### Navigation Not Working
1. Verify React Router setup
2. Check navigation paths: `/foundryos/get-started`, `/launchos/get-started`
3. Ensure route definitions exist in main App router

## 📚 File Structure

```
src/components/
├── ProjectWorkspace.tsx      (Main orchestrator)
├── ProjectModal.tsx          (Creation form)
├── ProjectSidebar.tsx        (Left navigation)
├── ProjectTabs.tsx           (Top navigation)
├── EmptyProjectState.tsx     (Empty state UI)
└── [other components...]

src/pages/app/
└── Agents.tsx                (Entry point, now uses ProjectWorkspace)

Database:
└── supabase_migrations_001_create_projects.sql
```

## 🎬 Animation Details

### Transitions
- **Tab Switching**: Spring animation, 250ms ease-in-out
- **Project Selection**: Smooth opacity fade, scale 1.02 on hover
- **Modal**: Scale from 0.96 to 1, 150ms ease-out
- **Sidebar**: Slide in from left, 200ms duration
- **Empty State Icon**: Floating animation, 3s loop

### Hover Effects
- Buttons: Scale 1.02-1.05, shadow increase
- Project Cards: Border color change, background lift
- Tabs: Scale with smooth transition

## 🔮 Future Integration Points

### Connected to:
- `/foundryos/get-started` - FoundryOS workspace
- `/launchos/get-started` - LaunchOS workspace
- Auth context for user management
- Supabase for data persistence

### Extensible for:
- Project analytics dashboard
- Team collaboration features
- Version history
- Comments/feedback system
- File attachments

---

**Status**: ✅ MVP Complete and Ready for Testing
**Last Updated**: October 25, 2025
