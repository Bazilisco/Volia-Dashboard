import { DashboardLayout } from '@/components/DashboardLayout';
import { GlassCard } from '@/components/GlassCard';
import { Server, Activity, Cpu, HardDrive, Network, ArrowUpRight, ArrowDownRight, ChevronRight } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';

// Generate mock data for N8N workflows
const generateWorkflowData = () => Array.from({ length: 10 }, () => ({ value: Math.random() * 100 + 50 }));

export default function Console() {
  // Animated data for Hostinger VPS
  const [cpuData, setCpuData] = useState([
    { value: 1.8 }, { value: 2.1 }, { value: 1.9 }, { value: 2.3 }, { value: 2.0 },
    { value: 2.2 }, { value: 1.7 }, { value: 2.4 }, { value: 2.0 }
  ]);
  
  const [memoryData, setMemoryData] = useState([
    { value: 18 }, { value: 18.5 }, { value: 18.8 }, { value: 19.2 }, { value: 19.0 },
    { value: 19.5 }, { value: 19.2 }, { value: 18.9 }, { value: 19.0 }
  ]);
  
  const [trafficInData, setTrafficInData] = useState([
    { value: 32 }, { value: 35 }, { value: 33 }, { value: 38 }, { value: 36 },
    { value: 34 }, { value: 39 }, { value: 37 }, { value: 37.2 }
  ]);
  
  const [trafficOutData, setTrafficOutData] = useState([
    { value: 9 }, { value: 10 }, { value: 8 }, { value: 12 }, { value: 11 },
    { value: 10 }, { value: 13 }, { value: 11.5 }, { value: 11.0 }
  ]);

  const [cpuValue, setCpuValue] = useState(2.0);
  const [memoryValue, setMemoryValue] = useState(19.0);
  const [trafficInValue, setTrafficInValue] = useState(37.2);
  const [trafficOutValue, setTrafficOutValue] = useState(11.0);

  // N8N workflow data
  const [prodData, setProdData] = useState(generateWorkflowData());
  const [failedData, setFailedData] = useState(generateWorkflowData());
  const [failureRateData, setFailureRateData] = useState(generateWorkflowData());
  const [runtimeData, setRuntimeData] = useState(generateWorkflowData());

  // Animate Hostinger VPS metrics
  useEffect(() => {
    const interval = setInterval(() => {
      // CPU
      const newCpuValue = 1.5 + Math.random() * 1.5;
      setCpuValue(newCpuValue);
      setCpuData(prev => [...prev.slice(1), { value: newCpuValue }]);
      
      // Memory
      const newMemValue = 18 + Math.random() * 2;
      setMemoryValue(newMemValue);
      setMemoryData(prev => [...prev.slice(1), { value: newMemValue }]);
      
      // Traffic In
      const newTrafficIn = 30 + Math.random() * 15;
      setTrafficInValue(newTrafficIn);
      setTrafficInData(prev => [...prev.slice(1), { value: newTrafficIn }]);
      
      // Traffic Out
      const newTrafficOut = 8 + Math.random() * 6;
      setTrafficOutValue(newTrafficOut);
      setTrafficOutData(prev => [...prev.slice(1), { value: newTrafficOut }]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Animate N8N workflow metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setProdData(generateWorkflowData());
      setFailedData(generateWorkflowData());
      setFailureRateData(generateWorkflowData());
      setRuntimeData(generateWorkflowData());
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Console NOC</h1>
          <p className="text-muted-foreground">Monitoramento de Infraestrutura e Integrações</p>
        </div>

        {/* Status Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Server className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Hostinger VPS</h3>
                  <p className="text-xs text-muted-foreground">Ubuntu 24.04 - KVM 2</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-green-400 font-medium">Em Atividade</span>
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
                  <p className="text-xs text-muted-foreground">Automation Platform</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-green-400 font-medium">Operacional</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Hostinger Metrics */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Server className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold">Hostinger VPS - Métricas</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* CPU Usage */}
            <GlassCard className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Uso da CPU</span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold font-mono-data">{cpuValue.toFixed(1)}%</div>
                <div className="h-12 w-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cpuData}>
                      <defs>
                        <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fill="url(#cpuGradient)"
                        animationDuration={1000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </GlassCard>

            {/* Memory Usage */}
            <GlassCard className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Uso de memória</span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold font-mono-data">{memoryValue.toFixed(1)}%</div>
                <div className="h-12 w-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={memoryData}>
                      <defs>
                        <linearGradient id="memGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fill="url(#memGradient)"
                        animationDuration={1000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </GlassCard>

            {/* Disk Usage */}
            <GlassCard className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Uso do disco</span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-3xl font-bold font-mono-data">13 GB</span>
                  <span className="text-sm text-muted-foreground ml-2">/ 100 GB</span>
                </div>
              </div>
            </GlassCard>

            {/* Traffic In */}
            <GlassCard className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ArrowDownRight className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Tráfego de entrada</span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold font-mono-data">{trafficInValue.toFixed(1)} MB</div>
                <div className="h-12 w-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trafficInData}>
                      <defs>
                        <linearGradient id="trafficInGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fill="url(#trafficInGradient)"
                        animationDuration={1000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </GlassCard>

            {/* Traffic Out */}
            <GlassCard className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Tráfego de saída</span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold font-mono-data">{trafficOutValue.toFixed(1)} MB</div>
                <div className="h-12 w-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trafficOutData}>
                      <defs>
                        <linearGradient id="trafficOutGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fill="url(#trafficOutGradient)"
                        animationDuration={1000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </GlassCard>

            {/* Bandwidth */}
            <GlassCard className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Network className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Largura de banda</span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-3xl font-bold font-mono-data">0.03 TB</span>
                  <span className="text-sm text-muted-foreground ml-2">/ 8 TB</span>
                </div>
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
            {/* Production Executions */}
            <GlassCard className="p-4 border-l-4 border-green-400/50">
              <div className="mb-2">
                <p className="text-xs text-muted-foreground mb-1">Prod. executions</p>
                <p className="text-[10px] text-muted-foreground">Last 7 days</p>
              </div>
              <div className="flex items-end justify-between gap-2">
                <div className="text-3xl font-bold font-mono-data">54,071</div>
                <div className="h-12 w-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={prodData}>
                      <defs>
                        <linearGradient id="prodGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgb(74, 222, 128)" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="rgb(74, 222, 128)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="rgb(74, 222, 128)"
                        strokeWidth={2}
                        fill="url(#prodGradient)"
                        animationDuration={800}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-400 text-xs font-medium mt-1">
                <ArrowUpRight className="w-3 h-3" />
                <span>103.26%</span>
              </div>
            </GlassCard>

            {/* Failed Executions */}
            <GlassCard className="p-4 border-l-4 border-red-400/50">
              <div className="mb-2">
                <p className="text-xs text-muted-foreground mb-1">Failed prod. executions</p>
                <p className="text-[10px] text-muted-foreground">Last 7 days</p>
              </div>
              <div className="flex items-end justify-between gap-2">
                <div className="text-3xl font-bold font-mono-data">18,611</div>
                <div className="h-12 w-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={failedData}>
                      <defs>
                        <linearGradient id="failedGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgb(248, 113, 113)" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="rgb(248, 113, 113)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="rgb(248, 113, 113)"
                        strokeWidth={2}
                        fill="url(#failedGradient)"
                        animationDuration={800}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="flex items-center gap-1 text-red-400 text-xs font-medium mt-1">
                <ArrowDownRight className="w-3 h-3" />
                <span>-2,945.98%</span>
              </div>
            </GlassCard>

            {/* Failure Rate */}
            <GlassCard className="p-4 border-l-4 border-yellow-400/50">
              <div className="mb-2">
                <p className="text-xs text-muted-foreground mb-1">Failure rate</p>
                <p className="text-[10px] text-muted-foreground">Last 7 days</p>
              </div>
              <div className="flex items-end justify-between gap-2">
                <div className="text-3xl font-bold font-mono-data">34.4%</div>
                <div className="h-12 w-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={failureRateData}>
                      <defs>
                        <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgb(250, 204, 21)" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="rgb(250, 204, 21)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="rgb(250, 204, 21)"
                        strokeWidth={2}
                        fill="url(#rateGradient)"
                        animationDuration={800}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="flex items-center gap-1 text-red-400 text-xs font-medium mt-1">
                <ArrowDownRight className="w-3 h-3" />
                <span>-32.1pp</span>
              </div>
            </GlassCard>

            {/* Time Saved */}
            <GlassCard className="p-4 border-l-4 border-blue-400/50">
              <div className="mb-2">
                <p className="text-xs text-muted-foreground mb-1">Time saved</p>
                <p className="text-[10px] text-muted-foreground">Last 7 days</p>
              </div>
              <div className="flex items-end justify-between gap-2">
                <div className="text-3xl font-bold font-mono-data">240h</div>
                <div className="h-12 w-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={prodData}>
                      <defs>
                        <linearGradient id="timeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgb(96, 165, 250)" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="rgb(96, 165, 250)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="rgb(96, 165, 250)"
                        strokeWidth={2}
                        fill="url(#timeGradient)"
                        animationDuration={800}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-400 text-xs font-medium mt-1">
                <ArrowUpRight className="w-3 h-3" />
                <span>+15.2%</span>
              </div>
            </GlassCard>

            {/* Average Runtime */}
            <GlassCard className="p-4 border-l-4 border-purple-400/50">
              <div className="mb-2">
                <p className="text-xs text-muted-foreground mb-1">Run time (avg.)</p>
                <p className="text-[10px] text-muted-foreground">Last 7 days</p>
              </div>
              <div className="flex items-end justify-between gap-2">
                <div className="text-3xl font-bold font-mono-data">15.96s</div>
                <div className="h-12 w-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={runtimeData}>
                      <defs>
                        <linearGradient id="runtimeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgb(192, 132, 252)" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="rgb(192, 132, 252)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="rgb(192, 132, 252)"
                        strokeWidth={2}
                        fill="url(#runtimeGradient)"
                        animationDuration={800}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-400 text-xs font-medium mt-1">
                <ArrowUpRight className="w-3 h-3" />
                <span>+8.12s</span>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
