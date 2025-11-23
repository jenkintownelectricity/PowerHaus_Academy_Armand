import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, Users, Calendar, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function OnlineClasses() {
  const { data: classes = [] } = useQuery({
    queryKey: ['online-classes'],
    queryFn: async () => {
      const res = await fetch('/api/online-classes');
      return res.json();
    },
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Online Classes
        </h1>
        <p className="text-lg text-gray-600">
          Join live sessions and access recorded classes
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {classes.map((cls: any) => (
          <Card key={cls.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant={cls.isLive ? 'default' : 'secondary'} className={cls.isLive ? 'bg-red-500 animate-pulse' : ''}>
                  {cls.isLive ? '🔴 Live Now' : 'Scheduled'}
                </Badge>
              </div>
              <CardTitle className="text-xl">{cls.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{cls.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{formatDate(cls.scheduleDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{cls.scheduleTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{cls.studentCount} students watching</span>
                </div>
              </div>
              <Button className="w-full">
                <Video className="w-4 h-4 mr-2" />
                {cls.isLive ? 'Join Live Class' : 'View Recording'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
