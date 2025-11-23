import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface DataPoint {
  label: string;
  value: number;
}

interface AnalyticsChartProps {
  title: string;
  description?: string;
  data: DataPoint[];
  type?: 'bar' | 'line';
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export function AnalyticsChart({
  title,
  description,
  data,
  type = 'bar',
  trend,
  trendValue,
}: AnalyticsChartProps) {
  const maxValue = useMemo(() => Math.max(...data.map((d) => d.value), 1), [data]);

  const chartHeight = 200;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {trend && trendValue && (
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}
            >
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4" />
              ) : trend === 'down' ? (
                <TrendingDown className="w-4 h-4" />
              ) : null}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative" style={{ height: chartHeight }}>
          <div className="flex items-end justify-between h-full gap-2">
            {data.map((point, index) => {
              const heightPercentage = (point.value / maxValue) * 100;
              const barHeight = (chartHeight * heightPercentage) / 100;

              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full flex items-end justify-center" style={{ height: chartHeight }}>
                    {type === 'bar' && (
                      <div
                        className="w-full bg-gradient-to-t from-primary to-blue-400 rounded-t-md transition-all duration-500 hover:opacity-80 relative group"
                        style={{ height: barHeight }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {point.value}
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground text-center truncate w-full">
                    {point.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
