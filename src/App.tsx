
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import { Services } from "./pages/Services";
import { Marketplace } from "./pages/Marketplace";
import { ProfessionalDashboard } from "./components/dashboard/ProfessionalDashboard";
import CreditsAndBilling from "./pages/CreditsAndBilling";
import ProfileSettings from "./pages/ProfileSettings";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading UNILAG Academic Platform...</p>
        </div>
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
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/dashboard" element={user ? <ProfessionalDashboard /> : <Index />} />
            <Route path="/credits-billing" element={user ? <CreditsAndBilling /> : <Index />} />
            <Route path="/profile-settings" element={user ? <ProfileSettings /> : <Index />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
