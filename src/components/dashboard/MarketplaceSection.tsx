
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, ShoppingBag, Edit, MessageSquare, Heart, MapPin, Star, Filter, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: string;
  category: string;
  location: string;
  status: string;
  seller_id: string;
  images?: string[];
  seller_name?: string;
}

export const MarketplaceSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [allItems, setAllItems] = useState<MarketplaceItem[]>([]);
  const [myItems, setMyItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MarketplaceItem | null>(null);
  const [activeTab, setActiveTab] = useState<'browse' | 'my-listings'>('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [conditionFilter, setConditionFilter] = useState<string>('all');

  useEffect(() => {
    if (user) {
      fetchAllItems();
      fetchMyItems();
    }
  }, [user]);

  const fetchAllItems = async () => {
    try {
      // First get marketplace items
      const { data: items, error: itemError } = await supabase
        .from('marketplace_items')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (itemError) throw itemError;

      // Then get seller names from profiles
      const itemsWithSellers: MarketplaceItem[] = [];
      
      for (const item of items || []) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', item.seller_id)
          .single();
        
        itemsWithSellers.push({
          ...item,
          seller_name: profile?.full_name || 'Anonymous'
        });
      }

      setAllItems(itemsWithSellers);
    } catch (error) {
      console.error('Error fetching all items:', error);
      toast({
        title: 'Error',
        description: 'Failed to load marketplace items',
        variant: 'destructive',
      });
    }
  };

  const fetchMyItems = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_items')
        .select('*')
        .eq('seller_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyItems(data || []);
    } catch (error) {
      console.error('Error fetching my items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const itemData = {
      seller_id: user?.id,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: parseInt(formData.get('price') as string) * 100,
      condition: formData.get('condition') as string,
      category: formData.get('category') as string,
      location: formData.get('location') as string,
    };

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('marketplace_items')
          .update(itemData)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('marketplace_items')
          .insert(itemData);
        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: `Item ${editingItem ? 'updated' : 'listed'} successfully`,
      });

      setShowForm(false);
      setEditingItem(null);
      fetchMyItems();
      fetchAllItems();
    } catch (error) {
      console.error('Error saving item:', error);
      toast({
        title: 'Error',
        description: 'Failed to save item',
        variant: 'destructive',
      });
    }
  };

  const handleContactSeller = (item: MarketplaceItem) => {
    toast({
      title: 'Contact Seller',
      description: `Connect with ${item.seller_name} to discuss this item.`,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price / 100);
  };

  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesCondition = conditionFilter === 'all' || item.condition === conditionFilter;
    
    return matchesSearch && matchesCategory && matchesCondition;
  });

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading marketplace...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Student Marketplace
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Buy and sell with fellow UNILAG students safely and securely
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="flex space-x-1 bg-muted p-1 rounded-xl w-fit">
          <Button
            variant={activeTab === 'browse' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('browse')}
            className="rounded-lg px-6"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Browse Marketplace
          </Button>
          <Button
            variant={activeTab === 'my-listings' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('my-listings')}
            className="rounded-lg px-6"
          >
            <Edit className="h-4 w-4 mr-2" />
            My Listings
          </Button>
        </div>
      </div>

      {/* Browse Marketplace Tab */}
      {activeTab === 'browse' && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <CardTitle className="flex items-center space-x-2 text-xl">
                <ShoppingBag className="h-6 w-6 text-primary" />
                <span>Available Items</span>
                <Badge variant="secondary" className="ml-2">
                  {filteredItems.length} items
                </Badge>
              </CardTitle>
              
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Books">Books</SelectItem>
                    <SelectItem value="Clothing">Clothing</SelectItem>
                    <SelectItem value="Furniture">Furniture</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={conditionFilter} onValueChange={setConditionFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="like_new">Like New</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  {searchTerm || categoryFilter !== 'all' || conditionFilter !== 'all' 
                    ? 'No items match your search' 
                    : 'No items available yet'
                  }
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm || categoryFilter !== 'all' || conditionFilter !== 'all'
                    ? 'Try adjusting your search filters'
                    : 'Be the first to list an item for sale!'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 border hover:border-primary/20">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <div className="aspect-square bg-gradient-to-br from-muted/30 to-muted/60 flex items-center justify-center">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
                      </div>
                      <Badge className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm">
                        {item.category}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm hover:bg-background"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Badge 
                        variant="outline" 
                        className="absolute bottom-3 right-3 bg-background/90 backdrop-blur-sm border-primary/20"
                      >
                        {item.condition}
                      </Badge>
                    </div>
                    
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {item.description}
                        </p>
                      </div>
                      
                      <div className="text-2xl font-bold text-primary">
                        {formatPrice(item.price)}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <Star className="h-3 w-3 fill-warning/50 text-warning" />
                          <span className="font-medium">{item.seller_name}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="text-xs">{item.location}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 pt-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleContactSeller(item)}
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Contact
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="px-3"
                        >
                          <Heart className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* My Listings Tab */}
      {activeTab === 'my-listings' && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Edit className="h-6 w-6 text-primary" />
                <span>My Listings</span>
                <Badge variant="secondary" className="ml-2">
                  {myItems.length} items
                </Badge>
              </CardTitle>
              <Button onClick={() => setShowForm(true)} className="shadow-md">
                <Plus className="h-4 w-4 mr-2" />
                List New Item
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {myItems.length === 0 ? (
              <div className="text-center py-12">
                <Edit className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  No items listed yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start selling to earn money from items you no longer need!
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  List Your First Item
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myItems.map((item) => (
                  <Card key={item.id} className="border-primary/20 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg line-clamp-2">{item.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {item.description}
                          </p>
                        </div>
                        <Badge 
                          variant={item.status === 'active' ? 'default' : 'secondary'}
                          className="ml-2"
                        >
                          {item.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xl font-bold text-primary">
                          {formatPrice(item.price)}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingItem(item);
                              setShowForm(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Category: {item.category}</span>
                        <span>Condition: {item.condition}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Enhanced Item Form */}
      {showForm && (
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
            <CardTitle className="text-xl">
              {editingItem ? 'Edit Item' : 'List New Item'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">Item Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingItem?.title}
                    placeholder="e.g., iPhone 13 Pro Max"
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">Category *</Label>
                  <Select name="category" defaultValue={editingItem?.category} required>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Books">Books & Study Materials</SelectItem>
                      <SelectItem value="Clothing">Clothing & Fashion</SelectItem>
                      <SelectItem value="Furniture">Furniture</SelectItem>
                      <SelectItem value="Sports">Sports & Recreation</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingItem?.description}
                  placeholder="Describe your item in detail..."
                  className="h-24 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium">Price (₦) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="1"
                    defaultValue={editingItem ? editingItem.price / 100 : ''}
                    placeholder="50000"
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition" className="text-sm font-medium">Condition *</Label>
                  <Select name="condition" defaultValue={editingItem?.condition} required>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Brand New</SelectItem>
                      <SelectItem value="like_new">Like New</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    defaultValue={editingItem?.location}
                    placeholder="e.g., Akoka Campus"
                    className="h-11"
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <Button type="submit" className="shadow-md">
                  {editingItem ? 'Update Item' : 'List Item'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingItem(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
