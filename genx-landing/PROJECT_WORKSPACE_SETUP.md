# Project Workspace Quick Setup Checklist

## ✅ Pre-Implementation Checklist

Before running the application, complete these steps:

### 1. Database Setup
- [ ] Open Supabase Dashboard
- [ ] Navigate to SQL Editor
- [ ] Create new query
- [ ] Copy-paste contents from `supabase_migrations_001_create_projects.sql`
- [ ] Execute the query to create projects table
- [ ] Verify table appears in Table Editor

### 2. Environment Configuration
- [ ] Confirm `.env.local` exists with Supabase credentials:
  ```
  VITE_SUPABASE_URL=https://your-project.supabase.co
  VITE_SUPABASE_ANON_KEY=your_anon_key_here
  ```

### 3. Dependencies Check
- [ ] Verify `framer-motion` is installed: `npm list framer-motion`
- [ ] Verify `react-router-dom` is installed: `npm list react-router-dom`
- [ ] Verify `react-icons` is installed: `npm list react-icons`

### 4. File Structure Verification
- [ ] `src/components/ProjectWorkspace.tsx` exists
- [ ] `src/components/ProjectModal.tsx` exists
- [ ] `src/components/ProjectSidebar.tsx` exists
- [ ] `src/components/ProjectTabs.tsx` exists
- [ ] `src/components/EmptyProjectState.tsx` exists
- [ ] `src/pages/app/Agents.tsx` updated
- [ ] `supabase_migrations_001_create_projects.sql` created

### 5. Import Paths
- [ ] All imports use `@/` aliases correctly
- [ ] `useAuth` from `@/context/AuthContext`
- [ ] `supabase` from `@/lib/supabaseClient`
- [ ] `useNavigate` from `react-router-dom`

## 🚀 Running the Application

```bash
# 1. Start the development server
npm run dev

# 2. Navigate to the agents page
# Open: http://localhost:5173/app/agents

# 3. You should see:
# - Sidebar on the left with "Your Projects" header
# - Main area with "Create your first project" card
# - Empty project list

# 4. Test project creation:
# Click "Create Project"
# Fill in form fields
# Select an OS
# Click "Continue"
```

## 🧪 Testing Scenarios

### Scenario 1: Create First Project
1. Click "Create Project" button
2. Fill form:
   - Name: "Startup Idea #1"
   - Description: "My first startup"
   - Industry: "SaaS"
   - Goal: "Validate market demand"
3. Select "FoundryOS"
4. Click "Continue"
5. ✅ Project should be created and listed in sidebar

### Scenario 2: Create Second Project
1. Click "+ New Project" in top nav
2. Fill form with different OS (LaunchOS)
3. Click "Continue"
4. ✅ Both projects visible in sidebar and tabs

### Scenario 3: Switch Between Projects
1. Click different project in sidebar
2. ✅ Tab should highlight, project name in top-left updates
3. Active indicator dot appears in sidebar

### Scenario 4: Export Project
1. Select a project
2. Click export icon in top-right
3. ✅ JSON file downloads with project data

### Scenario 5: Sign Out
1. Click "Sign out" button in profile section
2. ✅ Should redirect to home page

## 🔍 Debugging Tips

### Check Console for Errors
```bash
# Open DevTools (F12)
# Go to Console tab
# Look for any red errors or warnings
```

### Verify Supabase Connection
```typescript
// In browser console, test:
const { data, error } = await supabase.from('projects').select('*').limit(1)
console.log(data, error)
```

### Check RLS Policies
1. Supabase Dashboard → Authentication → Policies
2. Verify all 4 policies exist for projects table:
   - View policy ✓
   - Insert policy ✓
   - Update policy ✓
   - Delete policy ✓

### Check User ID Context
```typescript
// In browser console:
const { data: { session } } = await supabase.auth.getSession()
console.log('Current user:', session?.user?.id)
```

## 📊 Database Verification

After running the migration, verify the schema:

```sql
-- Check if table exists
SELECT * FROM information_schema.tables 
WHERE table_name = 'projects';

-- Check table structure
\d projects

-- Check RLS policies
SELECT * FROM pg_policies 
WHERE tablename = 'projects';

-- Test insert (as authenticated user)
INSERT INTO projects (user_id, name, os) 
VALUES ('YOUR_USER_ID', 'Test Project', 'foundryos');
```

## 🎨 Visual Checklist

When testing, verify these visual elements:

- [ ] **Sidebar**: Visible on left, displays "Your Projects" header
- [ ] **Project Cards**: Show project name and OS icon
- [ ] **Active Indicator**: Orange dot appears on selected project
- [ ] **Top Navigation**: Shows active project name
- [ ] **Tabs**: Smooth animation when switching projects
- [ ] **Buttons**: Orange gradient on primary actions
- [ ] **Modal**: Centered, with smooth scale animation
- [ ] **OS Selection**: Cards show with checkmark when selected
- [ ] **Empty State**: Folder icon animates with floating effect
- [ ] **Hover Effects**: Buttons scale slightly on hover

## 🆘 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "Cannot read property 'projects' of undefined" | RLS policies not set | Run SQL migration again |
| Empty project list not showing | User not authenticated | Check AuthContext, ensure user is logged in |
| Modal won't submit | Validation error | Check console, ensure name and OS selected |
| Navigation not working | Route doesn't exist | Verify `/foundryos/get-started` route exists |
| Sidebar not visible | CSS display issue | Clear browser cache, restart dev server |
| Projects load but empty | Database empty | Create a new project to test |

## 📝 Next Steps After Setup

1. **Test all user flows** with the scenarios above
2. **Check console for errors** while interacting
3. **Verify database** has projects created
4. **Test authentication** edge cases
5. **Optimize UI** based on feedback
6. **Add error boundaries** if needed
7. **Implement mobile responsive** layout
8. **Add delete project** feature (optional)

## 📞 Support

If encountering issues:
1. Check browser console for errors (F12)
2. Verify Supabase credentials in `.env.local`
3. Ensure database migration was executed
4. Check that user is authenticated
5. Review PROJECT_WORKSPACE_GUIDE.md for detailed info

---

**Ready to launch?** Run `npm run dev` and navigate to `/app/agents` 🚀
