import { DashboardLayout } from '@/components/DashboardLayout';
import { MetricCard } from '@/components/MetricCard';
import { GlassCard } from '@/components/GlassCard';
import { TrendingUp, Smile, Minus, Frown, MessageCircle } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const mockData = [
  { value: 220 },
  { value: 350 },
  { value: 280 },
  { value: 420 },
  { value: 380 },
  { value: 450 },
  { value: 520 },
];

const initialComments = [
  { id: 1, user: 'Ana Silva', avatar: 'AS', comment: 'Adorei esse post! Super informativo 👏', time: '3 min', sentiment: 'positive' },
  { id: 2, user: 'Carlos Mendes', avatar: 'CM', comment: 'Conteúdo excelente, obrigado!', time: '7 min', sentiment: 'positive' },
  { id: 3, user: 'Maria Santos', avatar: 'MS', comment: 'Poderia adicionar mais exemplos', time: '10 min', sentiment: 'neutral' },
  { id: 4, user: 'João Pedro', avatar: 'JP', comment: 'Perfeito! Era isso que eu procurava', time: '15 min', sentiment: 'positive' },
  { id: 5, user: 'Beatriz Costa', avatar: 'BC', comment: 'Continue com esse tipo de conteúdo!', time: '18 min', sentiment: 'positive' },
];

const allComments = [
  ...initialComments,
  { id: 6, user: 'Rafael Lima', avatar: 'RL', comment: 'Post incrível! Compartilhando', time: 'agora', sentiment: 'positive' },
  { id: 7, user: 'Juliana Rocha', avatar: 'JR', comment: 'Bom, mas esperava mais profundidade', time: 'agora', sentiment: 'neutral' },
  { id: 8, user: 'Pedro Alves', avatar: 'PA', comment: 'Muito útil! Salvei para depois 📌', time: 'agora', sentiment: 'positive' },
];

const MiniTrendChart = ({ data }: { data: typeof mockData }) => (
  <ResponsiveContainer width="100%" height={60}>
    <AreaChart data={data}>
      <defs>
        <linearGradient id="colorValueFeed" x1="0" y1="0" x2="0" y2="1">
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
        fill="url(#colorValueFeed)"
        animationDuration={1000}
      />
    </AreaChart>
  </ResponsiveContainer>
);

export default function Feed() {
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
          <h1 className="text-4xl font-bold mb-2">Feed Analytics</h1>
          <p className="text-muted-foreground">Métricas de engajamento do feed</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            title="Total de Interações" 
            value="25.300" 
            change={22.5} 
            icon={TrendingUp}
            trend={<MiniTrendChart data={mockData} />}
          />
          <MetricCard 
            title="Positivo" 
            value="18.800" 
            change={25.2} 
            icon={Smile}
            trend={<MiniTrendChart data={mockData} />}
          />
          <MetricCard 
            title="Neutro" 
            value="4.200" 
            change={-5.1} 
            icon={Minus}
            trend={<MiniTrendChart data={mockData} />}
          />
          <MetricCard 
            title="Negativo" 
            value="2.300" 
            change={-10.9} 
            icon={Frown}
            trend={<MiniTrendChart data={mockData} />}
          />
        </div>

        <div className="p-6 rounded-lg glass">
          <h3 className="text-lg font-semibold mb-6">Termômetro de Sentimento</h3>
          <div className="space-y-6 max-w-3xl mx-auto">
            {[
              { label: 'Positivo', value: 74.3, color: 'rgba(34, 197, 94, 0.3)' },
              { label: 'Neutro', value: 16.6, color: 'rgba(234, 179, 8, 0.3)' },
              { label: 'Negativo', value: 9.1, color: 'rgba(239, 68, 68, 0.3)' },
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
