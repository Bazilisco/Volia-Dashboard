import { DashboardLayout } from '@/components/DashboardLayout';
import { GlassCard } from '@/components/GlassCard';
import {
  Server,
  Activity,
  Cpu,
  HardDrive,
  Network,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Cores fixas para os cards do n8n
 * (sem Tailwind dinâmico e sem usar `style` no GlassCard)
 */
const COLOR_CONFIG: Record<
  string,
  { css: string; borderClass: string; textClass: string }
> = {
  green: {
    css: 'rgb(74 222 128)',
    borderClass: 'border-green-400/50',
    textClass: 'text-green-400',
  },
  red: {
    css: 'rgb(248 113 113)',
    borderClass: 'border-red-400/50',
    textClass: 'text-red-400',
  },
  yellow: {
    css: 'rgb(250 204 21)',
    borderClass: 'border-yellow-400/50',
    textClass: 'text-yellow-400',
  },
  blue: {
    css: 'rgb(96 165 250)',
    borderClass: 'border-blue-400/50',
    textClass: 'text-blue-400',
  },
  purple: {
    css: 'rgb(192 132 252)',
    borderClass: 'border-purple-400/50',
    textClass: 'text-purple-400',
  },
};

export default function Console() {
  const [loading, setLoading] = useState(true);
  const [hostinger, setHostinger] = useState<any>(null);
  const [n8n, setN8n] = useState<any>(null);

  async function fetchConsoleData() {
    try {
      const res = await fetch(`${API_URL}/api/console`);
      const data = await res.json();

      if (data.status === 'ok') {
        setHostinger(data.hostinger);
        setN8n(data.n8n);
      }
    } catch (err) {
      console.error('Erro ao carregar console:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchConsoleData();
    const interval = setInterval(fetchConsoleData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !hostinger || !n8n) {
    return (
      <DashboardLayout>
        <div className="text-center text-muted-foreground py-20">
          Carregando Console NOC...
        </div>
      </DashboardLayout>
    );
  }

  const h = hostinger;
  const nx = n8n;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Título */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Console NOC</h1>
          <p className="text-muted-foreground">
            Monitoramento de Infraestrutura e Integrações
          </p>
        </div>

        {/* Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Server className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Hostinger VPS</h3>
                  <p className="text-xs text-muted-foreground">
                    Server ID {import.meta.env.VITE_HOSTINGER_SERVER_ID}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-green-400 font-medium">Online</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Activity className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold">n8n Workflows</h3>
                  <p className="text-xs text-muted-foreground">
                    {import.meta.env.VITE_N8N_BASE_URL}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-green-400 font-medium">
                  Operacional
                </span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Hostinger Metrics */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Server className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold">Hostinger VPS – Métricas</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* CPU */}
            <GlassCard className="p-4">
              <MetricHeader icon={Cpu} label="Uso da CPU" />
              <MetricValue
                value={`${(h.cpu?.value ?? 0).toFixed(1)}%`}
                history={h.cpu?.history ?? []}
                color="primary"
              />
            </GlassCard>

            {/* Memory */}
            <GlassCard className="p-4">
              <MetricHeader icon={Activity} label="Uso de memória" />
              <MetricValue
                value={`${(h.memory?.value ?? 0).toFixed(1)}%`}
                history={h.memory?.history ?? []}
                color="primary"
              />
            </GlassCard>

            {/* Disk */}
            <GlassCard className="p-4">
              <MetricHeader icon={HardDrive} label="Uso do disco" />
              <div className="text-3xl font-bold font-mono-data">
                {h.disk?.usedGB ?? 0} GB{' '}
                <span className="text-sm text-muted-foreground">
                  / {h.disk?.totalGB ?? 0} GB
                </span>
              </div>
            </GlassCard>

            {/* Traffic In */}
            <GlassCard className="p-4">
              <MetricHeader icon={ArrowDownRight} label="Tráfego de entrada" />
              <MetricValue
                value={`${(h.trafficIn?.value ?? 0).toFixed(1)} MB`}
                history={h.trafficIn?.history ?? []}
                color="primary"
              />
            </GlassCard>

            {/* Traffic Out */}
            <GlassCard className="p-4">
              <MetricHeader icon={ArrowUpRight} label="Tráfego de saída" />
              <MetricValue
                value={`${(h.trafficOut?.value ?? 0).toFixed(1)} MB`}
                history={h.trafficOut?.history ?? []}
                color="primary"
              />
            </GlassCard>

            {/* Bandwidth */}
            <GlassCard className="p-4">
              <MetricHeader icon={Network} label="Largura de banda" />
              <div className="text-3xl font-bold font-mono-data">
                {h.bandwidth?.usedTB ?? 0} TB{' '}
                <span className="text-sm text-muted-foreground">
                  / {h.bandwidth?.totalTB ?? 0} TB
                </span>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* n8n Metrics */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold">N8N Workflow</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <N8NCard
              title="Prod. executions"
              subtitle="Last 7 days"
              value={nx.prodExecutions.value}
              history={nx.prodExecutions.history}
              color="green"
              change="+0%"
            />

            <N8NCard
              title="Failed executions"
              subtitle="Last 7 days"
              value={nx.failedExecutions.value}
              history={nx.failedExecutions.history}
              color="red"
              change="+0%"
            />

            <N8NCard
              title="Failure rate"
              subtitle="Last 7 days"
              value={`${nx.failureRate.value}%`}
              history={nx.failureRate.history}
              color="yellow"
              change="+0pp"
            />

            <N8NCard
              title="Time saved"
              subtitle="Last 7 days"
              value={`${nx.timeSavedHours.value}h`}
              history={nx.prodExecutions.history}
              color="blue"
              change="+0%"
            />

            <N8NCard
              title="Run time (avg.)"
              subtitle="Last 7 days"
              value={`${nx.avgRuntimeSeconds.value.toFixed(2)}s`}
              history={nx.avgRuntimeSeconds.history}
              color="purple"
              change="+0s"
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

/* ------------------ SUBCOMPONENTES ------------------ */

function MetricHeader({ icon: Icon, label }: any) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{label}</span>
        <ChevronRight className="w-3 h-3 text-muted-foreground" />
      </div>
    </div>
  );
}

function MetricValue({ value, history, color }: any) {
  return (
    <div className="flex items-end justify-between">
      <div className="text-3xl font-bold font-mono-data">{value}</div>
      <div className="h-12 w-24">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history.map((v: any) => ({ value: v }))}>
            <defs>
              <linearGradient id={`g-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill={`url(#g-${color})`}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function N8NCard({
  title,
  subtitle,
  value,
  history,
  color,
  change,
}: {
  title: string;
  subtitle: string;
  value: number | string;
  history: { value: number }[];
  color: keyof typeof COLOR_CONFIG;
  change: string;
}) {
  const cfg = COLOR_CONFIG[color] ?? COLOR_CONFIG.green;

  return (
    <GlassCard className={`p-4 border-l-4 ${cfg.borderClass}`}>
      <div className="mb-2">
        <p className="text-xs text-muted-foreground mb-1">{title}</p>
        <p className="text-[10px] text-muted-foreground">{subtitle}</p>
      </div>

      <div className="flex items-end justify-between gap-2">
        <div className="text-3xl font-bold font-mono-data">{value}</div>
        <div className="h-12 w-20">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs>
                <linearGradient id={`n8n-${color}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={cfg.css} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={cfg.css} stopOpacity={0} />
                </linearGradient>
              </defs>

              <Area
                type="monotone"
                dataKey="value"
                stroke={cfg.css}
                strokeWidth={2}
                fill={`url(#n8n-${color})`}
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`flex items-center gap-1 text-xs font-medium mt-1 ${cfg.textClass}`}>
        {change.includes('-') ? (
          <ArrowDownRight className="w-3 h-3" />
        ) : (
          <ArrowUpRight className="w-3 h-3" />
        )}
        <span>{change}</span>
      </div>
    </GlassCard>
  );
}
