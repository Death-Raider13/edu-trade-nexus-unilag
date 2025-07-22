
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
import { Loader2, Plus, ShoppingBag, Edit, MessageSquare, Heart, MapPin, Star } from 'lucide-react';

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
  profiles?: {
    full_name: string;
  };
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

  useEffect(() => {
    if (user) {
      fetchAllItems();
      fetchMyItems();
    }
  }, [user]);

  const fetchAllItems = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_items')
        .select(`
          *,
          profiles!inner(full_name)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAllItems(data || []);
    } catch (error) {
      console.error('Error fetching all items:', error);
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
      price: parseInt(formData.get('price') as string) * 100, // Convert to kobo
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
      description: `Messaging feature coming soon! For now, contact the seller directly.`,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price / 100);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === 'browse' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('browse')}
        >
          Browse Marketplace
        </Button>
        <Button
          variant={activeTab === 'my-listings' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('my-listings')}
        >
          My Listings
        </Button>
      </div>

      {/* Browse Marketplace Tab */}
      {activeTab === 'browse' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5" />
              <span>Browse Marketplace</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allItems.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No items available in the marketplace yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="aspect-square bg-muted/50 flex items-center justify-center">
                      <div className="text-muted-foreground text-sm">Product Image</div>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-sm line-clamp-2">{item.title}</h3>
                          <Badge variant="outline" className="text-xs">{item.condition}</Badge>
                        </div>
                        
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>
                        
                        <div className="text-lg font-bold text-primary">
                          {formatPrice(item.price)}
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{item.profiles?.full_name || 'Anonymous'}</span>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{item.location}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => handleContactSeller(item)}
                          >
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Contact
                          </Button>
                          <Button variant="outline" size="sm">
                            <Heart className="h-3 w-3" />
                          </Button>
                        </div>
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5" />
                <span>My Listings</span>
              </div>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                List Item
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {myItems.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No items listed yet. Start selling to earn money!
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myItems.map((item) => (
                  <Card key={item.id} className="border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{item.title}</h3>
                        <Badge variant="outline">{item.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-primary font-semibold">
                          {formatPrice(item.price)}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingItem(item);
                            setShowForm(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
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

      {/* List Item Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingItem ? 'Edit Item' : 'List New Item'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Item Title</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingItem?.title}
                    placeholder="iPhone 13 Pro"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    defaultValue={editingItem?.category}
                    placeholder="Electronics"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingItem?.description}
                  placeholder="Describe your item..."
                  className="h-24"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₦)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="1"
                    defaultValue={editingItem ? editingItem.price / 100 : ''}
                    placeholder="50000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <select
                    id="condition"
                    name="condition"
                    className="w-full p-2 border rounded-md"
                    defaultValue={editingItem?.condition}
                    required
                  >
                    <option value="">Select condition</option>
                    <option value="new">New</option>
                    <option value="like_new">Like New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    defaultValue={editingItem?.location}
                    placeholder="Akoka, Lagos"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button type="submit">
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
