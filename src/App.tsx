import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Experience from './pages/Experience';
import Education from './pages/Education';
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import { useAuth } from './contexts/AuthContext';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';

// Protected route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="projects" element={
                <ErrorBoundary>
                  <Projects />
                </ErrorBoundary>
              } />
              <Route path="articles" element={
                <ErrorBoundary>
                  <Articles />
                </ErrorBoundary>
              } />
              <Route path="articles/:id" element={
                <ErrorBoundary>
                  <ArticleDetail />
                </ErrorBoundary>
              } />
              <Route path="experience" element={
                <ErrorBoundary>
                  <Experience />
                </ErrorBoundary>
              } />
              <Route path="education" element={
                <ErrorBoundary>
                  <Education />
                </ErrorBoundary>
              } />
              <Route path="auth" element={<Auth />} />
              <Route
                path="admin"
                element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <Admin />
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;