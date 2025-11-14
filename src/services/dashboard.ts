// src/services/dashboard.ts
import { useQuery } from "@tanstack/react-query";

// =======================================
// 🔹 TIPAGENS
// =======================================

export type Sentiment = "positivo" | "neutro" | "negativo";

export interface DashboardComment {
  username: string;
  comentario: string;
  data: string;
  hora?: string;
  sentimento: Sentiment;
  tipo: "FEED" | "REELS" | "STORY";
}

export interface TopEngager {
  username: string;
  interacoes: number;
}

export interface TrendChange {
  total: number;
  positivo: number;
  neutro: number;
  negativo: number;
}

export interface DashboardApiResponse {
  status: string;

  totais: {
    total: number;
    positivo: number;
    neutro: number;
    negativo: number;
  };

  percentuais: {
    positivo: number;
    neutro: number;
    negativo: number;
  };

  satisfacao: number;

  recentComments: DashboardComment[];

  top5Engagers: TopEngager[];

  // 🔹 Séries para os mini-gráficos
  totalTrendData: number[];
  positiveTrendData: number[];
  neutralTrendData: number[];
  negativeTrendData: number[];

  // 🔹 Variação de hoje vs ontem (para o verdinho do canto)
  trendChange: TrendChange;
}

// =======================================
// 🔹 URL DA API (backend Node)
// =======================================
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";
const DASHBOARD_API_URL = `${BASE_URL}/api/dashboard`;

// =======================================
// 🔹 FUNÇÃO DE FETCH
// =======================================
async function fetchDashboardData(): Promise<DashboardApiResponse> {
  const res = await fetch(DASHBOARD_API_URL, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar dados do dashboard no backend");
  }

  return res.json();
}

// =======================================
// 🔹 HOOK PRINCIPAL USADO NO DASHBOARD
// =======================================
export function useDashboardEngagement() {
  return useQuery<DashboardApiResponse>({
    queryKey: ["dashboard-engagement"],
    queryFn: fetchDashboardData,
    // você pode ajustar esse intervalo depois se quiser
    refetchInterval: 5000, // 5 segundos
  });
}
