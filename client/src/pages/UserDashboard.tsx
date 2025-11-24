import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  User,
  Trophy,
  Camera,
  Lightbulb,
  Users,
  Globe,
  Briefcase,
  FolderOpen,
  Calendar,
  Play,
  Upload,
  TrendingUp,
  Award,
  Target,
  Flame,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';

// PowerHaus Academy 6 Pillars - Digital Media & Content Creation
const PILLARS = [
  {
    id: 'digital_confidence',
    name: 'Digital Confidence & Mindset',
    icon: Sparkles,
    color: '#B266FF',
    gradient: 'from-purple-600 to-purple-800',
    description: 'Identity, self-belief, discipline, creative courage'
  },
  {
    id: 'media_skills',
    name: 'Media & Content Skills',
    icon: Camera,
    color: '#00FFA3',
    gradient: 'from-cyan-500 to-cyan-700',
    description: 'Camera work, editing, storytelling, content creation'
  },
  {
    id: 'creative_leadership',
    name: 'Creative Leadership',
    icon: Users,
    color: '#60A5FA',
    gradient: 'from-blue-500 to-blue-700',
    description: 'Turning ideas into action, collaboration, speaking'
  },
  {
    id: 'digital_literacy',
    name: 'Digital Literacy',
    icon: Globe,
    color: '#34D399',
    gradient: 'from-green-500 to-green-700',
    description: 'Online safety, professionalism, audience understanding'
  },
  {
    id: 'entrepreneurship',
    name: 'Entrepreneurship Basics',
    icon: Briefcase,
    color: '#F59E0B',
    gradient: 'from-amber-500 to-amber-700',
    description: 'Creator economy, digital jobs, business mindset'
  },
  {
    id: 'portfolio',
    name: 'Portfolio Building',
    icon: FolderOpen,
    color: '#EF4444',
    gradient: 'from-red-500 to-red-700',
    description: 'Creating projects, digital portfolio, showcase work'
  },
];

export default function UserDashboard() {
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Fetch user data
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await fetch('/api/auth/me');
      if (!res.ok) return null;
      return res.json();
    },
  });

  // Fetch pillar progress
  const { data: pillarProgress = [] } = useQuery({
    queryKey: ['pillar-progress'],
    queryFn: async () => {
      const res = await fetch('/api/pillar-progress');
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Fetch user badges
  const { data: badges = [] } = useQuery({
    queryKey: ['user-badges'],
    queryFn: async () => {
      const res = await fetch('/api/badges');
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Fetch upcoming classes
  const { data: upcomingClasses = [] } = useQuery({
    queryKey: ['upcoming-classes'],
    queryFn: async () => {
      const res = await fetch('/api/classes/upcoming');
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Fetch user stats
  const { data: stats } = useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const res = await fetch('/api/stats');
      if (!res.ok) return {
        totalProjects: 0,
        weekStreak: 0,
        totalPoints: 0,
        hoursInvested: 0,
      };
      return res.json();
    },
  });

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const res = await fetch('/api/profile/picture', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-6 space-y-6">
      {/* Header with Profile */}
      <div className="glass-card rounded-2xl p-8 powerhaus-card hover-lift">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            {/* Profile Picture */}
            <div className="relative group">
              <div className="w-28 h-28 rounded-full powerhaus-glow overflow-hidden border-4 border-purple-500/30">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                )}
              </div>
              <label
                htmlFor="profile-upload"
                className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Upload className="w-6 h-6 text-white" />
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePictureUpload}
                  disabled={uploadingPhoto}
                />
              </label>
            </div>

            {/* User Info */}
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-gray-400 text-lg">
                Your creative journey continues 🎬
              </p>
              {user?.bio && (
                <p className="text-gray-500 mt-2 max-w-md">{user.bio}</p>
              )}
              {user?.portfolioUrl && (
                <a
                  href={user.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <FolderOpen className="w-4 h-4" />
                  View My Portfolio →
                </a>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass p-4 rounded-xl text-center">
              <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{stats?.weekStreak || 0}</div>
              <div className="text-xs text-gray-400">Day Streak</div>
            </div>
            <div className="glass p-4 rounded-xl text-center">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{stats?.totalPoints || 0}</div>
              <div className="text-xs text-gray-400">Points</div>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Pillars Progress */}
      <div className="glass-card rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Target className="w-7 h-7 text-purple-500" />
            Your 6 Pillars Progress
          </h2>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
            Master Digital Media
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PILLARS.map((pillar) => {
            const progress = pillarProgress.find((p: any) => p.pillar === pillar.id) || {
              level: 1,
              xp: 0,
              completedMilestones: 0,
              totalMilestones: 10,
            };
            const progressPercent = (progress.completedMilestones / progress.totalMilestones) * 100;

            return (
              <div
                key={pillar.id}
                className="glass rounded-xl p-5 hover-lift transition-smooth border border-white/5 hover:border-purple-500/30"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${pillar.gradient}`}>
                      <pillar.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm">{pillar.name}</h3>
                      <p className="text-xs text-gray-400">Level {progress.level}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">{progress.xp} XP</div>
                  </div>
                </div>
                <Progress value={progressPercent} className="h-2 mb-2" />
                <div className="text-xs text-gray-400">
                  {progress.completedMilestones} / {progress.totalMilestones} milestones
                </div>
                <p className="text-xs text-gray-500 mt-2 line-clamp-1">{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Badges & Achievements */}
        <div className="glass-card rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Award className="w-7 h-7 text-yellow-500" />
              Achievements
            </h2>
            <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
              View All
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {badges.length > 0 ? (
              badges.slice(0, 6).map((badge: any, idx: number) => (
                <div
                  key={idx}
                  className="glass rounded-xl p-4 text-center hover-lift cursor-pointer group"
                >
                  <div className={`text-4xl mb-2 group-hover:scale-110 transition-transform`}>
                    {badge.badgeIcon}
                  </div>
                  <div className="text-xs text-white font-semibold truncate">
                    {badge.badgeName}
                  </div>
                  <Badge
                    className={`mt-2 text-xs ${
                      badge.tier === 'diamond'
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : badge.tier === 'platinum'
                        ? 'bg-gray-300/20 text-gray-300'
                        : badge.tier === 'gold'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : badge.tier === 'silver'
                        ? 'bg-gray-400/20 text-gray-400'
                        : 'bg-orange-500/20 text-orange-400'
                    }`}
                  >
                    {badge.tier}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-gray-500">
                <Trophy className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>Start your journey to unlock badges!</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="glass-card rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-7 h-7 text-cyan-500" />
              Upcoming Sessions
            </h2>
            <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
              View Schedule
            </Button>
          </div>

          <div className="space-y-3">
            {upcomingClasses.length > 0 ? (
              upcomingClasses.slice(0, 4).map((cls: any) => (
                <div
                  key={cls.id}
                  className="glass rounded-xl p-4 hover-lift flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500">
                      <Play className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{cls.title}</h3>
                      <p className="text-xs text-gray-400">
                        {new Date(cls.scheduleDate).toLocaleDateString()} at {cls.scheduleTime}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-cyan-500/20 text-cyan-400">
                    {cls.type}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>No upcoming sessions</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-6 text-center powerhaus-card">
          <FolderOpen className="w-10 h-10 text-purple-500 mx-auto mb-3" />
          <div className="text-3xl font-bold text-white mb-1">{stats?.totalProjects || 0}</div>
          <div className="text-sm text-gray-400">Projects Created</div>
        </div>
        <div className="glass-card rounded-xl p-6 text-center powerhaus-card">
          <Calendar className="w-10 h-10 text-cyan-500 mx-auto mb-3" />
          <div className="text-3xl font-bold text-white mb-1">{stats?.weekStreak || 0}</div>
          <div className="text-sm text-gray-400">Week Streak</div>
        </div>
        <div className="glass-card rounded-xl p-6 text-center powerhaus-card">
          <Award className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
          <div className="text-3xl font-bold text-white mb-1">{badges.length}</div>
          <div className="text-sm text-gray-400">Badges Earned</div>
        </div>
        <div className="glass-card rounded-xl p-6 text-center powerhaus-card">
          <TrendingUp className="w-10 h-10 text-orange-500 mx-auto mb-3" />
          <div className="text-3xl font-bold text-white mb-1">{stats?.hoursInvested || 0}h</div>
          <div className="text-sm text-gray-400">Hours Learning</div>
        </div>
      </div>
    </div>
  );
}
