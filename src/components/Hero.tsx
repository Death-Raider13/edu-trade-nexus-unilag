import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Users, BookOpen, ShoppingBag, CreditCard } from "lucide-react";
import heroImage from "@/assets/hero-unilag.jpg";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/50 to-background">
      {/* Hero Content */}
      <div className="container py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  WHAT DO YOU
                </span>
                <br />
                <span className="text-foreground">WANNA DO?</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                UNILAG's premier marketplace for buying, selling, learning, and growing together. 
                Get academic help, trade goods, or become a trusted agent.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="text-lg">
                Explore Marketplace
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="agent" size="lg" className="text-lg">
                Become an Agent
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">1,200+</div>
                <div className="text-sm text-muted-foreground">Services Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">50+</div>
                <div className="text-sm text-muted-foreground">Verified Agents</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={heroImage} 
                alt="UNILAG students collaborating" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="container pb-20">
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border-primary/20 hover:border-primary/40">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Buy & Sell</h3>
                <p className="text-sm text-muted-foreground">Trade goods with students</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border-secondary/20 hover:border-secondary/40">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <BookOpen className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold">Academic Help</h3>
                <p className="text-sm text-muted-foreground">Get help with assignments</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border-success/20 hover:border-success/40">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-success/10">
                <CreditCard className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="font-semibold">Credits System</h3>
                <p className="text-sm text-muted-foreground">Flexible payment options</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border-accent/20 hover:border-accent/40">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Trusted Agents</h3>
                <p className="text-sm text-muted-foreground">Verified UNILAG students</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Hero;