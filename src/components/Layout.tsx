import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, Briefcase, BookText, FolderGit2, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/experience', icon: Briefcase, label: 'Experience' },
    { to: '/projects', icon: FolderGit2, label: 'Projects' },
    { to: '/articles', icon: BookText, label: 'Articles' },
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <NavLink 
              to="/" 
              className="text-xl font-bold gradient-text"
              onClick={() => setIsMenuOpen(false)}
            >
              Portfolio
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 hover:text-blue-400 transition-colors ${
                      isActive ? 'text-blue-400' : ''
                    }`
                  }
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </NavLink>
              ))}
              {user && (
                <>
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `flex items-center space-x-2 hover:text-blue-400 transition-colors ${
                        isActive ? 'text-blue-400' : ''
                      }`
                    }
                  >
                    <span>Admin</span>
                  </NavLink>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 hover:text-red-400 transition-colors"
                  >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/30 backdrop-blur-sm border-t border-white/10"
            >
              <div className="px-4 py-2 space-y-2">
                {navItems.map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-2 py-2 hover:text-blue-400 transition-colors ${
                        isActive ? 'text-blue-400' : ''
                      }`
                    }
                  >
                    <Icon size={20} />
                    <span>{label}</span>
                  </NavLink>
                ))}
                {user && (
                  <>
                    <NavLink
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center space-x-2 py-2 hover:text-blue-400 transition-colors ${
                          isActive ? 'text-blue-400' : ''
                        }`
                      }
                    >
                      <span>Admin</span>
                    </NavLink>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 py-2 w-full hover:text-red-400 transition-colors"
                    >
                      <LogOut size={20} />
                      <span>Sign Out</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;