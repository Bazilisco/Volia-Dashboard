// src/pages/Dashboard.tsx

import { DashboardLayout } from '@/components/DashboardLayout';
import { MetricCard } from '@/components/MetricCard';
import { GlassCard } from '@/components/GlassCard';
import { SatisfactionGauge } from '@/components/SatisfactionGauge';

import {
  TrendingUp,
  Smile,
  Minus,
  Frown,
  MessageCircle,
  Instagram,
  Film,
  Image as ImageIcon
} from 'lucide-react';

import { useDashboardEngagement } from '@/services/dashboard';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { memo } from 'react';

// -----------------------------
// FUNÇÃO PARA GERAR INICIAIS
// -----------------------------
function getInitials(username: string) {
  if (!username) return '?';
  const clean = username.replace('@', '');
  const parts = clean.split(/[\._]/);

  if (parts.length >= 2)
    return (parts[0][0] + parts[1][0]).toUpperCase();

  return clean.substring(0, 2).toUpperCase();
}

// -----------------------------
// COMPONENTE DE BARRAS DE SENTIMENTO
// -----------------------------
type SentimentBar = { label: string; value: number; color: string };
type SentimentBarsProps = { sentiments: SentimentBar[] };

const SentimentBars = memo(function SentimentBars({ sentiments }: SentimentBarsProps) {
  return (
    <div className="space-y-6 w-full">
      {sentiments.map((s) => (
        <div key={s.label} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{s.label}</span>
            <span className="text-lg font-bold font-mono-data">{s.value}%</span>
          </div>
          <div className="h-3 bg-white/[0.02] rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${s.value}%`, backgroundColor: s.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
});

// -----------------------------
// DASHBOARD PRINCIPAL
// -----------------------------
export default function Dashboard() {
  const { data, isLoading } = useDashboardEngagement();

  if (!data || isLoading) {
    return (
      <DashboardLayout>
        <div className="p-10 text-center text-muted-foreground">
          Carregando dados do dashboard...
        </div>
      </DashboardLayout>
    );
  }

  // ===============================
  // DADOS REAIS DA API
  // ===============================
  const {
    totais,
    percentuais,
    recentComments,
    top5Engagers,
    totalTrendData,
    positiveTrendData,
    neutralTrendData,
    negativeTrendData,
  } = data;

  // ===============================
  // BARRAS DE SENTIMENTO
  // ===============================
  const sentimentBarsData: SentimentBar[] = [
    { label: 'Positivo', value: percentuais.positivo, color: 'rgba(34, 197, 94, 0.6)' },
    { label: 'Neutro', value: percentuais.neutro, color: 'rgba(234, 179, 8, 0.6)' },
    { label: 'Negativo', value: percentuais.negativo, color: 'rgba(239, 68, 68, 0.6)' },
  ];

  // ===============================
  // ÍCONES DOS TIPOS DE INTERAÇÃO
  // ===============================
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'story': return <ImageIcon className="w-4 h-4" />;
      case 'feed': return <Instagram className="w-4 h-4" />;
      case 'reels': return <Film className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getSentimentColor = (sent: string) => {
    switch (sent) {
      case 'positivo': return 'text-green-400';
      case 'negativo': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  // ===============================
  // VALOR MÁXIMO DO TOP 5 PARA A BARRA
  // ===============================
  const maxEngajamento = top5Engagers[0]?.interacoes || 1;

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Visão Geral</h1>
          <p className="text-muted-foreground">Consolidação de métricas de engajamento</p>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          <MetricCard
            title="Total de Interações"
            value={totais.total.toLocaleString('pt-BR')}
            icon={TrendingUp}
            trendData={totalTrendData}
          />

          <MetricCard
            title="Positivo"
            value={totais.positivo.toLocaleString('pt-BR')}
            icon={Smile}
            trendData={positiveTrendData}
          />

          <MetricCard
            title="Neutro"
            value={totais.neutro.toLocaleString('pt-BR')}
            icon={Minus}
            trendData={neutralTrendData}
          />

          <MetricCard
            title="Negativo"
            value={totais.negativo.toLocaleString('pt-BR')}
            icon={Frown}
            trendData={negativeTrendData}
          />
        </div>

        {/* SATISFAÇÃO + SENTIMENTO */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Medidor de Satisfação */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4">Medidor de Satisfação</h3>

            <SatisfactionGauge
              positiveValue={totais.positivo}
              neutralValue={totais.neutro}
              negativeValue={totais.negativo}
            />
          </GlassCard>

          {/* Barras de Sentimento */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4">Análise de Sentimento</h3>

            <div className="flex items-center justify-center h-[300px] px-8">
              <SentimentBars sentiments={sentimentBarsData} />
            </div>
          </GlassCard>
        </div>

        {/* SEÇÃO SOCIAL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* FEED DE COMENTÁRIOS */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">O que estão falando sobre nós?</h3>
              <span className="ml-auto text-xs text-muted-foreground">Tempo real</span>
            </div>

            <div className="space-y-4">
              {recentComments.slice(0, 6).map((c, i) => (
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
                        <span className="font-semibold text-sm text-primary">@{c.username}</span>

                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 text-xs">
                          {getTypeIcon(c.tipo)}
                          <span className="capitalize">
                            {c.tipo.toLowerCase()}
                          </span>
                        </div>

                        <span className="text-xs text-muted-foreground ml-auto">
                          {c.data}
                        </span>
                      </div>

                      <p className={`text-sm ${getSentimentColor(c.sentimento)}`}>
                        {c.comentario}
                      </p>
                    </div>

                  </div>
                </div>
              ))}
            </div>

          </GlassCard>

          {/* TOP ENGAGERS */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold">Top 5 Engajadores</h3>
            </div>

            <div className="space-y-3">
              {top5Engagers.map((e, idx) => {
                const percent = (e.interacoes / maxEngajamento) * 100;

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-white/[0.02] border border-white/10 hover:border-accent/30 hover:bg-white/[0.05] transition-all"
                  >
                    <div className="flex items-center gap-4">

                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent text-sm font-bold">
                        #{idx + 1}
                      </div>

                      <Avatar className="w-14 h-14 border-2 border-accent/20">
                        <AvatarFallback className="text-base bg-accent/20 text-white font-semibold">
                          {getInitials(e.username)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <p className="font-semibold text-primary">@{e.username}</p>
                        <p className="text-xs text-muted-foreground">
                          {e.interacoes} interações
                        </p>
                      </div>

                      <div className="text-green-400 text-sm font-mono-data">
                        +{e.interacoes}
                      </div>
                    </div>

                    {/* MINI GRÁFICO DE BARRA */}
                    <div className="mt-3 h-2 w-full rounded-full bg-primary/10 overflow-hidden">
                      <div
                        className="h-full bg-primary/60 transition-all duration-700"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                  </div>
                );
              })}
            </div>

          </GlassCard>
        </div>

      </div>
    </DashboardLayout>
  );
}
