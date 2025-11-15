// src/pages/Reels.tsx
import { DashboardLayout } from "@/components/DashboardLayout";
import { MetricCard } from "@/components/MetricCard";
import { GlassCard } from "@/components/GlassCard";
import { useDashboardEngagement } from "@/services/dashboard";

import {
  TrendingUp,
  Smile,
  Minus,
  Frown,
  MessageCircle,
  Film,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Reels() {
  const { data, isLoading } = useDashboardEngagement();

  if (isLoading || !data) {
    return (
      <DashboardLayout>
        <p className="text-muted-foreground">Carregando dados de Reels...</p>
      </DashboardLayout>
    );
  }

  // 🔹 Pega o bloco de REELS vindo da API
  const reels = data.reels;

  // ================================
  // FUNÇÃO SEGURA PARA GERAR INICIAIS
  // ================================
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

  // ================================
  // CÁLCULO DO TERMÔMETRO
  // ================================
  const totalInteracoes =
    reels.sentimentos.positivo +
    reels.sentimentos.neutro +
    reels.sentimentos.negativo;

  const totalSeguro = totalInteracoes || 1;

  const sentimentoPct = {
    positivo: (reels.sentimentos.positivo / totalSeguro) * 100,
    neutro: (reels.sentimentos.neutro / totalSeguro) * 100,
    negativo: (reels.sentimentos.negativo / totalSeguro) * 100,
  };

  // 🔹 Garantir arrays mesmo se trends vier undefined
  const trends = reels.trends || {
    totalTrendData: [] as number[],
    positiveTrendData: [] as number[],
    neutralTrendData: [] as number[],
    negativeTrendData: [] as number[],
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* --------------------- */}
        {/* TÍTULO */}
        {/* --------------------- */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Reels Analytics</h1>
          <p className="text-muted-foreground">
            Desempenho e sentimento dos comentários em Reels
          </p>
        </div>

        {/* --------------------- */}
        {/* MÉTRICAS + MINI GRÁFICOS */}
        {/* --------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total de Interações"
            value={totalInteracoes}
            icon={TrendingUp}
            trendData={trends.totalTrendData}
          />

          <MetricCard
            title="Positivo"
            value={reels.sentimentos.positivo}
            icon={Smile}
            trendData={trends.positiveTrendData}
          />

          <MetricCard
            title="Neutro"
            value={reels.sentimentos.neutro}
            icon={Minus}
            trendData={trends.neutralTrendData}
          />

          <MetricCard
            title="Negativo"
            value={reels.sentimentos.negativo}
            icon={Frown}
            trendData={trends.negativeTrendData}
          />
        </div>

        {/* --------------------- */}
        {/* TERMÔMETRO DE SENTIMENTO */}
        {/* --------------------- */}
        <div className="p-6 rounded-lg glass">
          <h3 className="text-lg font-semibold mb-6">Termômetro de Sentimento</h3>

          <div className="space-y-6 max-w-3xl mx-auto">
            {[
              {
                label: "Positivo",
                value: sentimentoPct.positivo,
                color: "rgba(34, 197, 94, 0.3)",
              },
              {
                label: "Neutro",
                value: sentimentoPct.neutro,
                color: "rgba(234, 179, 8, 0.3)",
              },
              {
                label: "Negativo",
                value: sentimentoPct.negativo,
                color: "rgba(239, 68, 68, 0.3)",
              },
            ].map((s) => (
              <div key={s.label} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground tracking-wide">
                    {s.label}
                  </span>
                  <span className="text-2xl font-bold font-mono-data">
                    {s.value.toFixed(1)}%
                  </span>
                </div>

                <div className="h-4 rounded-full overflow-hidden bg-white/5 border border-white/10">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${s.value}%`,
                      backgroundColor: s.color,
                      boxShadow: `0 0 20px ${s.color}`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --------------------- */}
        {/* ÚLTIMOS COMENTÁRIOS */}
        {/* --------------------- */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Últimos comentários em Reels</h3>
            <span className="ml-auto text-xs text-muted-foreground">
              Atualizado a partir da planilha
            </span>
          </div>

          <div className="space-y-4">
            {reels.recentes.map((c: any, i: number) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-white/[0.02] border border-white/10 hover:border-primary/30 hover:bg-white/[0.05] transition-all"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-12 h-12 border-2 border-primary/20">
                    <AvatarFallback className="text-sm bg-primary/20 text-white font-semibold">
                      {getInitials(c.username)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-primary">
                        @{c.username || "desconhecido"}
                      </span>

                      <span className="text-xs text-muted-foreground ml-auto">
                        {c.data}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground">
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
