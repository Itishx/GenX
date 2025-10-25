import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProjectTabs from './ProjectTabs'
import ProjectSidebar, { Project } from './ProjectSidebar'
import EmptyProjectState from './EmptyProjectState'
import ProjectModal, { ProjectFormData, OSType } from './ProjectModal'
import ShareProjectModal from './ShareProjectModal'
import TeammateActivityModal from './TeammateActivityModal'
import EmbeddedFoundryOS from './EmbeddedFoundryOS'
import EmbeddedLaunchOS from './EmbeddedLaunchOS'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'

const ProjectWorkspace: React.FC = () => {
  const { user, signOut } = useAuth()
  const [projects, setProjects] = React.useState<Project[]>([])
  const [activeProjectId, setActiveProjectId] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [modalOpen, setModalOpen] = React.useState(false)
  const [shareModalOpen, setShareModalOpen] = React.useState(false)
  const [activityModalOpen, setActivityModalOpen] = React.useState(false)
  const [editingProject, setEditingProject] = React.useState<Project | null>(null)
  const [creating, setCreating] = React.useState(false)
  const [workspaceError, setWorkspaceError] = React.useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = React.useState(true)

  // Load projects from database
  React.useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const loadProjects = async () => {
      try {
        console.log('Loading projects for user:', user.id)
        const { data, error } = await supabase
          .from('projects')
          .select('id, name, os, created_at, is_active')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(2)

        if (error) {
          console.error('Load projects error:', error)
          setWorkspaceError(`Failed to load projects: ${error.message}`)
          return
        }

        console.log('Projects loaded:', data)
        const loadedProjects: Project[] = (data || []).map((p) => ({
          id: p.id,
          name: p.name,
          os: p.os as OSType,
          createdAt: new Date(p.created_at),
          isActive: p.is_active,
        }))

        setProjects(loadedProjects)
        if (loadedProjects.length > 0 && !activeProjectId) {
          setActiveProjectId(loadedProjects[0].id)
        }
      } catch (err) {
        console.error('Exception loading projects:', err)
        setWorkspaceError('An error occurred while loading projects')
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [user?.id])

  const handleCreateProject = async (formData: ProjectFormData) => {
    if (!user || !formData.os) {
      console.error('Missing user or OS selection')
      return
    }

    setCreating(true)
    setWorkspaceError(null)

    try {
      if (editingProject) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update({
            name: formData.name.trim(),
            description: formData.description || null,
            industry: formData.industry || null,
            goal: formData.goal || null,
          })
          .eq('id', editingProject.id)

        if (error) {
          console.error('Update project database error:', error)
          setWorkspaceError(`Failed to update project: ${error.message}`)
          return
        }

        // Update in state
        setProjects((prev) =>
          prev.map((p) =>
            p.id === editingProject.id
              ? { ...p, name: formData.name }
              : p
          )
        )
        setEditingProject(null)
      } else {
        // Create new project
        const projectId = crypto.randomUUID()
        console.log('Creating project with ID:', projectId)
        
        const { data, error } = await supabase.from('projects').insert({
          id: projectId,
          user_id: user.id,
          name: formData.name.trim(),
          description: formData.description || null,
          industry: formData.industry || null,
          goal: formData.goal || null,
          os: formData.os,
          is_active: true,
          created_at: new Date().toISOString(),
        }).select()

        if (error) {
          console.error('Create project database error:', error)
          setWorkspaceError(`Failed to create project: ${error.message}`)
          return
        }

        console.log('Project created successfully:', data)

        const newProject: Project = {
          id: projectId,
          name: formData.name,
          os: formData.os,
          createdAt: new Date(),
          isActive: true,
        }

        setProjects((prev) => [newProject, ...prev])
        setActiveProjectId(projectId)
      }
      setModalOpen(false)
    } catch (err) {
      console.error('Project creation exception:', err)
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred'
      setWorkspaceError(`Error: ${errorMsg}`)
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    try {
      setWorkspaceError(null)
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)

      if (error) {
        console.error('Delete project error:', error)
        setWorkspaceError(`Failed to delete project: ${error.message}`)
        return
      }

      setProjects((prev) => prev.filter((p) => p.id !== projectId))
      
      // If deleted project was active, select another one
      if (activeProjectId === projectId) {
        const remaining = projects.filter((p) => p.id !== projectId)
        setActiveProjectId(remaining.length > 0 ? remaining[0].id : null)
      }
    } catch (err) {
      console.error('Delete project exception:', err)
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred'
      setWorkspaceError(`Error deleting project: ${errorMsg}`)
    }
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setModalOpen(true)
  }

  const handleProjectSelect = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    if (!project) return

    setActiveProjectId(projectId)
  }

  const handleExport = () => {
    const project = projects.find((p) => p.id === activeProjectId)
    if (!project) return

    const data = {
      project: project.name,
      os: project.os,
      exportedAt: new Date().toISOString(),
    }

    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${project.name}-export.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleShare = () => {
    if (activeProjectId) {
      setShareModalOpen(true)
    }
  }

  const handleViewActivity = (project: Project) => {
    setActiveProjectId(project.id)
    setActivityModalOpen(true)
  }

  const handleSignOut = async () => {
    await signOut()
  }

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const activeProject = projects.find((p) => p.id === activeProjectId)

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center"
        >
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
            <div className="h-6 w-6 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
          </div>
          <p className="text-gray-600">Loading your workspace...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <ProjectSidebar
        projects={projects}
        activeProjectId={activeProjectId}
        onProjectSelect={handleProjectSelect}
        onSignOut={handleSignOut}
        isOpen={sidebarOpen}
        onToggleSidebar={handleToggleSidebar}
        onEditProject={handleEditProject}
        onDeleteProject={handleDeleteProject}
        onViewActivity={handleViewActivity}
      />

      {/* Main Content - Fills remaining space */}
      <main className="flex flex-1 flex-col overflow-hidden w-full transition-all duration-300">
        {/* Top Navigation */}
        <ProjectTabs
          projects={projects}
          activeProjectId={activeProjectId}
          onProjectSelect={handleProjectSelect}
          onNewProject={() => {
            setEditingProject(null)
            setModalOpen(true)
          }}
          onExport={projects.length > 0 ? handleExport : undefined}
          onShare={projects.length > 0 ? handleShare : undefined}
          onToggleSidebar={handleToggleSidebar}
        />

        {/* Workspace Content Area */}
        <div className="flex-1 overflow-auto bg-[#fafafa] w-full">
          <AnimatePresence mode="wait">
            {workspaceError && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="m-4 rounded-lg bg-red-50 border border-red-200 p-4"
              >
                <p className="text-sm text-red-700">{workspaceError}</p>
                <p className="text-xs text-red-600 mt-2">
                  Check the browser console (F12) for more details. Make sure the projects table exists in your Supabase database.
                </p>
              </motion.div>
            )}
            {projects.length === 0 ? (
              <EmptyProjectState key="empty" onCreateProject={() => setModalOpen(true)} />
            ) : (
              <AnimatePresence mode="wait">
                {activeProject?.os === 'foundryos' ? (
                  <motion.div
                    key="foundryos"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full"
                  >
                    <EmbeddedFoundryOS />
                  </motion.div>
                ) : activeProject?.os === 'launchos' ? (
                  <motion.div
                    key="launchos"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full"
                  >
                    <EmbeddedLaunchOS />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Project Modal */}
      <ProjectModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingProject(null)
        }}
        onSubmit={handleCreateProject}
        isLoading={creating}
        editingProject={editingProject}
      />

      {/* Share Project Modal */}
      {activeProject && user && (
        <ShareProjectModal
          open={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          projectId={activeProject.id}
          projectName={activeProject.name}
          projectOwnerId={user.id}
        />
      )}

      {/* Teammate Activity Modal */}
      {activeProject && (
        <TeammateActivityModal
          open={activityModalOpen}
          onClose={() => setActivityModalOpen(false)}
          projectId={activeProject.id}
          projectName={activeProject.name}
        />
      )}
    </div>
  )
}

export default ProjectWorkspace
