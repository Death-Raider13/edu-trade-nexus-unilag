import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Eye, MapPin, Search, GraduationCap, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  location: string;
  views: number;
  images: string[];
  seller_id: string;
  created_at: string;
  seller?: {
    full_name: string;
    avatar_url?: string;
  };
}

export const Marketplace = () => {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const { user } = useAuth();
  const { toast } = useToast();

  const categories = [
    'all',
    'textbooks',
    'electronics',
    'clothing',
    'furniture',
    'stationery',
    'accessories',
    'other'
  ];

  const conditions = [
    'all',
    'brand_new',
    'like_new',
    'good',
    'fair',
    'poor'
  ];

  useEffect(() => {
    fetchMarketplaceItems();
  }, []);

  const fetchMarketplaceItems = async () => {
    try {
      // First get marketplace items
      const { data: itemsData, error: itemsError } = await supabase
        .from('marketplace_items')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (itemsError) throw itemsError;

      // Then get seller profiles for each item
      const itemsWithSellers = await Promise.all(
        (itemsData || []).map(async (item) => {
          const { data: sellerData } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', item.seller_id)
            .single();

          return {
            ...item,
            seller: sellerData
          };
        })
      );
      
      setItems(itemsWithSellers);
    } catch (error) {
      console.error('Error fetching marketplace items:', error);
      toast({
        title: "Error",
        description: "Failed to load marketplace items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContactSeller = (itemId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to contact sellers",
        variant: "destructive",
      });
      return;
    }
    // TODO: Implement contact seller functionality
    toast({
      title: "Contact Seller",
      description: "Messaging feature coming soon!",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesCondition = selectedCondition === 'all' || item.condition === selectedCondition;
    return matchesSearch && matchesCategory && matchesCondition;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Student Marketplace</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Buy and sell items safely within the UNILAG community
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCondition} onValueChange={setSelectedCondition}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                {conditions.map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {condition === 'all' ? 'All Conditions' : condition.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow overflow-hidden">
              <div className="aspect-square bg-gray-100 relative">
                {item.images && item.images.length > 0 ? (
                  <img 
                    src={item.images[0]} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <GraduationCap className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary">
                    {item.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant={item.condition === 'brand_new' ? 'default' : 'outline'}>
                    {item.condition.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-1">{item.title}</CardTitle>
                <div className="text-2xl font-bold text-primary">
                  {formatPrice(item.price)}
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-3 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <GraduationCap className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{item.seller?.full_name}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {item.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {item.views}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleContactSeller(item.id)}
                    className="flex-1"
                  >
                    Contact Seller
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No items found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};