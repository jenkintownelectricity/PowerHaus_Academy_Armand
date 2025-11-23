import { Award, Trophy, Star, Target, Zap, Crown } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'award' | 'trophy' | 'star' | 'target' | 'zap' | 'crown';
  earned: boolean;
  earnedDate?: Date;
  progress?: number;
  total?: number;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
}

const ICON_MAP = {
  award: Award,
  trophy: Trophy,
  star: Star,
  target: Target,
  zap: Zap,
  crown: Crown,
};

const RARITY_COLORS = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-600',
};

export function AchievementBadge({ achievement }: { achievement: Achievement }) {
  const Icon = ICON_MAP[achievement.icon];
  const rarityColor = RARITY_COLORS[achievement.rarity || 'common'];

  return (
    <Card
      className={cn(
        'overflow-hidden transition-all hover:scale-105',
        achievement.earned ? 'cursor-pointer' : 'opacity-50'
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br',
              achievement.earned ? rarityColor : 'from-gray-300 to-gray-400'
            )}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-sm truncate">{achievement.title}</h4>
              {achievement.earned && achievement.rarity && (
                <Badge variant="secondary" className="text-xs">
                  {achievement.rarity}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {achievement.description}
            </p>
            {achievement.earned && achievement.earnedDate && (
              <p className="text-xs text-primary mt-1">
                Earned {new Date(achievement.earnedDate).toLocaleDateString()}
              </p>
            )}
            {!achievement.earned && achievement.progress !== undefined && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>
                    {achievement.progress}/{achievement.total}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{
                      width: `${((achievement.progress || 0) / (achievement.total || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
