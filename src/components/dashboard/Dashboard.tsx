
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CreditCard, MessageSquare, ShoppingBag, Users, LogOut, UserCheck } from 'lucide-react';
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
  };

  const handleCreditsClick = () => {
    navigate('/credits-billing');
  };

  const handleProfileClick = () => {
    navigate('/profile-settings');
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary">WHAT DO YOU WANNA DO</h1>
            <Badge variant="secondary">Dashboard</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Welcome, {user?.email}</span>
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
          <TabsList className="grid w-full grid-cols-6">
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
