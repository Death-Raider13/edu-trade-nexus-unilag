
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, BookOpen, Award, Clock, Star } from "lucide-react";

export const UniversityStats = () => {
  const stats = [
    {
      icon: Users,
      value: "2,500+",
      label: "Active Students",
      description: "Currently enrolled and active",
      color: "text-primary"
    },
    {
      icon: BookOpen,
      value: "150+",
      label: "Verified Tutors",
      description: "Expert academic mentors",
      color: "text-secondary"
    },
    {
      icon: Award,
      value: "98%",
      label: "Success Rate",
      description: "Student satisfaction score",
      color: "text-accent"
    },
    {
      icon: Clock,
      value: "5,000+",
      label: "Hours Taught",
      description: "Total tutoring hours",
      color: "text-success"
    },
    {
      icon: Star,
      value: "4.9/5",
      label: "Average Rating",
      description: "Student reviews",
      color: "text-warning"
    },
    {
      icon: TrendingUp,
      value: "85%",
      label: "Grade Improvement",
      description: "Students see better grades",
      color: "text-primary"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Academic Excellence in Numbers</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform has helped thousands of UNILAG students achieve their academic goals 
            through personalized tutoring and collaborative learning.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg bg-background ${stat.color.replace('text-', 'bg-')}/10`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-sm font-medium text-foreground mb-1">{stat.label}</div>
                    <div className="text-xs text-muted-foreground">{stat.description}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
