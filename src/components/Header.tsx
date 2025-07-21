import { Button } from "@/components/ui/button";
import { CreditCard, User, Search, ShoppingCart } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-secondary"></div>
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            WHAT DO YOU WANNA DO
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-sm mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="search"
              placeholder="Search services, goods, or agents..."
              className="w-full pl-10 pr-4 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            Marketplace
          </Button>
          <Button variant="ghost" size="sm">
            Services
          </Button>
          <Button variant="agent" size="sm">
            Become Agent
          </Button>
          
          {/* Credits Display */}
          <div className="flex items-center space-x-2 px-3 py-1 bg-success/10 rounded-md">
            <CreditCard className="h-4 w-4 text-success" />
            <span className="text-sm font-medium text-success">1,250 Credits</span>
          </div>

          {/* Cart */}
          <Button variant="outline" size="icon">
            <ShoppingCart className="h-4 w-4" />
          </Button>

          {/* User */}
          <Button variant="outline" size="icon">
            <User className="h-4 w-4" />
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;