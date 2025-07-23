
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Quote, Star } from "lucide-react";

export const UniversityTestimonials = () => {
  const testimonials = [
    {
      name: "Adebayo Ogundimu",
      department: "Computer Science",
      year: "300 Level",
      rating: 5,
      text: "The tutoring I received for Data Structures completely transformed my understanding. My tutor was patient and explained complex concepts in simple terms. I went from struggling to getting an A in the course!",
      course: "CSC 301 - Data Structures"
    },
    {
      name: "Fatima Abdullahi",
      department: "Medicine",
      year: "400 Level",
      rating: 5,
      text: "As a medical student, I needed help with Pharmacology. The platform connected me with a senior student who had excellent teaching skills. The study sessions were well-structured and incredibly helpful.",
      course: "MED 401 - Pharmacology"
    },
    {
      name: "Chidi Okafor",
      department: "Accounting",
      year: "200 Level",
      rating: 5,
      text: "I was really struggling with Financial Accounting until I found this platform. My tutor not only helped me understand the concepts but also shared practical tips for exams. Highly recommended!",
      course: "ACC 201 - Financial Accounting"
    },
    {
      name: "Blessing Adeyemi",
      department: "English Literature",
      year: "300 Level",
      rating: 5,
      text: "The essay writing support I received was exceptional. My tutor helped me develop my analytical skills and improve my writing style. My grades improved significantly after just a few sessions.",
      course: "ENG 301 - Literary Criticism"
    },
    {
      name: "Olumide Fashola",
      department: "Chemical Engineering",
      year: "400 Level",
      rating: 5,
      text: "Process Control was my most challenging course, but my tutor made it manageable. The explanations were clear, and the practice problems really helped me prepare for exams. Excellent service!",
      course: "CHE 401 - Process Control"
    },
    {
      name: "Aisha Mohammed",
      department: "Psychology",
      year: "300 Level",
      rating: 5,
      text: "The statistics tutoring was a game-changer for my research methods course. My tutor was knowledgeable and patient, making complex statistical concepts easy to understand. Great platform!",
      course: "PSY 301 - Research Methods"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Student Success Stories</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from UNILAG students who have transformed their academic performance 
            through our personalized tutoring platform.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 relative">
              <CardContent className="p-6">
                <div className="absolute top-4 right-4 text-muted-foreground/20">
                  <Quote className="h-8 w-8" />
                </div>
                
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt={testimonial.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h4 className="font-semibold text-sm">{testimonial.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.year} • {testimonial.department}
                    </p>
                  </div>
                </div>
                
                <Badge variant="secondary" className="text-xs">
                  {testimonial.course}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground text-sm">
            Join thousands of UNILAG students who have improved their academic performance
          </p>
        </div>
      </div>
    </section>
  );
};
