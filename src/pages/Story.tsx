// src/pages/Story.tsx

import { DashboardLayout } from "@/components/DashboardLayout";
import { MetricCard } from "@/components/MetricCard";
import { useDashboardEngagement } from "@/services/dashboard";
import { TrendingUp, Smile, Minus, Frown } from "lucide-react";

export default function Story() {
  const { data, isLoading } = useDashboardEngagement();

  if (isLoading || !data || !data.story) {
    return (
      <DashboardLayout>
        <p className="text-muted-foreground">Carregando Story Analytics...</p>
      </DashboardLayout>
    );
  }

  const story = data.story;

  // Função segura para iniciais
  const getInitials = (username: string | undefined | null) => {
    if (!username || typeof username !== "string") return "??";

    const clean = username.replace("@", "").trim();
    if (!clean) return "??";

    const parts = clean.split(/[._]/).filter(Boolean);

    if (parts.length >= 2) {
      const a = parts[0][0]?.toUpperCase() || "?";
      const b = parts[1][0]?.toUpperCase() || "?";
      return `${a}${b}`;
    }

    const first = clean[0]?.toUpperCase() || "?";
    const second = clean[1]?.toUpperCase() || "?";
    return `${first}${second}`;
  };

  // Total real de interações de story
  const totalInteracoes =
    story.sentimentos.positivo +
    story.sentimentos.neutro +
    story.sentimentos.negativo;

  // Porcentagens reais
  const percentualPos = (story.sentimentos.positivo / (totalInteracoes || 1)) * 100;
  const percentualNeu = (story.sentimentos.neutro / (totalInteracoes || 1)) * 100;
  const percentualNeg = (story.sentimentos.negativo / (totalInteracoes || 1)) * 100;

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div>
          <h1 className="text-4xl font-bold mb-2">Story Analytics</h1>
          <p className="text-muted-foreground">Métricas reais dos seus stories</p>
        </div>

        {/* MÉTRICAS COM MINI-GRÁFICOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <MetricCard
            title="Total de Interações"
            value={totalInteracoes}
            icon={TrendingUp}
            trendData={story.trends.totalTrendData}
          />

          <MetricCard
            title="Positivo"
            value={story.sentimentos.positivo}
            icon={Smile}
            trendData={story.trends.positiveTrendData}
          />

          <MetricCard
            title="Neutro"
            value={story.sentimentos.neutro}
            icon={Minus}
            trendData={story.trends.neutralTrendData}
          />

          <MetricCard
            title="Negativo"
            value={story.sentimentos.negativo}
            icon={Frown}
            trendData={story.trends.negativeTrendData}
          />
        </div>

        {/* TERMÔMETRO DE SENTIMENTO */}
        <div className="p-6 rounded-lg glass">
          <h3 className="text-lg font-semibold mb-6">Termômetro de Sentimento</h3>

          <div className="space-y-6 max-w-3xl mx-auto">

            {/* Positivo */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground">Positivo</span>
                <span className="text-xl font-bold font-mono-data">{percentualPos.toFixed(1)}%</span>
              </div>
              <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-green-500/30 transition-all"
                  style={{ width: `${percentualPos}%` }}
                />
              </div>
            </div>

            {/* Neutro */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground">Neutro</span>
                <span className="text-xl font-bold font-mono-data">{percentualNeu.toFixed(1)}%</span>
              </div>
              <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-yellow-500/30 transition-all"
                  style={{ width: `${percentualNeu}%` }}
                />
              </div>
            </div>

            {/* Negativo */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground">Negativo</span>
                <span className="text-xl font-bold font-mono-data">{percentualNeg.toFixed(1)}%</span>
              </div>
              <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-red-500/30 transition-all"
                  style={{ width: `${percentualNeg}%` }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* ÚLTIMAS INTERAÇÕES DE STORY */}
        <div className="p-6 rounded-lg glass">
          <h3 className="text-lg font-semibold mb-4">Últimas Interações</h3>

          <div className="space-y-3">
            {story.recentes.slice(0, 6).map((interaction, i) => (
              <div
                key={i}
                className="p-4 rounded-lg bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] hover:border-primary/30 transition-all"
              >
                <div className="flex items-start gap-3">
                  
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {getInitials(interaction.username)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-primary">
                      {interaction.username || "@desconhecido"}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {interaction.comentario}
                    </p>

                    <p className="text-xs text-muted-foreground mt-1">
                      {interaction.data}
                    </p>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
