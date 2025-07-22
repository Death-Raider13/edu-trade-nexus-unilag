
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { User, LogOut, Settings } from "lucide-react";
import { useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

const Header = () => {
  const { user, signOut } = useAuth();
  const [showAuthForm, setShowAuthForm] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleGetStarted = () => {
    setShowAuthForm(true);
  };

  return (
    <>
      <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl lg:text-2xl font-bold text-primary">
                WHAT DO YOU WANNA DO
              </h1>
              <Badge variant="outline" className="hidden md:inline-flex">
                UNILAG Platform
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                  <Button 
                    onClick={() => window.location.href = '/dashboard'} 
                    variant="outline" 
                    size="sm"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button onClick={handleSignOut} variant="outline" size="sm">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button onClick={handleGetStarted} variant="hero" size="sm">
                  Get Started
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {showAuthForm && !user && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="relative">
            <Button
              onClick={() => setShowAuthForm(false)}
              variant="ghost"
              size="sm"
              className="absolute -top-2 -right-2 z-10"
            >
              ✕
            </Button>
            <AuthForm />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
