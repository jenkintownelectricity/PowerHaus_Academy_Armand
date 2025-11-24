import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dumbbell,
  Zap,
  Wind,
  Apple,
  Brain,
  Heart,
  Calendar,
  TrendingUp,
  Award,
  CheckCircle,
  Lock,
  Target,
} from 'lucide-react';

const PILLARS = [
  {
    id: 'strength',
    name: 'Strength',
    icon: Dumbbell,
    color: '#B266FF',
    gradient: 'from-purple-600 to-purple-800',
    description: 'Build raw power and muscular development',
  },
  {
    id: 'conditioning',
    name: 'Conditioning',
    icon: Zap,
    color: '#00FFA3',
    gradient: 'from-cyan-500 to-cyan-700',
    description: 'Enhance endurance and cardiovascular health',
  },
  {
    id: 'mobility',
    name: 'Mobility',
    icon: Wind,
    color: '#60A5FA',
    gradient: 'from-blue-500 to-blue-700',
    description: 'Improve flexibility and range of motion',
  },
  {
    id: 'nutrition',
    name: 'Nutrition',
    icon: Apple,
    color: '#34D399',
    gradient: 'from-green-500 to-green-700',
    description: 'Fuel your body for optimal performance',
  },
  {
    id: 'mindset',
    name: 'Mindset',
    icon: Brain,
    color: '#F59E0B',
    gradient: 'from-amber-500 to-amber-700',
    description: 'Develop mental fortitude and focus',
  },
  {
    id: 'recovery',
    name: 'Recovery',
    icon: Heart,
    color: '#EF4444',
    gradient: 'from-red-500 to-red-700',
    description: 'Optimize rest and regeneration',
  },
];

export default function Programs() {
  // Fetch available programs
  const { data: programs = [] } = useQuery({
    queryKey: ['programs'],
    queryFn: async () => {
      const res = await fetch('/api/programs');
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Fetch user's current program and progress
  const { data: userProgress } = useQuery({
    queryKey: ['user-program-progress'],
    queryFn: async () => {
      const res = await fetch('/api/programs/my-progress');
      if (!res.ok) return null;
      return res.json();
    },
  });

  return (
    <div className="min-h-screen bg-black p-6 space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-8 powerhaus-card">
        <h1 className="text-4xl font-bold text-white mb-2">The 6 Pillars</h1>
        <p className="text-gray-400 text-lg">
          Master all six pillars of fitness to unlock your full potential
        </p>
      </div>

      {/* Current Program Progress */}
      {userProgress && (
        <div className="glass-card rounded-2xl p-8 powerhaus-gradient-soft border-2 border-purple-500/30">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Badge className="bg-purple-500/20 text-purple-400 mb-3">Current Program</Badge>
              <h2 className="text-3xl font-bold text-white mb-2">
                {userProgress.programTitle}
              </h2>
              <p className="text-gray-400">Week {userProgress.currentWeek} of {userProgress.totalWeeks}</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-white mb-2">
                {userProgress.completionPercentage}%
              </div>
              <p className="text-sm text-gray-400">Complete</p>
            </div>
          </div>

          <Progress value={userProgress.completionPercentage} className="h-3 mb-4" />

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="glass rounded-xl p-4 text-center">
              <Calendar className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{userProgress.daysActive}</div>
              <div className="text-xs text-gray-400">Days Active</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <TrendingUp className="w-8 h-8 text-cyan-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{userProgress.sessionsCompleted}</div>
              <div className="text-xs text-gray-400">Sessions Done</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{userProgress.badgesEarned}</div>
              <div className="text-xs text-gray-400">Badges</div>
            </div>
          </div>
        </div>
      )}

      {/* The 6 Pillars */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Target className="w-7 h-7 text-purple-500" />
          Master the Pillars
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.id}
              className="glass-card rounded-2xl overflow-hidden hover-lift group cursor-pointer"
            >
              {/* Pillar Header */}
              <div className={`p-8 bg-gradient-to-br ${pillar.gradient} relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <pillar.icon className="w-full h-full" />
                </div>
                <div className="relative z-10">
                  <pillar.icon className="w-12 h-12 text-white mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">{pillar.name}</h3>
                  <p className="text-white/80 text-sm">{pillar.description}</p>
                </div>
              </div>

              {/* Pillar Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400 text-sm">Your Progress</span>
                  <span className="text-white font-bold">Level 3</span>
                </div>
                <Progress value={45} className="h-2 mb-4" />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="glass rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-white">12</div>
                    <div className="text-xs text-gray-400">Workouts</div>
                  </div>
                  <div className="glass rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-white">450</div>
                    <div className="text-xs text-gray-400">XP</div>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
                >
                  Continue Training
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Programs */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Available Programs</h2>

        {programs.length === 0 ? (
          <div className="glass-card rounded-2xl p-20 text-center">
            <Lock className="w-20 h-20 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-semibold text-white mb-2">No Programs Available</h3>
            <p className="text-gray-400">Check back soon for new programs!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {programs.map((program: any) => (
              <div
                key={program.id}
                className="glass-card rounded-2xl p-6 hover-lift cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{program.title}</h3>
                    <p className="text-gray-400 mb-4">{program.description}</p>
                  </div>
                  {program.price > 0 && (
                    <Badge className="bg-green-500/20 text-green-400">
                      ${(program.price / 100).toFixed(2)}
                    </Badge>
                  )}
                </div>

                {/* Program Details */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {program.duration} weeks
                  </div>
                  <Badge
                    className={
                      program.difficulty === 'beginner'
                        ? 'bg-green-500/20 text-green-400'
                        : program.difficulty === 'intermediate'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }
                  >
                    {program.difficulty}
                  </Badge>
                </div>

                {/* Included Pillars */}
                <div className="mb-6">
                  <p className="text-xs text-gray-500 mb-2">Includes:</p>
                  <div className="flex gap-2">
                    {program.pillarsIncluded?.map((pillarId: string) => {
                      const pillar = PILLARS.find(p => p.id === pillarId);
                      return pillar ? (
                        <div
                          key={pillarId}
                          className="p-2 rounded-lg bg-white/5 border border-white/10"
                          title={pillar.name}
                        >
                          <pillar.icon className="w-5 h-5" style={{ color: pillar.color }} />
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>

                <Button className="w-full bg-purple-500 hover:bg-purple-600">
                  {program.price > 0 ? 'Enroll Now' : 'Start Free'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
