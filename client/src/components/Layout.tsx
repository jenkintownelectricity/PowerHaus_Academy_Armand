import { Link, useLocation } from 'wouter';
import {
  LayoutDashboard,
  BookOpen,
  FlaskConical,
  Calendar,
  Video,
  Users,
  FileText,
  LogOut,
  User,
  Settings,
  GraduationCap,
  Crown,
  Code2
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GlobalSearch } from './GlobalSearch';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
}

// Student navigation
const studentNavigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Materials', href: '/materials', icon: BookOpen },
  { name: 'Hands-On Stations', href: '/stations', icon: FlaskConical },
  { name: 'Classes', href: '/classes', icon: Calendar },
  { name: 'Online Classes', href: '/online-classes', icon: Video },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Blog', href: '/blog', icon: FileText },
];

// Teacher navigation
const teacherNavigation = [
  { name: 'Teacher Dashboard', href: '/teacher', icon: GraduationCap },
  { name: 'Student Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Materials', href: '/materials', icon: BookOpen },
  { name: 'Hands-On Stations', href: '/stations', icon: FlaskConical },
  { name: 'Classes', href: '/classes', icon: Calendar },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Blog', href: '/blog', icon: FileText },
];

// Admin navigation
const adminNavigation = [
  { name: 'Admin Dashboard', href: '/admin', icon: Crown },
  { name: 'Developer Dashboard', href: '/developer', icon: Code2 },
  { name: 'Student View', href: '/', icon: LayoutDashboard },
  { name: 'Classes', href: '/classes', icon: Calendar },
  { name: 'Community', href: '/community', icon: Users },
];

// Get navigation based on user role
const getNavigation = (role: string) => {
  if (role === 'admin') return adminNavigation;
  if (role === 'teacher') return teacherNavigation;
  return studentNavigation;
};

export default function Layout({ children, user }: LayoutProps) {
  const [location] = useLocation();
  const queryClient = useQueryClient();

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-6 border-b">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <FlaskConical className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">SPU LMS</h1>
              <p className="text-xs text-gray-500">Sterile Processing</p>
            </div>
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
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'
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
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full text-white text-sm font-medium">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full mt-2 justify-start text-gray-700"
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
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <GlobalSearch />
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-medium">{user.firstName}</span>
              </span>
            </div>
          </div>
        </header>

        <div className="min-h-screen p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
