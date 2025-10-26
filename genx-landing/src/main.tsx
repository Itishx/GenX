import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ErrorBoundary from './components/ErrorBoundary'
import useScrollToTop from './hooks/useScrollToTop'

// App layout and pages
import AppLayout from './pages/app/AppLayout'
import AppChat from './pages/app/Chat'
import MyAgents from './pages/app/Agents'
import Subscriptions from './pages/app/Subscriptions'

// Agent dashboards nested under /app/agents
// import AppCodeX from './pages/app/agents/CodeX'
import AppBusinessX from './pages/app/agents/BusinessX'
import AppMarketX from './pages/app/agents/MarketX'
// import AppDietX from './pages/app/agents/DietX'

// Public agent landing pages
// import CodexLanding from './pages/landing/Codex'
// import DietXLanding from './pages/landing/DietX'
import FoundryOSGetStarted from './pages/landing/FoundryOSGetStarted'
import LaunchOSGetStarted from './pages/landing/LaunchOSGetStarted'
import StageDetail from './pages/landing/StageDetail'
import About from './pages/About'
import FoundryOS from './pages/landing/FoundryOS'
import LaunchOS from './pages/landing/LaunchOS'
import WorkspaceHome from './pages/app/WorkspaceHome'

const ScrollToTop = () => {
  useScrollToTop();
  return null;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />

            {/* Public individual agent pages */}
            {/* <Route path="/codex" element={<CodexLanding />} /> */}
            <Route path="/foundryos" element={<FoundryOS />} />
            <Route path="/launchos" element={<LaunchOS />} />
            {/* <Route path="/dietx" element={<DietXLanding />} /> */}

            {/* Get started pages */}
            <Route path="/foundryos/get-started" element={<FoundryOSGetStarted />} />
            <Route path="/launchos/get-started" element={<LaunchOSGetStarted />} />

            {/* Stage workspace pages */}
            <Route path="/foundry/:stageId" element={<StageDetail />} />
            <Route path="/launch/:stageId" element={<StageDetail />} />

            {/* Protected app routes */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              {/* Redirect /app to Chat by default */}
              <Route index element={<Navigate to="chat" replace />} />
              <Route path="chat" element={<AppChat />} />
              <Route path="subscriptions" element={<Subscriptions />} />
            </Route>

            {/* Agents page without sidebar */}
            <Route
              path="/app/agents"
              element={
                <ProtectedRoute>
                  <MyAgents />
                </ProtectedRoute>
              }
            >
              <Route path="businessx" element={<AppBusinessX />} />
              <Route path="marketx" element={<AppMarketX />} />
            </Route>

            {/* Workspace Home */}
            <Route
              path="/app/workspace-home"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<WorkspaceHome />} />
            </Route>

            {/* Catch-all route - redirect to home for undefined paths */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
)