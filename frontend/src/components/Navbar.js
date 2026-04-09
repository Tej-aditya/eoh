import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { Home, Users, BookOpen, Briefcase, TrendingUp, MessageSquare, Settings as SettingsIcon, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/resources', icon: BookOpen, label: 'Resources' },
    { path: '/jobs', icon: Briefcase, label: 'Jobs' },
    { path: '/progress', icon: TrendingUp, label: 'Progress' },
    { path: '/mentorship', icon: Users, label: 'Mentorship' },
    { path: '/community', icon: MessageSquare, label: 'Community' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe]" />
          <span className="text-xl font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
            SkillSync AI
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                data-testid={`nav-${item.label.toLowerCase()}`}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-full transition-all
                  ${isActive(item.path)
                    ? 'bg-[#00f2fe]/10 text-[#00f2fe]'
                    : 'text-[#A1A1AA] hover:text-white'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}

          <div className="h-6 w-px bg-white/10" />

          <Link
            to="/profile"
            data-testid="nav-profile"
            className="flex items-center gap-2 px-3 py-2 rounded-full text-[#A1A1AA] hover:text-white transition-all"
          >
            {user?.picture ? (
              <img src={user.picture} alt={user.name} className="w-6 h-6 rounded-full" />
            ) : (
              <User className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">{user?.name}</span>
          </Link>

          <Link
            to="/settings"
            data-testid="nav-settings"
            className="p-2 rounded-full text-[#A1A1AA] hover:text-white transition-all"
          >
            <SettingsIcon className="w-4 h-4" />
          </Link>

          <button
            data-testid="logout-button"
            onClick={logout}
            className="p-2 rounded-full text-[#A1A1AA] hover:text-[#EF4444] transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;