import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import './index.css'
import { AuthProvider } from '@/context/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
// New app layout and pages (relative imports)
import AppLayout from './pages/app/AppLayout'
import AppChat from './pages/app/Chat'
import MyAgents from './pages/app/Agents'
import Subscriptions from './pages/app/Subscriptions'
// Agents showcase pages
import CodeXPage from '@/pages/agents/CodeX'
import BusinessXPage from '@/pages/agents/BusinessX'
import MarketXPage from '@/pages/agents/MarketX'
import DietXPage from '@/pages/agents/DietX'
import ErrorBoundary from '@/components/ErrorBoundary'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              {/* Redirect /app to Agents by default */}
              <Route index element={<Navigate to="agents" replace />} />
              <Route path="chat" element={<AppChat />} />
              <Route path="agents" element={<MyAgents />} />
              <Route path="subscriptions" element={<Subscriptions />} />
            </Route>

            {/* Legacy agent showcase pages remain accessible */}
            <Route path="/codex" element={<CodeXPage />} />
            <Route path="/businessx" element={<BusinessXPage />} />
            <Route path="/marketx" element={<MarketXPage />} />
            <Route path="/dietx" element={<DietXPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
)