import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: any;
  trendData?: number[]; // ✅ ADICIONADO
}

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  trendData = [],
}: MetricCardProps) {
  return (
    <Card className="p-5 bg-white/[0.02] border border-white/10 rounded-2xl shadow-xl backdrop-blur-md">
      <div className="flex items-start justify-between">
        {/* ÍCONE */}
        <div className="p-3 rounded-xl bg-primary/10 text-primary">
          <Icon size={20} />
        </div>

        {/* VARIAÇÃO */}
        <span
          className={cn(
            "text-sm font-semibold",
            change >= 0 ? "text-green-400" : "text-red-400"
          )}
        >
          {change >= 0 ? "+" : ""}
          {change}%
        </span>
      </div>

      {/* TÍTULO */}
      <h3 className="text-sm text-muted-foreground mt-4">{title}</h3>

      {/* VALOR */}
      <p className="text-3xl font-bold tracking-tight mt-1">{value}</p>

      {/* 🔥 MINI GRÁFICO REAL */}
      {trendData.length > 0 && (
        <div className="h-12 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trendData.map((v) => ({ value: v }))}
            >
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
