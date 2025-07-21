import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Upload, Award, TrendingUp } from "lucide-react";

const AgentSignup = () => {
  const requirements = [
    {
      title: "Tech Savvy",
      description: "Comfortable with digital platforms and online communication",
      icon: TrendingUp,
    },
    {
      title: "CGPA 3.5+",
      description: "Minimum cumulative grade point average of 3.5",
      icon: Award,
    },
    {
      title: "Academic Records",
      description: "Submit your last year's exam results from UNILAG",
      icon: Upload,
    },
  ];

  const benefits = [
    "Earn credits and real money",
    "Flexible working hours",
    "Build your reputation",
    "Help fellow students",
    "Gain professional experience",
    "Access to exclusive opportunities",
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-secondary/5 via-background to-primary/5">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Become a Trusted Agent</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Share your knowledge, help fellow students, and earn money doing what you love
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Requirements */}
          <div>
            <h3 className="text-2xl font-semibold mb-6">Requirements</h3>
            <div className="space-y-4">
              {requirements.map((req, index) => (
                <Card key={index} className="border-primary/20">
                  <CardContent className="flex items-start space-x-4 p-6">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <req.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{req.title}</h4>
                      <p className="text-sm text-muted-foreground">{req.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Application Form */}
          <Card className="shadow-xl border-primary/20">
            <CardHeader>
              <CardTitle className="text-center">Agent Application</CardTitle>
              <p className="text-center text-muted-foreground">
                Fill out the form below to start your journey
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">First Name</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border rounded-md bg-background"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Last Name</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border rounded-md bg-background"
                    placeholder="Adebayo"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">UNILAG Email</label>
                <input 
                  type="email" 
                  className="w-full p-3 border rounded-md bg-background"
                  placeholder="student@unilag.edu.ng"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Current CGPA</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="3.5"
                    max="5.0"
                    className="w-full p-3 border rounded-md bg-background"
                    placeholder="3.75"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Year of Study</label>
                  <select className="w-full p-3 border rounded-md bg-background">
                    <option value="">Select Year</option>
                    <option value="200">200 Level</option>
                    <option value="300">300 Level</option>
                    <option value="400">400 Level</option>
                    <option value="500">500 Level</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Faculty/Department</label>
                <input 
                  type="text" 
                  className="w-full p-3 border rounded-md bg-background"
                  placeholder="e.g., Engineering/Computer Science"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Services You Can Offer</label>
                <textarea 
                  className="w-full p-3 border rounded-md bg-background h-24"
                  placeholder="Describe the academic help, tutoring, or other services you can provide..."
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Upload Last Year's Results</label>
                <div className="border-2 border-dashed border-muted-foreground/30 rounded-md p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop your academic transcript
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Choose File
                  </Button>
                </div>
              </div>

              <Button variant="agent" size="lg" className="w-full">
                Submit Application
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Applications are reviewed within 48 hours. You'll be notified via email.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-center mb-8">Agent Benefits</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-card rounded-lg border">
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgentSignup;