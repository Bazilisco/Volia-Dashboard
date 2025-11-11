import { DashboardLayout } from '@/components/DashboardLayout';
import { MetricCard } from '@/components/MetricCard';
import { GlassCard } from '@/components/GlassCard';
import { TrendingUp, Smile, Minus, Frown, MessageCircle } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const mockData = [
  { value: 350 },
  { value: 480 },
  { value: 620 },
  { value: 580 },
  { value: 720 },
  { value: 680 },
  { value: 850 },
];

const initialComments = [
  { id: 1, user: 'Ana Silva', avatar: 'AS', comment: 'Esse reel está viral! Muito bom 🔥', time: '1 min', sentiment: 'positive' },
  { id: 2, user: 'Carlos Mendes', avatar: 'CM', comment: 'Melhor reel do mês disparado!', time: '4 min', sentiment: 'positive' },
  { id: 3, user: 'Maria Santos', avatar: 'MS', comment: 'Legal, mas o áudio poderia ser melhor', time: '6 min', sentiment: 'neutral' },
  { id: 4, user: 'João Pedro', avatar: 'JP', comment: 'Compartilhei em todos os lugares! 🚀', time: '9 min', sentiment: 'positive' },
  { id: 5, user: 'Beatriz Costa', avatar: 'BC', comment: 'Conteúdo top demais!', time: '11 min', sentiment: 'positive' },
];

const allComments = [
  ...initialComments,
  { id: 6, user: 'Rafael Lima', avatar: 'RL', comment: 'Esse reel merece milhões de views!', time: 'agora', sentiment: 'positive' },
  { id: 7, user: 'Juliana Rocha', avatar: 'JR', comment: 'Bom, mas já vi parecido', time: 'agora', sentiment: 'neutral' },
  { id: 8, user: 'Pedro Alves', avatar: 'PA', comment: 'Incrível! Salvei para rever várias vezes', time: 'agora', sentiment: 'positive' },
];

const MiniTrendChart = ({ data }: { data: typeof mockData }) => (
  <ResponsiveContainer width="100%" height={60}>
    <AreaChart data={data}>
      <defs>
        <linearGradient id="colorValueReels" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#8c4bff" stopOpacity={0.3} />
          <stop offset="95%" stopColor="#8c4bff" stopOpacity={0} />
        </linearGradient>
      </defs>
      <Area
        type="monotone"
        dataKey="value"
        stroke="#8c4bff"
        strokeWidth={2}
        fillOpacity={1}
        fill="url(#colorValueReels)"
        animationDuration={1000}
      />
    </AreaChart>
  </ResponsiveContainer>
);

export default function Reels() {
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
          <h1 className="text-4xl font-bold mb-2">Reels Analytics</h1>
          <p className="text-muted-foreground">Desempenho dos seus reels</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            title="Total de Interações" 
            value="128.000" 
            change={45.2} 
            icon={TrendingUp}
            trend={<MiniTrendChart data={mockData} />}
          />
          <MetricCard 
            title="Positivo" 
            value="98.500" 
            change={48.1} 
            icon={Smile}
            trend={<MiniTrendChart data={mockData} />}
          />
          <MetricCard 
            title="Neutro" 
            value="22.800" 
            change={15.3} 
            icon={Minus}
            trend={<MiniTrendChart data={mockData} />}
          />
          <MetricCard 
            title="Negativo" 
            value="6.700" 
            change={-8.7} 
            icon={Frown}
            trend={<MiniTrendChart data={mockData} />}
          />
        </div>

        <div className="p-6 rounded-lg glass">
          <h3 className="text-lg font-semibold mb-6">Termômetro de Sentimento</h3>
          <div className="space-y-6 max-w-3xl mx-auto">
            {[
              { label: 'Positivo', value: 76.9, color: 'rgba(34, 197, 94, 0.3)' },
              { label: 'Neutro', value: 17.8, color: 'rgba(234, 179, 8, 0.3)' },
              { label: 'Negativo', value: 5.3, color: 'rgba(239, 68, 68, 0.3)' },
            ].map((sentiment) => (
              <div key={sentiment.label} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground tracking-wide">{sentiment.label}</span>
                  <span className="text-2xl font-bold font-mono-data">{sentiment.value}%</span>
                </div>
                <div className="h-4 rounded-full overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out backdrop-blur-sm"
                    style={{
                      width: `${sentiment.value}%`,
                      backgroundColor: sentiment.color,
                      boxShadow: `0 0 20px ${sentiment.color}`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Últimos comentários</h3>
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
                      <span className="font-semibold text-sm">{comment.user}</span>
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
      </div>
    </DashboardLayout>
  );
}
