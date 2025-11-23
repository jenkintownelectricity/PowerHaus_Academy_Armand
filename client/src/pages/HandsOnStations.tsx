import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import {  FlaskConical, Clock, Award, CheckCircle2, PlayCircle } from 'lucide-react';

export default function HandsOnStations() {
  const { data: stations = [] } = useQuery({
    queryKey: ['stations'],
    queryFn: async () => {
      const res = await fetch('/api/stations');
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

  const getStationProgress = (stationId: number) => {
    const stationProgress = progress.filter((p: any) => p.stationId === stationId);
    if (stationProgress.length === 0) return null;
    const passed = stationProgress.some((p: any) => p.passed);
    const bestScore = Math.max(...stationProgress.map((p: any) => p.score));
    return { passed, bestScore, attempts: stationProgress.length };
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Hands-On Station Testing
        </h1>
        <p className="text-lg text-gray-600">
          Practice and test your skills with interactive station simulations
        </p>
      </div>

      {/* Instructions Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-blue-600" />
            How It Works
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
            <p><strong>Review Instructions:</strong> Each station provides detailed step-by-step guidance</p>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
            <p><strong>Target Time:</strong> Complete each station within 15 minutes</p>
          </div>
          <div className="flex items-start gap-2">
            <Award className="w-5 h-5 text-blue-600 mt-0.5" />
            <p><strong>Pass Requirements:</strong> Score 80% or higher to pass and receive certification</p>
          </div>
        </CardContent>
      </Card>

      {/* Stations Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {stations.map((station: any) => {
          const stationProgress = getStationProgress(station.id);

          return (
            <Card
              key={station.id}
              className="hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{station.name}</CardTitle>
                    <CardDescription>{station.description}</CardDescription>
                  </div>
                  {station.isActive && (
                    <Badge className="bg-green-500">Active</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{station.targetTime} min target</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    <span>{station.passingScore}% to pass</span>
                  </div>
                </div>

                {stationProgress && (
                  <div className="p-3 rounded-lg bg-gray-50 border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Your Progress:</span>
                      {stationProgress.passed ? (
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Passed
                        </Badge>
                      ) : (
                        <Badge variant="secondary">In Progress</Badge>
                      )}
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      Best Score: {stationProgress.bestScore}% · {stationProgress.attempts} attempt{stationProgress.attempts !== 1 && 's'}
                    </div>
                  </div>
                )}

                <Link href={`/stations/${station.id}`}>
                  <Button className="w-full" size="lg">
                    <PlayCircle className="w-5 h-5 mr-2" />
                    {stationProgress ? 'Continue Practice' : 'Start Station'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
