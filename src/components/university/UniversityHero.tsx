
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, BookOpen, Users, Award, TrendingUp, GraduationCap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-unilag.jpg";

export const UniversityHero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      // Scroll to auth section or trigger auth modal
      const authButtons = document.querySelector('[data-auth-trigger]');
      if (authButtons) {
        authButtons.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-primary">
                <GraduationCap className="h-5 w-5" />
                <span className="text-sm font-medium">University of Lagos Academic Platform</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="text-foreground">Excel in Your</span>
                <br />
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Academic Journey
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                Connect with verified UNILAG tutors, access academic resources, and build your professional network. 
                Your success is our priority.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleGetStarted}
                size="lg" 
                className="text-lg bg-primary hover:bg-primary/90 shadow-lg"
              >
                {user ? 'Go to Dashboard' : 'Get Started'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg border-primary/20 hover:bg-primary/5"
              >
                Explore Services
              </Button>
            </div>

            {/* Academic Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center space-y-1">
                <div className="text-2xl font-bold text-primary">2,500+</div>
                <div className="text-sm text-muted-foreground">Active Students</div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-2xl font-bold text-secondary">150+</div>
                <div className="text-sm text-muted-foreground">Verified Tutors</div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-2xl font-bold text-accent">98%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={heroImage} 
                alt="UNILAG students studying together" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent"></div>
              
              {/* Floating Academic Cards */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Academic Support</span>
                </div>
              </div>
              
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-accent" />
                  <span className="text-sm font-medium">Verified Tutors</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Academic Cards */}
      <div className="container pb-16">
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border-primary/20 hover:border-primary/40 bg-white/50 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Tutoring</h3>
                <p className="text-sm text-muted-foreground">One-on-one academic help</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border-secondary/20 hover:border-secondary/40 bg-white/50 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg bg-secondary/10">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Study Groups</h3>
                <p className="text-sm text-muted-foreground">Collaborative learning</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border-accent/20 hover:border-accent/40 bg-white/50 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg bg-accent/10">
                <Award className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Certifications</h3>
                <p className="text-sm text-muted-foreground">Skill development</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border-success/20 hover:border-success/40 bg-white/50 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg bg-success/10">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Career Growth</h3>
                <p className="text-sm text-muted-foreground">Professional development</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
