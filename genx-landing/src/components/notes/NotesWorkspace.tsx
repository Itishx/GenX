import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNotes, Note } from '../../hooks/notes/useNotes'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import { Loader } from 'lucide-react'
import NotesGrid from './NotesGrid'
import NotesSidebarCustom from './NotesSidebarCustom'
import ProjectTabs from '../ProjectTabs'
import ProjectModal from '../ProjectModal'
import { Project } from '../../types'

const NotesWorkspace: React.FC = () => {
  const { user } = useAuth()
  const { notes, isLoading, createNote } = useNotes()
  const [projects, setProjects] = React.useState<Project[]>([])
  const [activeProjectId, setActiveProjectId] = React.useState<string | null>(null)
  const [projectsLoading, setProjectsLoading] = React.useState(true)
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [newProject, setNewProject] = React.useState<Project | null>(null)
  const [currentStageId, setCurrentStageId] = React.useState<string | null>(null)

  // Load projects from database
  React.useEffect(() => {
    if (!user) {
      setProjectsLoading(false)
      return
    }

    const loadProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, name, os, created_at, is_active')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(2)

        if (error) {
          console.error('Load projects error:', error)
          return
        }

        const loadedProjects: Project[] = (data || []).map((p) => ({
          id: p.id,
          name: p.name,
          os: p.os as 'foundryos' | 'launchos',
          createdAt: new Date(p.created_at),
          isActive: p.is_active,
        }))

        setProjects(loadedProjects)
        if (loadedProjects.length > 0 && !activeProjectId) {
          setActiveProjectId(loadedProjects[0].id)
        }
      } catch (err) {
        console.error('Exception loading projects:', err)
      } finally {
        setProjectsLoading(false)
      }
    }

    loadProjects()
  }, [user?.id])

  // Listen for stage changes from the stage components
  useEffect(() => {
    const handleStageChange = (event: any) => {
      const stageId = event.detail?.stageId
      if (stageId) {
        setCurrentStageId(stageId)
      }
    }

    window.addEventListener('stageChanged', handleStageChange)
    return () => window.removeEventListener('stageChanged', handleStageChange)
  }, [])

  const handleProjectSelect = (projectId: string) => {
    setActiveProjectId(projectId)
  }

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleNewNote = () => {
    if (!activeProjectId) return
    const activeProject = projects.find(p => p.id === activeProjectId)
    if (!activeProject) return

    createNote('Untitled Note', activeProjectId, undefined, activeProject.os)
  }

  const handleNewProject = async () => {
    if (!user) return
    const tempId = `temp-${Date.now()}`
    const tempProject: Project = {
      id: tempId,
      name: 'New Project',
      os: 'foundryos',
      createdAt: new Date(),
      isActive: true,
    }
    setNewProject(tempProject)
    setIsModalOpen(true)
  }

  const handleCreateProject = async (name: string, os: 'foundryos' | 'launchos') => {
    if (!user || !newProject) return

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({ name, os, user_id: user.id, is_active: true })
        .select()
        .single()

      if (error) throw error

      const createdProject: Project = {
        id: data.id,
        name: data.name,
        os: data.os,
        createdAt: new Date(data.created_at),
        isActive: data.is_active,
      }

      setProjects(prev => [createdProject, ...prev])
      setActiveProjectId(createdProject.id)
      setIsModalOpen(false)
      setNewProject(null)
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  const activeProject = projects.find((p) => p.id === activeProjectId)

  // Filter notes by system (foundryos or launchos)
  // Don't filter by projectId since stage notes use stageId instead
  const projectNotes = notes.filter(note => {
    // Only filter by system - show notes from this OS
    const systemMatch = note.system === activeProject?.os
    return systemMatch
  })

  // Group notes by stage
  const notesByStage = projectNotes.reduce((acc, note) => {
    const stageId = note.stageId || 'standalone'
    if (!acc[stageId]) {
      acc[stageId] = []
    }
    acc[stageId].push(note)
    return acc
  }, {} as { [stageId: string]: Note[] })

  if (projectsLoading || isLoading) {
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
          <p className="text-gray-600">Loading notes...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Custom Notes Sidebar */}
      <NotesSidebarCustom
        projects={projects}
        activeProjectId={activeProjectId}
        onProjectSelect={handleProjectSelect}
        isOpen={sidebarOpen}
        onToggleSidebar={handleToggleSidebar}
        currentStageId={currentStageId}
      />

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-hidden w-full transition-all duration-300">
        {/* Top Navigation - Project Tabs */}
        <ProjectTabs
          projects={projects}
          activeProjectId={activeProjectId}
          onProjectSelect={handleProjectSelect}
          onNewProject={handleNewProject}
          onToggleSidebar={handleToggleSidebar}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-hidden bg-[#fafafa] w-full">
          <AnimatePresence mode="wait">
            {projects.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full"
              >
                <div className="text-center max-w-md">
                  <div className="text-6xl mb-4">📝</div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">No Projects Yet</h2>
                  <p className="text-gray-500">Create a project to start taking notes</p>
                </div>
              </motion.div>
            ) : activeProject ? (
              <motion.div
                key={`notes-${activeProjectId}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full overflow-auto"
              >
                <NotesGrid
                  projectName={activeProject.name}
                  projectOS={activeProject.os}
                  notesByStage={notesByStage}
                  activeProjectId={activeProjectId || undefined}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </main>
      {isModalOpen && newProject && (
        <ProjectModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={async (data) => {
            await handleCreateProject(data.name, data.os || 'foundryos');
          }}
        />
      )}
    </div>
  )
}

export default NotesWorkspace
