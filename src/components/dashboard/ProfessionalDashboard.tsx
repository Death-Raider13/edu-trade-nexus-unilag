import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  GraduationCap, 
  Home, 
  User, 
  ShoppingBag, 
  MessageSquare, 
  CreditCard, 
  UserCheck,
  Users,
  BookOpen,
  Settings,
  LogOut,
  Bell,
  TrendingUp
} from 'lucide-react';
import { ProfileSection } from './ProfileSection';
import { ServicesSection } from './ServicesSection';
import { MarketplaceSection } from './MarketplaceSection';
import { MessagesSection } from './MessagesSection';
import { EnhancedAgentSection } from './EnhancedAgentSection';
import { AgentSection } from './AgentSection';
import { CreditsSection } from './CreditsSection';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const ProfessionalDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [stats, setStats] = useState({
    credits: 0,
    activeBookings: 0,
    unreadMessages: 0,
    completedServices: 0
  });

  useEffect(() => {
    if (user) {
      fetchDashboardStats();
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    if (!user) return;

    try {
      // Fetch credits
      const { data: creditsData } = await supabase
        .from('credits')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      // Fetch active bookings
      const { data: bookingsData } = await supabase
        .from('service_bookings')
        .select('id')
        .eq('client_id', user.id)
        .in('status', ['pending', 'in_progress']);

      // Fetch unread messages
      const { data: messagesData } = await supabase
        .from('messages')
        .select('id')
        .eq('receiver_id', user.id)
        .is('read_at', null);

      setStats({
        credits: creditsData?.balance || 0,
        activeBookings: bookingsData?.length || 0,
        unreadMessages: messagesData?.length || 0,
        completedServices: 0 // TODO: Calculate completed services
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'services', label: 'Browse Services', icon: BookOpen },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: stats.unreadMessages },
    { id: 'credits', label: 'Credits & Billing', icon: CreditCard },
    { id: 'agent', label: 'Become Agent', icon: UserCheck },
    { id: 'hire-agent', label: 'Hire Agent', icon: Users },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview stats={stats} />;
      case 'profile':
        return <ProfileSection />;
      case 'services':
        return <ServicesSection />;
      case 'marketplace':
        return <MarketplaceSection />;
      case 'messages':
        return <MessagesSection />;
      case 'credits':
        return <CreditsSection />;
      case 'agent':
        return <AgentSection />;
      case 'hire-agent':
        return <EnhancedAgentSection />;
      default:
        return <DashboardOverview stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">UNILAG Connect</h1>
                  <p className="text-xs text-muted-foreground">Student Academic Platform</p>
                </div>
              </div>
              <Badge variant="secondary">Dashboard</Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground hidden md:block">
                Welcome, {user?.email}
              </span>
              <Button onClick={handleHomeClick} variant="ghost" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-background/80 backdrop-blur border-r min-h-[calc(100vh-73px)] p-4">
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.label}
                  {item.badge && item.badge > 0 && (
                    <Badge variant="destructive" className="ml-auto h-5 w-5 p-0 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const DashboardOverview = ({ stats }: { stats: any }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h2>
        <p className="text-muted-foreground">Welcome to your academic success platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Credits</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{stats.credits}</div>
            <p className="text-xs text-muted-foreground">Your account balance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeBookings}</div>
            <p className="text-xs text-muted-foreground">Ongoing services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unreadMessages}</div>
            <p className="text-xs text-muted-foreground">New messages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Services</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedServices}</div>
            <p className="text-xs text-muted-foreground">Total completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex-col space-y-2">
              <BookOpen className="h-6 w-6" />
              <span>Browse Services</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <ShoppingBag className="h-6 w-6" />
              <span>Marketplace</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <UserCheck className="h-6 w-6" />
              <span>Become Agent</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};