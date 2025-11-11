import { ReactNode } from 'react';
import { GlassCard } from './GlassCard';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  subtitle?: string;
  trend?: ReactNode;
  trendData?: Array<{ name: string; value: number }>;
  className?: string;
}

export const MetricCard = ({
  title,
  value,
  change,
  icon: Icon,
  subtitle,
  trend,
  trendData,
  className,
}: MetricCardProps) => {
  return (
    <GlassCard className={cn('p-6', className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-primary/20 glow-primary">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        {change !== undefined && (
          <div
            className={cn(
              'text-sm font-medium font-mono-data',
              change >= 0 ? 'text-green-400' : 'text-red-400'
            )}
          >
            {change >= 0 ? '+' : ''}
            {change}%
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold font-mono-data">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>

      {(trend || trendData) && (
        <div className="mt-4">
          {trendData ? (
            <div className="h-[60px]">
              <ResponsiveContainer width="100%" height={60}>
                <AreaChart data={trendData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id={`gradient-${title.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill={`url(#gradient-${title.replace(/\s+/g, '-')})`}
                    isAnimationActive={true}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : trend}
        </div>
      )}
    </GlassCard>
  );
};
