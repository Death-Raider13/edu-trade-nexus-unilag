
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, User, CreditCard, Award, TrendingUp, Shield } from "lucide-react";

const Services = () => {
  const services = [
    {
      id: 1,
      title: "Assignment Help - Engineering Mathematics",
      agent: "John Adebayo",
      rating: 4.9,
      reviews: 127,
      price: 250,
      currency: "credits",
      duration: "2-3 days",
      category: "Academic Help",
      description: "Expert help with calculus, linear algebra, and differential equations",
      agentLevel: "Verified",
      cgpa: 3.8,
      completedJobs: 89,
    },
    {
      id: 2,
      title: "Research Paper Writing - Computer Science",
      agent: "Funmi Okafor",
      rating: 5.0,
      reviews: 89,
      price: 400,
      currency: "credits",
      duration: "5-7 days",
      category: "Academic Help",
      description: "High-quality research papers with proper citations and methodology",
      agentLevel: "Top Rated",
      cgpa: 3.9,
      completedJobs: 156,
    },
    {
      id: 3,
      title: "Programming Tutor - Python & Java",
      agent: "Kemi Ogundipe",
      rating: 4.8,
      reviews: 156,
      price: 150,
      currency: "credits",
      duration: "1 hour",
      category: "Tutoring",
      description: "One-on-one programming sessions for beginners to advanced",
      agentLevel: "Verified",
      cgpa: 3.7,
      completedJobs: 203,
    },
    {
      id: 4,
      title: "Exam Preparation - Accounting",
      agent: "David Olamide",
      rating: 4.7,
      reviews: 203,
      price: 300,
      currency: "credits",
      duration: "3-4 days",
      category: "Academic Help",
      description: "Comprehensive exam prep with practice questions and summaries",
      agentLevel: "Verified",
      cgpa: 3.6,
      completedJobs: 78,
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Award className="h-4 w-4" />
            <span>Verified Student Agents</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Popular Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Get professional help from verified UNILAG agents with excellent academic records and proven track records
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {services.map((service) => (
            <Card key={service.id} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:shadow-primary/5 bg-gradient-to-br from-background to-background/50">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      {service.category}
                    </Badge>
                    {service.agentLevel === "Top Rated" && (
                      <Badge className="bg-gradient-to-r from-warning/20 to-warning/10 text-warning border-warning/30">
                        <Award className="h-3 w-3 mr-1" />
                        Top Rated
                      </Badge>
                    )}
                  </div>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>
                
                <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors duration-300">
                  {service.title}
                </CardTitle>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Enhanced Agent Info */}
                <div className="flex items-center space-x-4 p-4 bg-muted/20 rounded-xl border">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/20">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{service.agent}</div>
                    <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                      <span>CGPA: {service.cgpa}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>{service.completedJobs} jobs completed</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-1">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      <span className="font-bold">{service.rating}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">({service.reviews} reviews)</div>
                  </div>
                </div>

                {/* Service Details */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{service.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <span className="font-bold text-xl text-primary">
                      {service.price} {service.currency}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  className="w-full shadow-lg group-hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-lg py-6"
                >
                  <User className="h-5 w-5 mr-2" />
                  Hire Agent Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-2xl border border-primary/20 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of UNILAG students who trust our verified agents for academic success
            </p>
            <Button size="lg" className="shadow-lg">
              View All Services
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
