import { DashboardLayout } from '@/components/DashboardLayout';
import { MetricCard } from '@/components/MetricCard';
import { GlassCard } from '@/components/GlassCard';
import { SatisfactionGauge } from '@/components/SatisfactionGauge';
import { TrendingUp, Smile, Minus, Frown, MessageCircle, Instagram, Film, Image as ImageIcon } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { useState, useEffect, memo, useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const mockData = [
  { name: 'Seg', total: 400, positive: 280, neutral: 80, negative: 40 },
  { name: 'Ter', total: 300, positive: 210, neutral: 60, negative: 30 },
  { name: 'Qua', total: 500, positive: 350, neutral: 100, negative: 50 },
  { name: 'Qui', total: 280, positive: 196, neutral: 56, negative: 28 },
  { name: 'Sex', total: 590, positive: 413, neutral: 118, negative: 59 },
  { name: 'Sáb', total: 320, positive: 224, neutral: 64, negative: 32 },
  { name: 'Dom', total: 450, positive: 315, neutral: 90, negative: 45 },
];

const totalTrendData = mockData.map(d => ({ name: d.name, value: d.total }));
const positiveTrendData = mockData.map(d => ({ name: d.name, value: d.positive }));
const neutralTrendData = mockData.map(d => ({ name: d.name, value: d.neutral }));
const negativeTrendData = mockData.map(d => ({ name: d.name, value: d.negative }));

// Estrutura preparada para integração com planilha
// Cada usuário precisa ter: instagram_handle (formato @username)
const initialComments = [
  { id: 1, instagram_handle: '@ana_silva', name: 'Ana Silva', avatar: 'AS', type: 'story', comment: 'Adorei o conteúdo! Muito inspirador 🔥', time: '2 min', sentiment: 'positive' },
  { id: 2, instagram_handle: '@carlos.mendes', name: 'Carlos Mendes', avatar: 'CM', type: 'feed', comment: 'Qualidade impecável como sempre', time: '5 min', sentiment: 'positive' },
  { id: 3, instagram_handle: '@maria_santos', name: 'Maria Santos', avatar: 'MS', type: 'reels', comment: 'Podia melhorar a edição', time: '8 min', sentiment: 'neutral' },
  { id: 4, instagram_handle: '@joaopedro', name: 'João Pedro', avatar: 'JP', type: 'story', comment: 'Perfeito! Exatamente o que eu precisava', time: '12 min', sentiment: 'positive' },
  { id: 5, instagram_handle: '@bia_costa', name: 'Beatriz Costa', avatar: 'BC', type: 'reels', comment: 'Muito bom! Continue assim 👏', time: '15 min', sentiment: 'positive' },
];

const allComments = [
  ...initialComments,
  { id: 6, instagram_handle: '@rafael.lima', name: 'Rafael Lima', avatar: 'RL', type: 'feed', comment: 'Conteúdo de altíssima qualidade!', time: 'agora', sentiment: 'positive' },
  { id: 7, instagram_handle: '@ju_rocha', name: 'Juliana Rocha', avatar: 'JR', type: 'story', comment: 'Interessante, mas poderia ser mais detalhado', time: 'agora', sentiment: 'neutral' },
  { id: 8, instagram_handle: '@pedroalves', name: 'Pedro Alves', avatar: 'PA', type: 'reels', comment: 'Incrível! Compartilhei com todos', time: 'agora', sentiment: 'positive' },
];

// Top engajadores - estrutura preparada para planilha
const topEngagers = [
  { id: 1, instagram_handle: '@ana_silva', name: 'Ana Silva', avatar: 'AS', interactions: 147, trend: '+12%' },
  { id: 2, instagram_handle: '@carlos.mendes', name: 'Carlos Mendes', avatar: 'CM', interactions: 132, trend: '+8%' },
  { id: 3, instagram_handle: '@joaopedro', name: 'João Pedro', avatar: 'JP', interactions: 118, trend: '+15%' },
  { id: 4, instagram_handle: '@bia_costa', name: 'Beatriz Costa', avatar: 'BC', interactions: 95, trend: '+5%' },
  { id: 5, instagram_handle: '@maria_santos', name: 'Maria Santos', avatar: 'MS', interactions: 87, trend: '-2%' },
];

const SentimentBars = memo(() => {
  const sentiments = useMemo(() => [
    { label: 'Positivo', value: 67, color: 'rgba(34, 197, 94, 0.6)' },
    { label: 'Neutro', value: 22, color: 'rgba(234, 179, 8, 0.6)' },
    { label: 'Negativo', value: 11, color: 'rgba(239, 68, 68, 0.6)' },
  ], []);
  
  return (
    <div className="space-y-6 w-full">
      {sentiments.map((sentiment) => (
        <div key={sentiment.label} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{sentiment.label}</span>
            <span className="text-lg font-bold font-mono-data">{sentiment.value}%</span>
          </div>
          <div className="h-3 bg-white/[0.02] rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${sentiment.value}%`,
                backgroundColor: sentiment.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
});


export default function Dashboard() {
  const [recentComments, setRecentComments] = useState(initialComments);
  const [commentIndex, setCommentIndex] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      if (commentIndex < allComments.length) {
        setRecentComments(prev => {
          const newComments = [allComments[commentIndex], ...prev.slice(0, 4)];
          return newComments;
        });
        setCommentIndex(prev => prev + 1);
      } else {
        setCommentIndex(5);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [commentIndex]);

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'story': return <ImageIcon className="w-4 h-4" />;
      case 'feed': return <Instagram className="w-4 h-4" />;
      case 'reels': return <Film className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch(sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Visão Geral</h1>
          <p className="text-muted-foreground">Consolidação de métricas de engajamento</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <MetricCard
            title="Total de Interações"
            value="12.500"
            change={12.5}
            icon={TrendingUp}
            trendData={totalTrendData}
          />
          <MetricCard
            title="Positivo"
            value="8.400"
            change={18.7}
            icon={Smile}
            trendData={positiveTrendData}
          />
          <MetricCard
            title="Neutro"
            value="2.800"
            change={-3.2}
            icon={Minus}
            trendData={neutralTrendData}
          />
          <MetricCard
            title="Negativo"
            value="1.300"
            change={-8.5}
            icon={Frown}
            trendData={negativeTrendData}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4">Medidor de Satisfação</h3>
            <SatisfactionGauge
              positiveValue={8400}
              neutralValue={2800}
              negativeValue={1300}
            />
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4">Análise de Sentimento</h3>
            <div className="flex items-center justify-center h-[300px] px-8">
              <SentimentBars />
            </div>
          </GlassCard>
        </div>

        {/* Social Engagement Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Comments Feed */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">O que estão falando sobre nós?</h3>
              <span className="ml-auto text-xs text-muted-foreground">Tempo real</span>
            </div>
            <div className="space-y-4">
              {recentComments.map((comment, index) => (
                <div 
                  key={`${comment.id}-${index}`}
                  className="p-3 rounded-lg bg-white/[0.02] border border-white/10 hover:border-primary/30 hover:bg-white/[0.05] transition-all"
                  style={{
                    animation: index === 0 ? 'slideIn 0.5s ease-out' : 'none'
                  }}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12 border-2 border-primary/20">
                      <AvatarFallback className="text-sm bg-primary/20 text-white font-semibold">
                        {comment.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-primary">{comment.instagram_handle}</span>
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 text-xs">
                          {getTypeIcon(comment.type)}
                          <span className="capitalize">{comment.type === 'story' ? 'Story' : comment.type === 'feed' ? 'Feed' : 'Reels'}</span>
                        </div>
                        <span className="text-xs text-muted-foreground ml-auto">{comment.time}</span>
                      </div>
                      <p className={`text-sm ${getSentimentColor(comment.sentiment)}`}>
                        {comment.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Top Engagers */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold">Top 5 Engajadores</h3>
            </div>
            <div className="space-y-3">
              {topEngagers.map((engager, index) => (
                <div 
                  key={engager.id}
                  className="p-4 rounded-lg bg-white/[0.02] border border-white/10 hover:border-accent/30 hover:bg-white/[0.05] transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent text-sm font-bold">
                      #{index + 1}
                    </div>
                    <Avatar className="w-14 h-14 border-2 border-accent/20">
                      <AvatarFallback className="text-base bg-accent/20 text-white font-semibold">
                        {engager.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-primary">{engager.instagram_handle}</p>
                      <p className="text-xs text-muted-foreground">
                        {engager.interactions} interações
                      </p>
                    </div>
                    <div className={`text-sm font-mono-data ${
                      engager.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {engager.trend}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
