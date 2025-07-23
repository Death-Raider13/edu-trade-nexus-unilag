
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import { Dashboard } from "./components/dashboard/Dashboard";
import CreditsAndBilling from "./pages/CreditsAndBilling";
import ProfileSettings from "./pages/ProfileSettings";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={user ? <Dashboard /> : <Index />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Index />} />
            <Route path="/credits-billing" element={user ? <CreditsAndBilling /> : <Index />} />
            <Route path="/profile-settings" element={user ? <ProfileSettings /> : <Index />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
