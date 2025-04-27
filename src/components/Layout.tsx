import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Home, Briefcase, BookText, FolderGit2, LogOut, Menu, X, GraduationCap, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/experience', icon: Briefcase, label: 'Experience' },
  { to: '/education', icon: GraduationCap, label: 'Education' },
  { to: '/projects', icon: FolderGit2, label: 'Projects' },
  { to: '/articles', icon: BookText, label: 'Articles' },
];

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container h-16 flex items-center">
          <NavLink 
            to="/" 
            className="text-xl font-bold gradient-text"
            onClick={() => setIsMenuOpen(false)}
          >
            Portfolio
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 ml-auto">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors",
                    isActive && "text-foreground"
                  )
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
                    cn(
                      "flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors",
                      isActive && "text-foreground"
                    )
                  }
                >
                  <Shield size={20} />
                  <span>Admin</span>
                </NavLink>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-destructive transition-colors"
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
            className="ml-auto lg:hidden p-2 hover:bg-accent rounded-lg transition-colors"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t bg-background"
            >
              <div className="container py-4 space-y-4">
                {navItems.map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center space-x-2 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent",
                        isActive && "text-foreground bg-accent"
                      )
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
                        cn(
                          "flex items-center space-x-2 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent",
                          isActive && "text-foreground bg-accent"
                        )
                      }
                    >
                      <Shield size={20} />
                      <span>Admin</span>
                    </NavLink>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 p-2 w-full text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-accent"
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
      </header>

      <main className="container pt-24 pb-8 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}