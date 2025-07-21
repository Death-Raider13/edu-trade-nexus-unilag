import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, DollarSign, Star } from "lucide-react";

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
      description: "Scientific calculator in excellent condition, barely used",
      commission: 2500,
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
      description: "Complete set of CS textbooks for 200-400 level courses",
      commission: 4500,
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
      description: "8GB RAM, 256GB SSD, perfect for students",
      commission: 85000,
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
      description: "Complete lab equipment for medical students",
      commission: 3500,
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
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Student Marketplace</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Buy and sell with fellow UNILAG students. All transactions include 10% platform commission.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative">
                <div className="aspect-square bg-muted/50 flex items-center justify-center">
                  <div className="text-muted-foreground text-sm">Product Image</div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Badge className="absolute top-2 left-2 bg-primary">
                  {product.category}
                </Badge>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-base leading-tight line-clamp-2">
                  {product.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Price */}
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Commission: {formatPrice(product.commission)}
                  </div>
                </div>

                {/* Condition */}
                <Badge variant="outline" className="w-fit">
                  {product.condition}
                </Badge>

                {/* Seller Info */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-warning text-warning" />
                    <span className="font-medium">{product.rating}</span>
                  </div>
                  <div className="text-muted-foreground">{product.seller}</div>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{product.location}</span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <Button className="w-full" size="sm">
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

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Marketplace;