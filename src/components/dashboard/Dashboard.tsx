
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CreditCard, MessageSquare, ShoppingBag, Users, LogOut, UserCheck, Home, GraduationCap } from 'lucide-react';
import { ProfileSection } from './ProfileSection';
import { AgentSection } from './AgentSection';
import { ServicesSection } from './ServicesSection';
import { MarketplaceSection } from './MarketplaceSection';
import { MessagesSection } from './MessagesSection';
import { EnhancedAgentSection } from './EnhancedAgentSection';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleCreditsClick = () => {
    navigate('/credits-billing');
  };

  const handleProfileClick = () => {
    navigate('/profile-settings');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <header className="bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Academic Dashboard</h1>
                <p className="text-xs text-muted-foreground">Student Success Platform</p>
              </div>
            </div>
            <Badge variant="secondary">Dashboard</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Welcome, {user?.email}</span>
            <Button onClick={handleHomeClick} variant="ghost" size="sm">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <Button onClick={handleCreditsClick} variant="outline" size="sm">
              <CreditCard className="h-4 w-4 mr-2" />
              Credits & Billing
            </Button>
            <Button onClick={handleProfileClick} variant="outline" size="sm">
              <UserCheck className="h-4 w-4 mr-2" />
              Profile Settings
            </Button>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/50 backdrop-blur">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="agent">Become Agent</TabsTrigger>
            <TabsTrigger value="hire-agent">Hire Agent</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileSection />
          </TabsContent>

          <TabsContent value="services">
            <ServicesSection />
          </TabsContent>

          <TabsContent value="marketplace">
            <MarketplaceSection />
          </TabsContent>

          <TabsContent value="messages">
            <MessagesSection />
          </TabsContent>

          <TabsContent value="agent">
            <AgentSection />
          </TabsContent>

          <TabsContent value="hire-agent">
            <EnhancedAgentSection />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};
