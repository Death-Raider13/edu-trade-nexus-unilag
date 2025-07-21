import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, ArrowRightLeft, DollarSign, Zap, Shield, Clock } from "lucide-react";

const Credits = () => {
  const creditPackages = [
    {
      amount: 500,
      price: 5000,
      bonus: 0,
      popular: false,
    },
    {
      amount: 1000,
      price: 9500,
      bonus: 50,
      popular: true,
    },
    {
      amount: 2500,
      price: 22500,
      bonus: 250,
      popular: false,
    },
    {
      amount: 5000,
      price: 42500,
      bonus: 750,
      popular: false,
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const features = [
    {
      icon: Zap,
      title: "Instant Transfer",
      description: "Credits appear in your account immediately after payment",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Bank-grade security for all transactions",
    },
    {
      icon: Clock,
      title: "24/7 Available",
      description: "Buy and use credits anytime, anywhere",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Credits System</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Convert cash to credits for seamless service payments. 1 Credit = ₦10
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* How It Works */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ArrowRightLeft className="h-5 w-5 text-primary" />
                  <span>How It Works</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Purchase Credits</h4>
                      <p className="text-sm text-muted-foreground">Buy credits using bank transfer or card payment</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Use for Services</h4>
                      <p className="text-sm text-muted-foreground">Pay agents for academic help and tutoring</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 rounded-full bg-success text-success-foreground flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Earn & Convert</h4>
                      <p className="text-sm text-muted-foreground">Agents earn credits and can convert back to cash</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-3">Features</h4>
                  <div className="space-y-3">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <feature.icon className="h-4 w-4 text-primary" />
                        <div>
                          <div className="text-sm font-medium">{feature.title}</div>
                          <div className="text-xs text-muted-foreground">{feature.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Credit Packages */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold mb-6">Buy Credits</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {creditPackages.map((pkg, index) => (
                <Card key={index} className={`relative ${pkg.popular ? 'border-accent shadow-lg' : ''}`}>
                  {pkg.popular && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-accent">
                      Most Popular
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className="text-3xl font-bold text-success">
                      {pkg.amount.toLocaleString()}
                      {pkg.bonus > 0 && (
                        <span className="text-sm text-accent"> +{pkg.bonus}</span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">Credits</div>
                    <div className="text-xl font-semibold">
                      {formatPrice(pkg.price)}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {pkg.bonus > 0 && (
                      <div className="text-center p-2 bg-accent/10 rounded-md">
                        <span className="text-sm font-medium text-accent">
                          Bonus: {pkg.bonus} free credits!
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center text-sm text-muted-foreground">
                      Rate: ₦{(pkg.price / (pkg.amount + pkg.bonus)).toFixed(2)} per credit
                    </div>

                    <Button 
                      variant={pkg.popular ? "hero" : "credit"} 
                      className="w-full"
                      size="lg"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Buy Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="mt-8 p-6 bg-card rounded-lg border">
              <h4 className="font-medium mb-4">Accepted Payment Methods</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-md">
                  <DollarSign className="h-5 w-5 text-success" />
                  <span className="text-sm">Bank Transfer</span>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-md">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span className="text-sm">Debit Card</span>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-md">
                  <CreditCard className="h-5 w-5 text-secondary" />
                  <span className="text-sm">Credit Card</span>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-md">
                  <DollarSign className="h-5 w-5 text-accent" />
                  <span className="text-sm">USSD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Credits;