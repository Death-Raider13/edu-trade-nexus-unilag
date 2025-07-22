
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User, Settings, CreditCard, ShoppingBag, MessageSquare, UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface HeaderProps {
  onDashboardClick?: () => void;
}

export const Header = ({ onDashboardClick }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const getUserInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              WHAT DO YOU WANNA DO
            </h1>
          </div>
        </div>

        {/* Navigation & Auth */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              {/* Quick Actions */}
              <div className="hidden md:flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onDashboardClick}
                  className="text-muted-foreground hover:text-primary"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Marketplace
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onDashboardClick}
                  className="text-muted-foreground hover:text-primary"
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Services
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onDashboardClick}
                  className="text-muted-foreground hover:text-primary"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Messages
                </Button>
              </div>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage src="" alt={user.email || ''} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getUserInitials(user.email || '')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm font-medium leading-none">Welcome back!</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                      <Badge variant="secondary" className="w-fit text-xs">
                        Student Account
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={onDashboardClick} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={onDashboardClick} className="cursor-pointer">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Credits & Billing</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={onDashboardClick} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                    Sign In
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-center">Welcome to WHAT DO YOU WANNA DO</DialogTitle>
                  </DialogHeader>
                  <AuthForm onSuccess={() => setShowAuthDialog(false)} />
                </DialogContent>
              </Dialog>
              
              <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
                <DialogTrigger asChild>
                  <Button className="shadow-md">
                    Get Started
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-center">Join WHAT DO YOU WANNA DO</DialogTitle>
                  </DialogHeader>
                  <AuthForm onSuccess={() => setShowAuthDialog(false)} />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
