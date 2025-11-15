// src/services/dashboard.ts
import { useQuery } from "@tanstack/react-query";

/* =======================================================
   🔹 TIPAGENS BASE
   ======================================================= */

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

export interface SentimentosCount {
  positivo: number;
  neutro: number;
  negativo: number;
}

export interface TrendBlock {
  trendChange: number; // variação em %
  totalTrendData: number[];
  positiveTrendData: number[];
  neutralTrendData: number[];
  negativeTrendData: number[];
}

/* =======================================================
   🔹 BLOCO POR TIPO (story, feed, reels)
   ======================================================= */

export interface AnalyticsBlock {
  sentimentos: SentimentosCount;
  recentes: DashboardComment[];
  tudo: DashboardComment[];
  trends: TrendBlock;
}

/* =======================================================
   🔹 RESPOSTA COMPLETA DA API
   ======================================================= */

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

  // 🔹 blocos individuais
  story: AnalyticsBlock;
  feed: AnalyticsBlock;
  reels: AnalyticsBlock;

  // 🔹 campos antigos de tendência geral (mantidos por compatibilidade)
  totalTrendData?: number[];
  positiveTrendData?: number[];
  neutralTrendData?: number[];
  negativeTrendData?: number[];
  trendChange?: number;
}

/* =======================================================
   🔹 URL DA API BACKEND
   ======================================================= */

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";
const DASHBOARD_API_URL = `${BASE_URL}/api/dashboard`;

/* =======================================================
   🔹 FUNÇÃO DE FETCH
   ======================================================= */

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

/* =======================================================
   🔹 HOOK PRINCIPAL
   ======================================================= */

export function useDashboardEngagement() {
  return useQuery<DashboardApiResponse>({
    queryKey: ["dashboard-engagement"],
    queryFn: fetchDashboardData,
    refetchInterval: 8000, // ajuste se quiser
  });
}
