import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, User, CreditCard, DollarSign } from "lucide-react";

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
    },
  ];

  return (
    <section className="py-20 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Popular Services</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get help from verified UNILAG agents with excellent academic records
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-all duration-300 border-muted-foreground/20">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="mb-2">
                    {service.category}
                  </Badge>
                  {service.agentLevel === "Top Rated" && (
                    <Badge className="bg-warning text-warning-foreground">
                      Top Rated
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg leading-tight">{service.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Agent Info */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{service.agent}</div>
                    <div className="text-sm text-muted-foreground">CGPA: {service.cgpa}</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      <span className="font-medium">{service.rating}</span>
                      <span className="text-sm text-muted-foreground">({service.reviews})</span>
                    </div>
                  </div>
                </div>

                {/* Service Details */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{service.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-success" />
                    <span className="font-semibold text-success">
                      {service.price} {service.currency}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <Button variant="credit" className="w-full">
                  Hire Agent
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Services
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;