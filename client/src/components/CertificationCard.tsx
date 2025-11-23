import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Award, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Certification {
  id: number;
  name: string;
  status: 'active' | 'expiring_soon' | 'expired';
  earnedDate: Date;
  expiryDate: Date;
  renewalRequired: boolean;
  category: string;
}

export function CertificationCard({ cert }: { cert: Certification }) {
  const daysUntilExpiry = Math.ceil(
    (new Date(cert.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const statusConfig = {
    active: {
      color: 'bg-green-500',
      icon: CheckCircle2,
      text: 'Active',
      variant: 'default' as const,
    },
    expiring_soon: {
      color: 'bg-yellow-500',
      icon: AlertCircle,
      text: 'Expiring Soon',
      variant: 'secondary' as const,
    },
    expired: {
      color: 'bg-red-500',
      icon: AlertCircle,
      text: 'Expired',
      variant: 'destructive' as const,
    },
  };

  const config = statusConfig[cert.status];
  const StatusIcon = config.icon;
  const progressValue = cert.status === 'expired' ? 0 : Math.max(0, (daysUntilExpiry / 365) * 100);

  return (
    <Card className="hover:shadow-lg transition-all">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`w-12 h-12 rounded-lg ${config.color} flex items-center justify-center`}>
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">{cert.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{cert.category}</p>
            </div>
          </div>
          <Badge variant={config.variant} className="gap-1">
            <StatusIcon className="w-3 h-3" />
            {config.text}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Time Remaining</span>
            <span className="font-medium">
              {cert.status === 'expired' ? 'Expired' : `${daysUntilExpiry} days`}
            </span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Earned</p>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{formatDate(cert.earnedDate)}</span>
            </div>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Expires</p>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{formatDate(cert.expiryDate)}</span>
            </div>
          </div>
        </div>

        {cert.renewalRequired && (
          <Button
            className="w-full"
            variant={cert.status === 'expired' ? 'destructive' : 'default'}
          >
            {cert.status === 'expired' ? 'Renew Now' : 'Schedule Renewal'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
