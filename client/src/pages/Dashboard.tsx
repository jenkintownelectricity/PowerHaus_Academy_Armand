import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GlassCard } from '@/components/GlassCard';
import { AnalyticsChart } from '@/components/AnalyticsChart';
import { AchievementBadge } from '@/components/AchievementBadge';
import { CertificationCard } from '@/components/CertificationCard';
import {
  Users,
  Calendar,
  BookOpen,
  FlaskConical,
  MessageSquare,
  TrendingUp,
  Award,
  Target,
  Zap,
  Brain,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'wouter';
import { formatDate } from '@/lib/utils';

export default function DashboardEnhanced() {
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const res = await fetch('/api/stats');
      return res.json();
    },
  });

  const { data: progress = [] } = useQuery({
    queryKey: ['my-progress'],
    queryFn: async () => {
      const res = await fetch('/api/student-progress/current/me');
      return res.json();
    },
  });

  // Calculate user metrics
  const totalTests = progress.length;
  const passedTests = progress.filter((p: any) => p.passed).length;
  const averageScore = totalTests > 0
    ? Math.round(progress.reduce((acc: number, p: any) => acc + p.score, 0) / totalTests)
    : 0;
  const successRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

  // Mock data for achievements (in production, fetch from API)
  const achievements = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first hands-on station test',
      icon: 'target' as const,
      earned: totalTests > 0,
      earnedDate: progress[0]?.completedAt,
      rarity: 'common' as const,
    },
    {
      id: '2',
      title: 'Perfect Score',
      description: 'Achieve 100% on any station test',
      icon: 'star' as const,
      earned: progress.some((p: any) => p.score === 100),
      earnedDate: progress.find((p: any) => p.score === 100)?.completedAt,
      rarity: 'rare' as const,
    },
    {
      id: '3',
      title: 'Master of Five',
      description: 'Pass all 5 hands-on station tests',
      icon: 'trophy' as const,
      earned: passedTests >= 5,
      progress: passedTests,
      total: 5,
      rarity: 'epic' as const,
    },
    {
      id: '4',
      title: 'Speed Demon',
      description: 'Complete a station test in under 10 minutes',
      icon: 'zap' as const,
      earned: progress.some((p: any) => p.timeSpent < 600),
      earnedDate: progress.find((p: any) => p.timeSpent < 600)?.completedAt,
      rarity: 'rare' as const,
    },
    {
      id: '5',
      title: 'Excellence',
      description: 'Maintain an average score above 90%',
      icon: 'award' as const,
      earned: averageScore >= 90,
      progress: averageScore,
      total: 90,
      rarity: 'legendary' as const,
    },
    {
      id: '6',
      title: 'Dedicated Learner',
      description: 'Complete 10 station test attempts',
      icon: 'crown' as const,
      earned: totalTests >= 10,
      progress: totalTests,
      total: 10,
      rarity: 'epic' as const,
    },
  ];

  // Mock certification data
  const certifications = [
    {
      id: 1,
      name: 'Decontamination Specialist',
      status: 'active' as const,
      earnedDate: new Date('2025-01-15'),
      expiryDate: new Date('2026-01-15'),
      renewalRequired: true,
      category: 'Core Competency',
    },
    {
      id: 2,
      name: 'Sterilization Fundamentals',
      status: 'expiring_soon' as const,
      earnedDate: new Date('2024-12-01'),
      expiryDate: new Date('2025-02-28'),
      renewalRequired: true,
      category: 'Core Competency',
    },
  ];

  // Weekly progress data for chart
  const weeklyData = [
    { label: 'Mon', value: 2 },
    { label: 'Tue', value: 3 },
    { label: 'Wed', value: 1 },
    { label: 'Thu', value: 4 },
    { label: 'Fri', value: 2 },
    { label: 'Sat', value: 0 },
    { label: 'Sun', value: 1 },
  ];

  const earnedAchievements = achievements.filter(a => a.earned);
  const unearnedAchievements = achievements.filter(a => !a.earned);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section with Glassmorphism */}
      <GlassCard className="p-8" hover>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome Back to SPU LMS
            </h1>
            <p className="text-lg text-gray-600">
              Continue your journey to mastering sterile processing
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-gray-600">Ask JewelEE</span>
            </div>
            <p className="text-xs text-gray-500">Your AI Learning Assistant is ready</p>
          </div>
        </div>
      </GlassCard>

      {/* Stats Grid with Modern Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-xl transition-all hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{successRate}%</div>
            <Progress value={successRate} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {passedTests} of {totalTests} tests passed
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-xl transition-all hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Target className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{averageScore}%</div>
            <Progress value={averageScore} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Across all station tests
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-xl transition-all hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Completed</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalTests}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {earnedAchievements.length} achievements earned
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-xl transition-all hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Invested</CardTitle>
            <Clock className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round(progress.reduce((acc: number, p: any) => acc + p.timeSpent, 0) / 60)} min
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Total learning time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics & Achievements Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <AnalyticsChart
              title="Weekly Activity"
              description="Your test attempts this week"
              data={weeklyData}
              type="bar"
              trend="up"
              trendValue="+12%"
            />

            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
                <CardDescription>Your latest milestones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {earnedAchievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                    <Award className="w-8 h-8 text-primary" />
                    <div className="flex-1">
                      <p className="font-semibold">{achievement.title}</p>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                    <Badge variant="secondary">{achievement.rarity}</Badge>
                  </div>
                ))}
                {earnedAchievements.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Complete your first test to earn achievements!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-primary to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl">Continue Learning</CardTitle>
              <CardDescription className="text-blue-100">
                Pick up where you left off or start something new
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Link href="/stations">
                  <Button variant="secondary" size="lg">
                    <FlaskConical className="mr-2 h-5 w-5" />
                    Practice Stations
                  </Button>
                </Link>
                <Link href="/materials">
                  <Button variant="outline" size="lg" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Study Materials
                  </Button>
                </Link>
                <Link href="/community">
                  <Button variant="outline" size="lg" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Ask Community
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
              <CardDescription>
                {earnedAchievements.length} of {achievements.length} unlocked
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Progress value={(earnedAchievements.length / achievements.length) * 100} className="h-3" />
              </div>
            </CardContent>
          </Card>

          <div>
            <h3 className="text-lg font-semibold mb-4">Earned Achievements</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {earnedAchievements.map((achievement) => (
                <AchievementBadge key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Locked Achievements</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {unearnedAchievements.map((achievement) => (
                <AchievementBadge key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="certifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Certification Management</CardTitle>
              <CardDescription>
                Track your certifications and renewal dates
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {certifications.map((cert) => (
              <CertificationCard key={cert.id} cert={cert} />
            ))}
          </div>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Calendar className="w-6 h-6 text-yellow-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-yellow-900">Upcoming Renewals</h4>
                  <p className="text-sm text-yellow-800 mt-1">
                    You have 1 certification expiring within 60 days. Schedule your renewal today!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <AnalyticsChart
              title="Test Performance Trend"
              description="Your scores over time"
              data={progress.slice(-7).map((p: any, i: number) => ({
                label: `Test ${i + 1}`,
                value: p.score
              }))}
              type="bar"
              trend={averageScore >= 80 ? 'up' : 'down'}
              trendValue={averageScore >= 80 ? 'Strong' : 'Improving'}
            />

            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Insights</CardTitle>
                <CardDescription>Personalized learning recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Strong Performance</p>
                      <p className="text-sm text-blue-700">You're excelling in decontamination procedures!</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                  <div className="flex items-start gap-2">
                    <Brain className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-purple-900">Study Suggestion</p>
                      <p className="text-sm text-purple-700">Review packaging techniques for better results</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-start gap-2">
                    <Zap className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900">Quick Win</p>
                      <p className="text-sm text-green-700">Complete 2 more tests to unlock "Dedicated Learner"</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
