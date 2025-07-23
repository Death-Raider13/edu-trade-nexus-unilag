
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, 
  Clock, 
  BookOpen, 
  Users, 
  Award, 
  CreditCard, 
  MessageSquare, 
  TrendingUp,
  CheckCircle
} from "lucide-react";

export const UniversityFeatures = () => {
  const features = [
    {
      icon: Shield,
      title: "Verified Tutors",
      description: "All tutors are verified UNILAG students with proven academic excellence and high CGPA requirements.",
      highlights: ["CGPA 3.5+ requirement", "Academic transcripts verified", "Peer recommendations"]
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Book tutoring sessions that fit your academic calendar and personal schedule.",
      highlights: ["24/7 availability", "Reschedule anytime", "Academic calendar sync"]
    },
    {
      icon: BookOpen,
      title: "Course-Specific Help",
      description: "Get targeted assistance for your specific courses and academic challenges.",
      highlights: ["All UNILAG courses", "Assignment help", "Exam preparation"]
    },
    {
      icon: Users,
      title: "Study Groups",
      description: "Join or create study groups with fellow students in your department or faculty.",
      highlights: ["Department-based groups", "Collaborative learning", "Peer networking"]
    },
    {
      icon: Award,
      title: "Academic Recognition",
      description: "Earn badges and recognition for your academic achievements and contributions.",
      highlights: ["Achievement badges", "Peer recognition", "Academic portfolio"]
    },
    {
      icon: CreditCard,
      title: "Flexible Payment",
      description: "Pay using our credit system designed for students' financial convenience.",
      highlights: ["Student-friendly rates", "Credit packages", "Secure payments"]
    },
    {
      icon: MessageSquare,
      title: "Academic Chat",
      description: "Instant messaging with tutors and study partners for quick academic discussions.",
      highlights: ["Real-time messaging", "File sharing", "Voice notes"]
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor your academic progress and see improvement over time.",
      highlights: ["Grade tracking", "Progress reports", "Goal setting"]
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose UNILAG Academic Hub?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform is designed specifically for UNILAG students, by UNILAG students, 
            ensuring you get the most relevant and effective academic support.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-muted-foreground">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
