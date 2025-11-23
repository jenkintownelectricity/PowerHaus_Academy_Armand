import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, BookOpen, TrendingUp, FlaskConical, MessageSquare } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const res = await fetch('/api/stats');
      return res.json();
    },
  });

  const quickActions = [
    {
      title: 'Educational Materials',
      description: 'Access study materials, guides, and resources',
      icon: BookOpen,
      href: '/materials',
      color: 'bg-blue-500',
    },
    {
      title: 'Hands-On Stations',
      description: 'Practice with interactive testing stations',
      icon: FlaskConical,
      href: '/stations',
      color: 'bg-purple-500',
    },
    {
      title: 'Scheduled Classes',
      description: 'View and enroll in upcoming classes',
      icon: Calendar,
      href: '/classes',
      color: 'bg-green-500',
    },
    {
      title: 'Community Discussions',
      description: 'Connect with peers and ask questions',
      icon: MessageSquare,
      href: '/community',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome to SPU LMS
        </h1>
        <p className="text-lg text-gray-600">
          Your comprehensive platform for sterile processing education
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.activeStudents || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently enrolled
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Classes</CardTitle>
            <Calendar className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.upcomingClasses || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Scheduled this month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Materials</CardTitle>
            <BookOpen className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.materials || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Available resources
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Access</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
                <CardHeader>
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Features Showcase */}
      <Card className="bg-gradient-to-br from-primary to-blue-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Start Your Learning Journey</CardTitle>
          <CardDescription className="text-blue-100">
            Complete hands-on station tests, earn extra credit, and get certified
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Link href="/stations">
              <Button variant="secondary" size="lg">
                <FlaskConical className="mr-2 h-5 w-5" />
                Take a Station Test
              </Button>
            </Link>
            <Link href="/blog">
              <Button variant="outline" size="lg" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                <TrendingUp className="mr-2 h-5 w-5" />
                Earn Extra Credit
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
