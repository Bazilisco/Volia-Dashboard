// src/components/MetricCard.tsx

import { Card } from "@/components/ui/card";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: any;
  trendData?: number[];
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  trendData = [],
}: MetricCardProps) {
  const chartData = trendData.map((v) => ({ value: v }));

  return (
    <Card className="p-5 bg-white/[0.02] border border-white/10 rounded-2xl shadow-xl backdrop-blur-md relative overflow-hidden">

      {/* ICON */}
      <div className="flex items-start justify-between">
        <div className="p-3 rounded-xl bg-primary/10 text-primary">
          <Icon size={20} />
        </div>
      </div>

      {/* TITLE */}
      <h3 className="text-sm text-muted-foreground mt-4">{title}</h3>

      {/* VALUE */}
      <p className="text-3xl font-bold tracking-tight mt-1">{value}</p>

      {/* MINI GRAPH */}
      {trendData.length > 0 && (
        <div className="h-14 mt-4 w-full pointer-events-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="miniGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(168, 85, 247, 0.6)" />
                  <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
                </linearGradient>
              </defs>

              <Area
                type="monotone"
                dataKey="value"
                stroke="#A855F7"
                fill="url(#miniGradient)"
                strokeWidth={2.4}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
