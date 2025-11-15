import { DashboardLayout } from "@/components/DashboardLayout";
import { MetricCard } from "@/components/MetricCard";
import { GlassCard } from "@/components/GlassCard";
import { Smile, Minus, Frown, TrendingUp, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDashboardEngagement } from "@/services/dashboard";

// ---------------------------------------------
// Função para gerar iniciais do username
// ---------------------------------------------
function getInitials(username: string) {
  if (!username) return "?";
  const clean = username.replace("@", "");
  const parts = clean.split(/[\._]/);

  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  return clean.substring(0, 2).toUpperCase();
}

// ---------------------------------------------
// Mini Trend Chart (SVG simples)
// ---------------------------------------------
function MiniTrendChart({ data }: { data: number[] }) {
  if (!data || data.length === 0) {
    return <div className="h-12 w-full" />;
  }

  const max = Math.max(...data);

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1 || 1)) * 100;
      const y = 30 - (v / (max || 1)) * 25;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="h-12 w-full overflow-hidden">
      <svg viewBox="0 0 100 30" className="w-full h-full">
        <defs>
          <linearGradient id="feedGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="1" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </linearGradient>
        </defs>

        <polyline
          fill="url(#feedGradient)"
          stroke="#8B5CF6"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points}
        />
      </svg>
    </div>
  );
}

// ---------------------------------------------
// FEED PAGE
// ---------------------------------------------
export default function Feed() {
  const { data, isLoading } = useDashboardEngagement();

  if (!data || isLoading) {
    return (
      <DashboardLayout>
        <div className="p-10 text-center text-muted-foreground text-lg">
          Carregando métricas do Feed...
        </div>
      </DashboardLayout>
    );
  }

  const feed = data.feed;

  // fallback se o backend ainda não estiver mandando trends
  const emptyTrends = {
    totalTrendData: [] as number[],
    positiveTrendData: [] as number[],
    neutralTrendData: [] as number[],
    negativeTrendData: [] as number[],
  };

  const sentimentos = feed.sentimentos;
  const recentes = feed.recentes || [];
  const trends = feed.trends ?? emptyTrends;

  const total =
    sentimentos.positivo + sentimentos.neutro + sentimentos.negativo;

  const percentuais = {
    positivo: total ? Math.round((sentimentos.positivo / total) * 100) : 0,
    neutro: total ? Math.round((sentimentos.neutro / total) * 100) : 0,
    negativo: total ? Math.round((sentimentos.negativo / total) * 100) : 0,
  };

  const getSentimentColor = (s: string) => {
    switch (s) {
      case "positivo":
        return "text-green-400";
      case "negativo":
        return "text-red-400";
      default:
        return "text-yellow-400";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Feed Analytics</h1>
          <p className="text-muted-foreground">
            Métricas de engajamento do Feed
          </p>
        </div>

        {/* KPI CARDS (sem change, só minigráfico) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total de Interações"
            value={total}
            icon={TrendingUp}
            trendData={trends.totalTrendData}
          />

          <MetricCard
            title="Positivo"
            value={sentimentos.positivo}
            icon={Smile}
            trendData={trends.positiveTrendData}
          />

          <MetricCard
            title="Neutro"
            value={sentimentos.neutro}
            icon={Minus}
            trendData={trends.neutralTrendData}
          />

          <MetricCard
            title="Negativo"
            value={sentimentos.negativo}
            icon={Frown}
            trendData={trends.negativeTrendData}
          />
        </div>

        {/* TERMÔMETRO */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold mb-6">Análise de Sentimento</h3>

          <div className="space-y-6">
            {[
              {
                label: "Positivo",
                value: percentuais.positivo,
                color: "rgba(34,197,94,0.4)",
              },
              {
                label: "Neutro",
                value: percentuais.neutro,
                color: "rgba(234,179,8,0.4)",
              },
              {
                label: "Negativo",
                value: percentuais.negativo,
                color: "rgba(239,68,68,0.4)",
              },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {item.label}
                  </span>
                  <span className="text-xl font-bold font-mono-data">
                    {item.value}%
                  </span>
                </div>

                <div className="h-3 bg-white/5 border border-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.value}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* ÚLTIMOS COMENTÁRIOS */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">
              Últimos comentários no Feed
            </h3>
          </div>

          <div className="space-y-4">
            {recentes.slice(0, 20).map((c, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] hover:border-primary/30 transition-all"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-12 h-12 border-primary/20 border-2">
                    <AvatarFallback className="bg-primary/20 text-white font-semibold">
                      {getInitials(c.username)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-primary font-semibold text-sm">
                        @{c.username}
                      </span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {c.data}
                      </span>
                    </div>

                    <p
                      className={`text-sm ${getSentimentColor(c.sentimento)}`}
                    >
                      {c.comentario}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
