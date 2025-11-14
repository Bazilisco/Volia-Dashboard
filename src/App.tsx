import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";

// ======================================================
// 🔧 Lazy imports — agora usando ALIAS correto "@/"
// ======================================================
const Login = lazy(() => import("@/pages/Login"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Story = lazy(() => import("@/pages/Story"));
const Feed = lazy(() => import("@/pages/Feed"));
const Reels = lazy(() => import("@/pages/Reels"));
const Analytics = lazy(() => import("@/pages/Analytics"));
const Monitor = lazy(() => import("@/pages/Monitor"));
const Console = lazy(() => import("@/pages/Console"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// QueryClient
const queryClient = new QueryClient();

// ======================================================
// 🔐 PROTECTED ROUTE
// ======================================================
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem("volia_auth");
    setIsAuthenticated(auth === "true");
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        Carregando...
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

// ======================================================
// 🔄 Loading Fallback
// ======================================================
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-pulse text-primary">Carregando...</div>
  </div>
);

// ======================================================
// 🌐 APP
// ======================================================
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Login />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/story"
              element={
                <ProtectedRoute>
                  <Story />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/feed"
              element={
                <ProtectedRoute>
                  <Feed />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/reels"
              element={
                <ProtectedRoute>
                  <Reels />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/monitor"
              element={
                <ProtectedRoute>
                  <Monitor />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/console"
              element={
                <ProtectedRoute>
                  <Console />
                </ProtectedRoute>
              }
            />

           

            {/* MUST BE LAST */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
