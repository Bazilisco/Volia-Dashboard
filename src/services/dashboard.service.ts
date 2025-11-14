import { api } from "./api";

export async function getDashboardData() {
  const res = await api.get("/dashboard");
  return res.data;
}