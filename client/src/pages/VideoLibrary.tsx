import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Play,
  Clock,
  Dumbbell,
  Zap,
  Wind,
  Apple,
  Brain,
  Heart,
  Search,
  Filter,
  Star,
  Eye,
} from 'lucide-react';
import { useState } from 'react';

const PILLARS = [
  { id: 'all', name: 'All Videos', icon: Play, color: '#B266FF' },
  { id: 'strength', name: 'Strength', icon: Dumbbell, color: '#B266FF' },
  { id: 'conditioning', name: 'Conditioning', icon: Zap, color: '#00FFA3' },
  { id: 'mobility', name: 'Mobility', icon: Wind, color: '#60A5FA' },
  { id: 'nutrition', name: 'Nutrition', icon: Apple, color: '#34D399' },
  { id: 'mindset', name: 'Mindset', icon: Brain, color: '#F59E0B' },
  { id: 'recovery', name: 'Recovery', icon: Heart, color: '#EF4444' },
];

const DIFFICULTY_COLORS = {
  beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
  intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function VideoLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPillar, setSelectedPillar] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  // Fetch video library
  const { data: videos = [] } = useQuery({
    queryKey: ['video-library', selectedPillar],
    queryFn: async () => {
      const url = selectedPillar === 'all'
        ? '/api/videos'
        : `/api/videos?pillar=${selectedPillar}`;
      const res = await fetch(url);
      if (!res.ok) return [];
      return res.json();
    },
  });

  const filteredVideos = videos.filter((video: any) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black p-6 space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-8 powerhaus-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Video Library</h1>
            <p className="text-gray-400">
              Access premium workout videos, tutorials, and educational content
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-purple-500/20 text-purple-400 text-lg px-4 py-2">
              {videos.length} Videos
            </Badge>
          </div>
        </div>

        {/* Search */}
        <div className="relative mt-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-black/40 border-white/10 text-white placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Pillar Filter Tabs */}
      <div className="glass-dark rounded-2xl p-2">
        <div className="flex gap-2 overflow-x-auto">
          {PILLARS.map((pillar) => (
            <button
              key={pillar.id}
              onClick={() => setSelectedPillar(pillar.id)}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl transition-all whitespace-nowrap
                ${selectedPillar === pillar.id
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <pillar.icon className="w-5 h-5" />
              {pillar.name}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      {selectedVideo ? (
        /* Video Player View */
        <div className="space-y-6">
          <Button
            onClick={() => setSelectedVideo(null)}
            variant="ghost"
            className="text-purple-400 hover:text-purple-300"
          >
            ← Back to Library
          </Button>

          <div className="glass-card rounded-2xl overflow-hidden">
            {/* Video Player */}
            <div className="relative aspect-video bg-black">
              {selectedVideo.videoUrl ? (
                <video
                  src={selectedVideo.videoUrl}
                  controls
                  className="w-full h-full"
                  autoPlay
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/50 to-black">
                  <Play className="w-24 h-24 text-purple-500/50" />
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {selectedVideo.title}
                  </h2>
                  <p className="text-gray-400">{selectedVideo.description}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={DIFFICULTY_COLORS[selectedVideo.difficulty as keyof typeof DIFFICULTY_COLORS]}>
                    {selectedVideo.difficulty}
                  </Badge>
                  {selectedVideo.targetedPillars?.map((pillar: string) => {
                    const pillarData = PILLARS.find(p => p.id === pillar);
                    return pillarData ? (
                      <Badge key={pillar} className="bg-purple-500/20 text-purple-400">
                        {pillarData.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {selectedVideo.duration} min
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  1.2K views
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  4.8 / 5.0
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <Button className="bg-purple-500 hover:bg-purple-600 flex-1">
                  Mark as Complete
                </Button>
                <Button variant="outline" className="border-white/10 hover:bg-white/5">
                  Add to Favorites
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Video Grid View */
        <>
          {filteredVideos.length === 0 ? (
            <div className="glass-card rounded-2xl p-20 text-center">
              <Play className="w-20 h-20 mx-auto mb-4 text-gray-600" />
              <h3 className="text-xl font-semibold text-white mb-2">No videos found</h3>
              <p className="text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video: any) => (
                <div
                  key={video.id}
                  className="glass-card rounded-xl overflow-hidden hover-lift cursor-pointer group"
                  onClick={() => setSelectedVideo(video)}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gradient-to-br from-purple-900/50 to-black overflow-hidden">
                    {video.thumbnailUrl ? (
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-16 h-16 text-purple-500/50" />
                      </div>
                    )}

                    {/* Play Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center powerhaus-glow">
                        <Play className="w-8 h-8 text-white fill-white" />
                      </div>
                    </div>

                    {/* Duration Badge */}
                    <Badge className="absolute bottom-2 right-2 bg-black/80 text-white">
                      <Clock className="w-3 h-3 mr-1" />
                      {video.duration} min
                    </Badge>
                  </div>

                  {/* Video Info */}
                  <div className="p-5">
                    <h3 className="text-white font-semibold text-lg mb-2 line-clamp-1">
                      {video.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {video.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <Badge className={DIFFICULTY_COLORS[video.difficulty as keyof typeof DIFFICULTY_COLORS]}>
                        {video.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        4.8
                      </div>
                    </div>

                    {/* Targeted Pillars */}
                    {video.targetedPillars && video.targetedPillars.length > 0 && (
                      <div className="flex gap-1 mt-3">
                        {video.targetedPillars.slice(0, 3).map((pillar: string) => {
                          const pillarData = PILLARS.find(p => p.id === pillar);
                          return pillarData ? (
                            <div
                              key={pillar}
                              className="p-1 rounded bg-white/5"
                              title={pillarData.name}
                            >
                              <pillarData.icon className="w-4 h-4" style={{ color: pillarData.color }} />
                            </div>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
