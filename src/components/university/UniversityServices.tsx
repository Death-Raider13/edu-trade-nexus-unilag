
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  Users, 
  PenTool, 
  Calculator, 
  Microscope, 
  Globe,
  ArrowRight,
  Star,
  Clock
} from "lucide-react";

export const UniversityServices = () => {
  const navigate = useNavigate();
  const services = [
    {
      icon: BookOpen,
      title: "Literature & Languages",
      description: "Expert help with English, Literature, and Foreign Languages",
      subjects: ["English Literature", "Creative Writing", "French", "Yoruba"],
      rating: 4.9,
      sessions: 1200,
      price: "50 credits/hour",
      color: "bg-blue-500"
    },
    {
      icon: Calculator,
      title: "Mathematics & Statistics",
      description: "Comprehensive support for all math-related courses",
      subjects: ["Calculus", "Statistics", "Linear Algebra", "Discrete Math"],
      rating: 4.8,
      sessions: 950,
      price: "60 credits/hour",
      color: "bg-green-500"
    },
    {
      icon: Microscope,
      title: "Sciences",
      description: "In-depth tutoring for all science disciplines",
      subjects: ["Physics", "Chemistry", "Biology", "Biochemistry"],
      rating: 4.9,
      sessions: 800,
      price: "70 credits/hour",
      color: "bg-purple-500"
    },
    {
      icon: Users,
      title: "Social Sciences",
      description: "Expert guidance in humanities and social studies",
      subjects: ["Psychology", "Sociology", "Political Science", "History"],
      rating: 4.7,
      sessions: 650,
      price: "55 credits/hour",
      color: "bg-orange-500"
    },
    {
      icon: PenTool,
      title: "Engineering & Technology",
      description: "Technical support for engineering students",
      subjects: ["Computer Science", "Electrical Eng", "Mechanical Eng", "Civil Eng"],
      rating: 4.8,
      sessions: 900,
      price: "80 credits/hour",
      color: "bg-red-500"
    },
    {
      icon: Globe,
      title: "Business & Economics",
      description: "Professional guidance for business studies",
      subjects: ["Economics", "Accounting", "Business Admin", "Finance"],
      rating: 4.6,
      sessions: 750,
      price: "65 credits/hour",
      color: "bg-cyan-500"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Academic Services by Department</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get specialized tutoring from top-performing students in your field of study. 
            All tutors are department-verified and academically excellent.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${service.color}/10`}>
                      <service.icon className={`h-6 w-6 ${service.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-medium">{service.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs">{service.sessions} sessions</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {service.description}
                </p>
                
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {service.subjects.map((subject, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-medium text-primary">{service.price}</span>
                    <Button size="sm" className="text-xs" onClick={() => navigate('/services')}>
                      Book Session
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/5" onClick={() => navigate('/services')}>
            View All Services
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};
