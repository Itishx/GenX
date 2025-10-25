-- Create projects table for the project-based workspace system
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  industry TEXT,
  goal TEXT,
  os TEXT NOT NULL CHECK (os IN ('foundryos', 'launchos')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS projects_user_id_idx ON projects(user_id);
CREATE INDEX IF NOT EXISTS projects_created_at_idx ON projects(created_at DESC);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at_trigger
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_projects_updated_at();

-- ============================================================
-- TEAM COLLABORATION TABLES
-- ============================================================

-- Create project_collaborators table for tracking team members
CREATE TABLE IF NOT EXISTS project_collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('owner', 'editor', 'viewer')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Create index for collaborators queries
CREATE INDEX IF NOT EXISTS project_collaborators_project_id_idx ON project_collaborators(project_id);
CREATE INDEX IF NOT EXISTS project_collaborators_user_id_idx ON project_collaborators(user_id);

-- Enable RLS for project_collaborators
ALTER TABLE project_collaborators ENABLE ROW LEVEL SECURITY;

-- RLS policies for collaborators
CREATE POLICY "Users can view collaborators of their projects"
  ON project_collaborators FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
    OR user_id = auth.uid()
  );

CREATE POLICY "Project owners can add collaborators"
  ON project_collaborators FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can update collaborators"
  ON project_collaborators FOR UPDATE
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can remove collaborators"
  ON project_collaborators FOR DELETE
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- Create project_invitations table for email-based invites
CREATE TABLE IF NOT EXISTS project_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invited_email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('editor', 'viewer')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(project_id, invited_email)
);

-- Create index for invitations queries
CREATE INDEX IF NOT EXISTS project_invitations_project_id_idx ON project_invitations(project_id);
CREATE INDEX IF NOT EXISTS project_invitations_invited_email_idx ON project_invitations(invited_email);
CREATE INDEX IF NOT EXISTS project_invitations_token_idx ON project_invitations(token);
CREATE INDEX IF NOT EXISTS project_invitations_status_idx ON project_invitations(status);

-- Enable RLS for project_invitations
ALTER TABLE project_invitations ENABLE ROW LEVEL SECURITY;

-- RLS policies for invitations
CREATE POLICY "Users can view invitations sent to their email"
  ON project_invitations FOR SELECT
  USING (
    invited_email = auth.jwt() ->> 'email'
    OR project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can create invitations"
  ON project_invitations FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
    AND invited_by = auth.uid()
  );

CREATE POLICY "Users can accept invitations sent to them"
  ON project_invitations FOR UPDATE
  USING (
    invited_email = auth.jwt() ->> 'email'
  )
  WITH CHECK (
    invited_email = auth.jwt() ->> 'email'
    AND status IN ('accepted', 'declined')
  );

-- Create trigger to update projects updated_at when collaborators change
CREATE OR REPLACE FUNCTION update_projects_updated_at_collaborators()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE projects SET updated_at = now() WHERE id = NEW.project_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER project_collaborators_update_projects_trigger
AFTER INSERT OR UPDATE OR DELETE ON project_collaborators
FOR EACH ROW
EXECUTE FUNCTION update_projects_updated_at_collaborators();

-- ============================================================
-- ACTIVITY TRACKING TABLES
-- ============================================================

-- Create activity_log table for tracking teammate actions
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'stage_completed',
    'stage_started',
    'content_edited',
    'note_added',
    'file_uploaded',
    'collaboration_invited',
    'feedback_given',
    'research_added',
    'custom_action'
  )),
  activity_title TEXT NOT NULL,
  activity_description TEXT,
  metadata JSONB DEFAULT '{}',
  progress_metric TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for activity queries
CREATE INDEX IF NOT EXISTS activity_log_project_id_idx ON activity_log(project_id);
CREATE INDEX IF NOT EXISTS activity_log_user_id_idx ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS activity_log_created_at_idx ON activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS activity_log_project_created_idx ON activity_log(project_id, created_at DESC);

-- Enable RLS for activity_log
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- RLS policies for activity_log
CREATE POLICY "Users can view activities from projects they collaborate on"
  ON activity_log FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
      UNION
      SELECT project_id FROM project_collaborators WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create activities for projects they own or collaborate on"
  ON activity_log FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
      UNION
      SELECT project_id FROM project_collaborators WHERE user_id = auth.uid()
    )
  );

-- Create activity_summary table for AI-generated summaries
CREATE TABLE IF NOT EXISTS activity_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  summary_text TEXT NOT NULL,
  time_period TEXT NOT NULL CHECK (time_period IN ('24h', 'week', 'all_time')),
  total_actions INT DEFAULT 0,
  unique_contributors INT DEFAULT 0,
  key_milestones TEXT[] DEFAULT ARRAY[]::TEXT[],
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(project_id, time_period)
);

-- Create index for summaries
CREATE INDEX IF NOT EXISTS activity_summary_project_id_idx ON activity_summary(project_id);
CREATE INDEX IF NOT EXISTS activity_summary_time_period_idx ON activity_summary(time_period);

-- Enable RLS for activity_summary
ALTER TABLE activity_summary ENABLE ROW LEVEL SECURITY;

-- RLS policies for activity_summary
CREATE POLICY "Users can view summaries from projects they collaborate on"
  ON activity_summary FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
      UNION
      SELECT project_id FROM project_collaborators WHERE user_id = auth.uid()
    )
  );

-- Create trigger for updated_at on activity_log
CREATE OR REPLACE FUNCTION update_activity_log_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER activity_log_updated_at_trigger
BEFORE UPDATE ON activity_log
FOR EACH ROW
EXECUTE FUNCTION update_activity_log_updated_at();
