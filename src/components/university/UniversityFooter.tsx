
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

export const UniversityFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">UNILAG Academic Hub</h3>
                <p className="text-xs text-muted-foreground">Student Success Platform</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4 max-w-md">
              Empowering University of Lagos students through peer-to-peer tutoring, 
              collaborative learning, and academic excellence. Built by students, for students.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="p-2">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Academic Services</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Find Tutors</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Become a Tutor</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Study Groups</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Course Materials</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Exam Prep</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Academic Guidelines</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Safety & Security</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        {/* University Contact Information */}
        <div className="border-t pt-8 mt-8">
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                University of Lagos, Akoka, Lagos State
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                +234 (0) 1 123 4567
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                support@unilagacademichub.com
              </span>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t pt-6 mt-6 text-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} UNILAG Academic Hub. All rights reserved. 
            <span className="ml-2">Built with ❤️ for UNILAG students</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
