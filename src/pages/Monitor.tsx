import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

type SentLabel = "positivo" | "neutro" | "negativo";

interface Interaction {
  id: number;
  type: string;
  sentiment: SentLabel;
  text: string;
  date: string;
  time: string;
}

interface UserProfile {
  instagram_handle: string;
  name: string;
  totalInteractions: number;
  lastEngagement: string;
  sentiment: {
    positivo: number;
    neutro: number;
    negativo: number;
  };
  interactions: Interaction[];
}

export default function Monitor() {
  const [searchUser, setSearchUser] = useState("");
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const q = searchUser.trim();
    if (!q) return;

    setLoading(true);
    setNotFound(false);
    setUserData(null);

    try {
      const params = new URLSearchParams({ q });
      const res = await fetch(
        `http://localhost:3001/api/monitor/user?${params.toString()}`
      );
      const json = await res.json();

      if (!json.found || !json.profile) {
        setNotFound(true);
        setUserData(null);
      } else {
        setUserData(json.profile as UserProfile);
        setNotFound(false);
      }
    } catch (err) {
      console.error(err);
      setNotFound(true);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (username: string) => {
    const name = username.replace("@", "");
    const parts = name.split(/[._]/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const getSentimentBadgeColor = (sentiment: SentLabel) => {
    switch (sentiment) {
      case "positivo":
        return "text-emerald-400 bg-emerald-500/10";
      case "neutro":
        return "text-yellow-400 bg-yellow-500/10";
      case "negativo":
        return "text-red-400 bg-red-500/10";
      default:
        return "text-muted-foreground bg-muted/10";
    }
  };

  const getSentimentLabel = (sentiment: SentLabel) => {
    switch (sentiment) {
      case "positivo":
        return "Positivo";
      case "neutro":
        return "Neutro";
      case "negativo":
        return "Negativo";
    }
  };

  const renderBars = () => {
    if (!userData) return null;

    const s = userData.sentiment;

    const items: { key: SentLabel; label: string; value: number; color: string }[] =
      [
        {
          key: "positivo",
          label: "Positivo",
          value: s.positivo,
          color: "#22c55e",
        },
        {
          key: "neutro",
          label: "Neutro",
          value: s.neutro,
          color: "#eab308",
        },
        {
          key: "negativo",
          label: "Negativo",
          value: s.negativo,
          color: "#ef4444",
        },
      ];

    return (
      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div key={item.key}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className={cn("px-2 py-0.5 rounded-full", getSentimentBadgeColor(item.key))}>
                {item.label}
              </span>
              <span>{item.value}%</span>
            </div>
            <div className="h-2 bg-background/50 rounded-full overflow-hidden">
              <div
                className="h-full"
                style={{
                  width: `${item.value}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Monitor</h1>
          <p className="text-muted-foreground">
            Timeline de comentários e menções individuais
          </p>
        </div>

        {/* Busca */}
        <div className="glass rounded-lg p-4">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Busque por @instagram ou ID do lead..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="pl-10 bg-background/50 border-border/50"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Buscando..." : "Buscar"}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-2">
            Exemplo: <code>@crei.design</code>,{" "}
            <code>crei.design</code>, <code>7401232416635175</code>
          </p>
        </div>

        {/* Usuário não encontrado */}
        {notFound && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Usuário não encontrado.</AlertDescription>
          </Alert>
        )}

        {/* Usuário encontrado */}
        {userData && (
          <div className="space-y-6">
            {/* Perfil */}
            <div className="glass rounded-lg p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary text-xl font-semibold">
                    {getInitials(userData.instagram_handle)}
                  </span>
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">
                    {userData.instagram_handle}
                  </h2>
                  <p className="text-muted-foreground mb-2">
                    {userData.name}
                  </p>

                  <div className="flex items-center gap-8 text-sm text-muted-foreground">
                    <div>
                      <span className="text-foreground font-medium">
                        Total de Interações
                      </span>
                      <p className="text-2xl font-bold text-foreground">
                        {userData.totalInteractions}
                      </p>
                    </div>

                    <div>
                      <span className="text-sm text-muted-foreground">
                        Último engajamento
                      </span>
                      <p className="text-lg font-semibold text-foreground">
                        {userData.lastEngagement}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Barras de sentimentos */}
              {renderBars()}
            </div>

            {/* Histórico */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">
                Histórico de Interações
              </h3>

              {userData.interactions.map((i) => (
                <div
                  key={i.id}
                  className="glass rounded-lg p-4 hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-1 min-w-[40px]">
                      <span className="text-lg font-bold text-primary">
                        {i.id}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {i.date}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-foreground">
                          {i.type}
                        </span>
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded-full uppercase font-medium",
                            getSentimentBadgeColor(i.sentiment)
                          )}
                        >
                          {getSentimentLabel(i.sentiment)}
                        </span>
                      </div>

                      <p className="text-muted-foreground">{i.text}</p>
                    </div>

                    <span className="text-xs text-muted-foreground">
                      {i.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
