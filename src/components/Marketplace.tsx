
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Star, ShoppingBag, TrendingUp, Shield, Verified } from "lucide-react";

const Marketplace = () => {
  const products = [
    {
      id: 1,
      title: "Engineering Calculator (Casio FX-991)",
      price: 25000,
      condition: "Like New",
      seller: "Ahmed Bello",
      rating: 4.8,
      location: "Akoka Campus",
      image: "/placeholder.svg",
      category: "Electronics",
      description: "Scientific calculator in excellent condition, barely used for one semester",
      commission: 2500,
      views: 234,
      isVerified: true,
    },
    {
      id: 2,
      title: "Computer Science Textbook Bundle",
      price: 45000,
      condition: "Good",
      seller: "Blessing Okafor",
      rating: 4.9,
      location: "Yaba Campus",
      image: "/placeholder.svg",
      category: "Books",
      description: "Complete set of CS textbooks for 200-400 level courses with notes",
      commission: 4500,
      views: 156,
      isVerified: true,
    },
    {
      id: 3,
      title: "MacBook Air M1 (2020)",
      price: 850000,
      condition: "Excellent",
      seller: "Chidi Okwu",
      rating: 5.0,
      location: "Akoka Campus",
      image: "/placeholder.svg",
      category: "Electronics",
      description: "8GB RAM, 256GB SSD, perfect for students. Comes with charger and case",
      commission: 85000,
      views: 432,
      isVerified: true,
    },
    {
      id: 4,
      title: "Laboratory Equipment Set",
      price: 35000,
      condition: "New",
      seller: "Fatima Abdullahi",
      rating: 4.7,
      location: "Medical Campus",
      image: "/placeholder.svg",
      category: "Equipment",
      description: "Complete lab equipment for medical students, unopened packaging",
      commission: 3500,
      views: 98,
      isVerified: false,
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="py-24 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <ShoppingBag className="h-4 w-4" />
            <span>Trusted Student Marketplace</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Student Marketplace
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Buy and sell with fellow UNILAG students safely. All transactions include buyer protection and 10% platform fee.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-2xl transition-all duration-500 overflow-hidden border-0 shadow-lg bg-gradient-to-b from-background to-background/50">
              <div className="relative overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-muted/30 to-muted/60 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
                </div>
                
                {/* Badges */}
                <Badge className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm border-0 shadow-lg">
                  {product.category}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm hover:bg-background shadow-lg border-0"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                
                {/* Condition & Views */}
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <Badge 
                    variant="outline" 
                    className="bg-background/95 backdrop-blur-sm border-primary/20 text-xs"
                  >
                    {product.condition}
                  </Badge>
                  <div className="flex items-center space-x-1 text-xs text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                    <TrendingUp className="h-3 w-3" />
                    <span>{product.views} views</span>
                  </div>
                </div>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300">
                  {product.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Price Section */}
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </div>
                  <div className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded">
                    Platform fee: {formatPrice(product.commission)}
                  </div>
                </div>

                {/* Seller Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-warning text-warning" />
                      <span className="font-medium text-sm">{product.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      {product.isVerified && <Verified className="h-3 w-3 text-primary" />}
                      <span className="font-medium">{product.seller}</span>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{product.location}</span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <Button className="w-full shadow-md group-hover:shadow-lg transition-all duration-300" size="sm">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Buy Now
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    Message Seller
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-2xl border border-primary/20 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-bold">Safe & Secure Shopping</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Shop with confidence knowing all sellers are verified UNILAG students with buyer protection included
            </p>
            <Button size="lg" className="shadow-lg">
              <ShoppingBag className="h-5 w-5 mr-2" />
              View All Products
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Marketplace;
