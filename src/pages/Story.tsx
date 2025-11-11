import { DashboardLayout } from '@/components/DashboardLayout';
import { MetricCard } from '@/components/MetricCard';
import { GlassCard } from '@/components/GlassCard';
import { TrendingUp, Smile, Minus, Frown } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const mockData = [
  { value: 280 },
  { value: 320 },
  { value: 450 },
  { value: 380 },
  { value: 520 },
  { value: 490 },
  { value: 580 },
];

const MiniTrendChart = ({ data }: { data: typeof mockData }) => (
  <ResponsiveContainer width="100%" height={60}>
    <AreaChart data={data}>
      <defs>
        <linearGradient id="colorValueStory" x1="0" y1="0" x2="0" y2="1">
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
        fill="url(#colorValueStory)"
        animationDuration={1000}
      />
    </AreaChart>
  </ResponsiveContainer>
);

export default function Story() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Story Analytics</h1>
          <p className="text-muted-foreground">Métricas de engajamento dos seus stories</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total de Interações"
            value="32.400"
            change={18.5}
            icon={TrendingUp}
            trend={<MiniTrendChart data={mockData} />}
          />
          <MetricCard
            title="Positivo"
            value="24.800"
            change={22.3}
            icon={Smile}
            trend={<MiniTrendChart data={mockData} />}
          />
          <MetricCard
            title="Neutro"
            value="5.200"
            change={-3.2}
            icon={Minus}
            trend={<MiniTrendChart data={mockData} />}
          />
          <MetricCard
            title="Negativo"
            value="2.400"
            change={-12.1}
            icon={Frown}
            trend={<MiniTrendChart data={mockData} />}
          />
        </div>

        <div className="p-6 rounded-lg glass">
          <h3 className="text-lg font-semibold mb-6">Termômetro de Sentimento</h3>
          <div className="space-y-6 max-w-3xl mx-auto">
            {[
              { label: 'Positivo', value: 76.5, color: 'rgba(34, 197, 94, 0.3)' },
              { label: 'Neutro', value: 16.0, color: 'rgba(234, 179, 8, 0.3)' },
              { label: 'Negativo', value: 7.5, color: 'rgba(239, 68, 68, 0.3)' },
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

        <div className="grid grid-cols-1 gap-6">
          <div className="p-6 rounded-lg glass">
            <h3 className="text-lg font-semibold mb-4">Últimas Interações</h3>
            <div className="space-y-3">
              {[
                { user: '@mariana.santos', comment: 'Amei esse produto! Onde posso comprar?' },
                { user: '@joao_silva', comment: 'Muito legal! Já vou aproveitar a promoção 🔥' },
                { user: '@ana.costa', comment: 'Perfeito! Era exatamente o que eu procurava ❤️' },
                { user: '@carlos_mendes', comment: 'Top demais! Vou recomendar para meus amigos' },
                { user: '@juliana.oliveira', comment: 'Incrível! Quando terá novidades?' },
              ].map((interaction, i) => {
                const getInitials = (username: string) => {
                  const name = username.replace('@', '');
                  const parts = name.split(/[._]/);
                  if (parts.length >= 2) {
                    return (parts[0][0] + parts[1][0]).toUpperCase();
                  }
                  return name.slice(0, 2).toUpperCase();
                };

                return (
                  <div 
                    key={i} 
                    className="p-4 rounded-lg bg-white/[0.02] border border-white/10 hover:border-primary/30 hover:bg-white/[0.05] transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-semibold">{getInitials(interaction.user)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-primary mb-1">{interaction.user}</p>
                        <p className="text-sm text-muted-foreground">{interaction.comment}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
