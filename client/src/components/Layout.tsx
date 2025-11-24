import { Link, useLocation } from 'wouter';
import {
  LayoutDashboard,
  BookOpen,
  Camera,
  Calendar,
  Video,
  Users,
  FileText,
  LogOut,
  User,
  Settings,
  GraduationCap,
  Crown,
  Code2,
  FolderOpen,
  Palette,
  Sparkles,
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GlobalSearch } from './GlobalSearch';
import { useState, useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
}

// Student navigation - PowerHaus Academy
const studentNavigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Programs', href: '/programs', icon: BookOpen },
  { name: 'Videos', href: '/videos', icon: Video },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Blog', href: '/blog', icon: FileText },
];

// Instructor navigation
const instructorNavigation = [
  { name: 'My Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Programs', href: '/programs', icon: BookOpen },
  { name: 'Videos', href: '/videos', icon: Video },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Classes', href: '/classes', icon: Calendar },
];

// Admin navigation - PowerHaus Academy
const adminNavigation = [
  { name: 'PowerHaus Admin', href: '/powerhaus-admin', icon: Crown },
  { name: 'Student View', href: '/', icon: LayoutDashboard },
  { name: 'Branding', href: '/branding', icon: Palette },
  { name: 'Programs', href: '/programs', icon: BookOpen },
  { name: 'Community', href: '/community', icon: Users },
];

// Get navigation based on user role
const getNavigation = (role: string) => {
  if (role === 'admin') return adminNavigation;
  if (role === 'instructor') return instructorNavigation;
  return studentNavigation;
};

export default function Layout({ children, user }: LayoutProps) {
  const [location] = useLocation();
  const queryClient = useQueryClient();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [hasCustomLogo, setHasCustomLogo] = useState(false);

  // Check for custom logo
  useEffect(() => {
    const checkLogo = async () => {
      try {
        const response = await fetch('/branding/powerhaus-logo.png');
        if (response.ok) {
          setLogoUrl('/branding/powerhaus-logo.png');
          setHasCustomLogo(true);
        }
      } catch (error) {
        // Use default text logo
        setHasCustomLogo(false);
      }
    };
    checkLogo();
  }, []);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (!res.ok) throw new Error('Logout failed');
    },
    onSuccess: () => {
      queryClient.setQueryData(['user'], null);
    },
  });

  return (
    <div className="min-h-screen bg-black">
      {/* Sidebar - OLED Black Theme */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 glass-dark border-r border-white/10">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
            {hasCustomLogo && logoUrl ? (
              <img
                src={logoUrl}
                alt="PowerHaus Academy"
                className="h-10 w-auto object-contain"
              />
            ) : (
              <>
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg powerhaus-glow">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">PowerHaus</h1>
                  <p className="text-xs text-gray-400">Academy</p>
                </div>
              </>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {getNavigation(user.role).map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <a
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all',
                      isActive
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </a>
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg glass">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full text-white text-sm font-medium">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-400 capitalize">{user.role}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full mt-2 justify-start text-gray-400 hover:text-white hover:bg-white/5"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="pl-64">
        {/* Header with search */}
        <header className="sticky top-0 z-40 glass-dark border-b border-white/10 px-8 py-4">
          <div className="flex items-center justify-between">
            <GlobalSearch />
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">
                Welcome, <span className="font-medium text-white">{user.firstName}</span>
              </span>
            </div>
          </div>
        </header>

        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
