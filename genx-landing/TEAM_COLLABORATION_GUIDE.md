## Team Collaboration Feature - Implementation Guide

### Overview
This guide explains the new collaborative workspace feature that allows users to invite teammates to share access on projects.

### Feature Components

#### 1. **Database Schema** (`supabase_migrations_001_create_projects.sql`)
Added three new tables:

- **`project_collaborators`**: Tracks active team members on projects
  - `project_id`: Links to the project
  - `user_id`: Links to the team member
  - `role`: 'owner', 'editor', or 'viewer'
  - Ensures unique collaborator pairs per project

- **`project_invitations`**: Manages email-based invitations
  - `invited_email`: Email address being invited
  - `token`: Unique invitation token (valid for 7 days)
  - `status`: 'pending', 'accepted', 'declined', or 'expired'
  - `role`: 'editor' or 'viewer'
  - Automatic expiration after 7 days

#### 2. **UI Components**

##### ShareProjectModal (`src/components/ShareProjectModal.tsx`)
New modal component that opens when clicking the Share button:
- **Email Input**: Accept teammate email address
- **Role Selection**: Choose between 'Editor' or 'Viewer' access level
- **Validation**: Email format validation and duplicate prevention
- **Success/Error Messages**: Clear feedback on invitation status
- **Features**:
  - Real-time error handling
  - Loading states with spinner
  - Auto-close after successful send
  - Displays project name in modal header

##### ProjectTabs (`src/components/ProjectTabs.tsx`)
Updated to include:
- **Share Button**: New icon button next to the Export button
- Uses `FiShare2` icon from react-icons
- Only visible when projects exist
- Opens share modal when clicked

##### ProjectWorkspace (`src/components/ProjectWorkspace.tsx`)
Enhanced with:
- `shareModalOpen` state to control modal visibility
- `handleShare()` function triggered by share button
- Integration of `ShareProjectModal` component
- Passes active project details to share modal

### How to Use

#### For Project Owners (Sending Invitations)

1. Navigate to `/app/agents` (Project Workspace)
2. Select or create a project
3. Click the **Share** button (icon next to Export button) in the top-right
4. Enter teammate's email address
5. Select access level:
   - **Editor**: Can view and modify the project
   - **Viewer**: Can only view the project
6. Click "Send Invite"
7. Success message confirms invitation sent

#### For Invited Teammates (Accepting Invitations)

1. Receive email with invitation link (contains token)
2. Click link to accept invitation
3. Project appears in their workspace
4. Can collaborate based on assigned role

### Access Levels

| Role | View | Edit | Delete | Invite Others |
|------|------|------|--------|---------------|
| Owner | ✓ | ✓ | ✓ | ✓ |
| Editor | ✓ | ✓ | ✗ | ✗ |
| Viewer | ✓ | ✗ | ✗ | ✗ |

### Database Deployment

Run the migration to set up new tables:

```bash
# In Supabase dashboard or using CLI:
psql -h your-host -U postgres -d postgres -f supabase_migrations_001_create_projects.sql
```

Or use Supabase dashboard:
1. Go to SQL Editor
2. Create new query
3. Copy and paste SQL from migration file
4. Run query

### Row-Level Security (RLS)

All tables have RLS enabled with policies:

- **project_collaborators**: Users can only see collaborators of their projects
- **project_invitations**: Users can only see invitations sent to their email or their projects

### Next Steps (Recommended Enhancements)

1. **Email Service Integration**
   ```typescript
   // In ShareProjectModal.tsx handleSubmit()
   // Add email sending via Resend, SendGrid, or similar
   await sendInvitationEmail({
     to: email,
     projectName,
     invitationLink: `https://yourapp.com/accept-invitation/${token}`,
     invitedBy: projectOwnerName
   })
   ```

2. **Invitation Acceptance Page**
   - Create `/accept-invitation/[token]` route
   - Verify token validity and expiration
   - Add invited user to `project_collaborators`
   - Update invitation status to 'accepted'

3. **Collaborators Management Panel**
   - View active team members
   - Change roles
   - Remove collaborators
   - See invitation status

4. **Real-time Collaboration**
   - Supabase Realtime for live updates
   - Broadcast user presence
   - Sync changes across team members

5. **Audit Logging**
   - Track who invited whom
   - Log access changes
   - Monitor project activity

### File Structure

```
src/components/
├── ProjectWorkspace.tsx (updated)
├── ProjectTabs.tsx (updated)
├── ShareProjectModal.tsx (new)
├── ProjectSidebar.tsx
├── ProjectModal.tsx
└── ...

supabase_migrations_001_create_projects.sql (updated)
```

### Testing Checklist

- [ ] Share button appears in top-right navigation
- [ ] Share modal opens when clicking button
- [ ] Email validation works correctly
- [ ] Role selection updates properly
- [ ] Invitation saves to database
- [ ] Success message displays
- [ ] Modal closes after success
- [ ] Error messages show for duplicates
- [ ] 7-day expiration is set correctly
- [ ] RLS policies prevent unauthorized access

### Troubleshooting

**"Permission denied" error**
- Ensure RLS policies are properly set up
- Check that `auth.uid()` matches current user

**"Duplicate key violation"**
- User was already invited to this project
- Update invitation instead of creating new one

**Email not received**
- Email service not configured yet (send email integration needed)
- Check spam folder in test environment

**Modal won't open**
- Ensure ShareProjectModal is imported in ProjectWorkspace
- Check that shareModalOpen state is managed correctly
