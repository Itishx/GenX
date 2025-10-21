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
import BusinessXLanding from './pages/landing/BusinessX'
import MarketXLanding from './pages/landing/MarketX'
// import DietXLanding from './pages/landing/DietX'
import About from './pages/About'

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
            <Route path="/businessx" element={<BusinessXLanding />} />
            <Route path="/marketx" element={<MarketXLanding />} />
            {/* <Route path="/dietx" element={<DietXLanding />} /> */}

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
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
)