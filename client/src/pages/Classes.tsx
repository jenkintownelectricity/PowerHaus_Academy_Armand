import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, DollarSign } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

const CLASS_TYPE_COLORS: Record<string, string> = {
  hybrid: 'bg-blue-500',
  online: 'bg-green-500',
  hands_on: 'bg-purple-500',
};

export default function Classes() {
  const { data: classes = [] } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const res = await fetch('/api/classes');
      return res.json();
    },
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Class Schedule
        </h1>
        <p className="text-lg text-gray-600">
          Browse and enroll in upcoming classes
        </p>
      </div>

      <div className="grid gap-6">
        {classes.map((cls: any) => (
          <Card key={cls.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-2xl">{cls.title}</CardTitle>
                    <Badge className={CLASS_TYPE_COLORS[cls.type]}>
                      {cls.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <CardDescription className="text-base">{cls.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{formatDate(cls.scheduleDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{cls.scheduleTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{cls.enrolled}/{cls.capacity} enrolled</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span>{formatCurrency(cls.price)}</span>
                </div>
              </div>
              <Button className="w-full md:w-auto">Enroll Now</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
