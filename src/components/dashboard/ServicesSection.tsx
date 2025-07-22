
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
import { Loader2, Plus, Settings, Edit, Star, Clock, CreditCard, User } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  duration: string;
  requirements: string;
  status: string;
  agent_id: string;
  agents?: {
    user_id: string;
    cgpa: number;
    verification_status: string;
    profiles?: {
      full_name: string;
    };
  };
}

export const ServicesSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [myServices, setMyServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [activeTab, setActiveTab] = useState<'browse' | 'my-services'>('browse');
  const [isAgent, setIsAgent] = useState(false);

  useEffect(() => {
    if (user) {
      checkAgentStatus();
      fetchAllServices();
      fetchMyServices();
    }
  }, [user]);

  const checkAgentStatus = async () => {
    try {
      const { data } = await supabase
        .from('agents')
        .select('id, verification_status')
        .eq('user_id', user?.id)
        .single();
      
      setIsAgent(!!data && data.verification_status === 'approved');
    } catch (error) {
      setIsAgent(false);
    }
  };

  const fetchAllServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          agents!inner(
            user_id,
            cgpa,
            verification_status,
            profiles!inner(full_name)
          )
        `)
        .eq('status', 'active')
        .eq('agents.verification_status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAllServices(data || []);
    } catch (error) {
      console.error('Error fetching all services:', error);
    }
  };

  const fetchMyServices = async () => {
    try {
      const { data: agent } = await supabase
        .from('agents')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (agent) {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('agent_id', agent.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMyServices(data || []);
      }
    } catch (error) {
      console.error('Error fetching my services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const { data: agent } = await supabase
        .from('agents')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!agent) {
        toast({
          title: 'Error',
          description: 'You must be an approved agent to create services',
          variant: 'destructive',
        });
        return;
      }

      const serviceData = {
        agent_id: agent.id,
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        price: parseInt(formData.get('price') as string),
        duration: formData.get('duration') as string,
        requirements: formData.get('requirements') as string,
      };

      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('services')
          .insert(serviceData);
        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: `Service ${editingService ? 'updated' : 'created'} successfully`,
      });

      setShowForm(false);
      setEditingService(null);
      fetchMyServices();
      fetchAllServices();
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        title: 'Error',
        description: 'Failed to save service',
        variant: 'destructive',
      });
    }
  };

  const handleHireAgent = (service: Service) => {
    toast({
      title: 'Hire Agent',
      description: 'Booking feature coming soon! Contact the agent directly for now.',
    });
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
          Browse Services
        </Button>
        {isAgent && (
          <Button
            variant={activeTab === 'my-services' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('my-services')}
          >
            My Services
          </Button>
        )}
      </div>

      {/* Browse Services Tab */}
      {activeTab === 'browse' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Available Services</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allServices.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No services available yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allServices.map((service) => (
                  <Card key={service.id} className="hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary" className="mb-2">
                          {service.category}
                        </Badge>
                        <Badge className="bg-primary">
                          Verified Agent
                        </Badge>
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
                          <div className="font-medium">{service.agents?.profiles?.full_name || 'Anonymous'}</div>
                          <div className="text-sm text-muted-foreground">CGPA: {service.agents?.cgpa}</div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-warning text-warning" />
                            <span className="font-medium">4.8</span>
                            <span className="text-sm text-muted-foreground">(127)</span>
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
                          <CreditCard className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-primary">
                            {service.price} credits
                          </span>
                        </div>
                      </div>

                      {/* Requirements */}
                      {service.requirements && (
                        <div className="text-sm">
                          <span className="font-medium">Requirements: </span>
                          <span className="text-muted-foreground">{service.requirements}</span>
                        </div>
                      )}

                      {/* Action Button */}
                      <Button 
                        className="w-full" 
                        onClick={() => handleHireAgent(service)}
                      >
                        Hire Agent
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* My Services Tab - Only shown for agents */}
      {activeTab === 'my-services' && isAgent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>My Services</span>
              </div>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {myServices.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No services yet. Create your first service to start helping students!
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myServices.map((service) => (
                  <Card key={service.id} className="border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{service.title}</h3>
                        <Badge variant="outline">{service.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {service.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-primary font-semibold">
                          {service.price} credits
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingService(service);
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

      {/* Service Form - Only shown for agents */}
      {showForm && isAgent && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingService ? 'Edit Service' : 'Create New Service'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Service Title</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingService?.title}
                    placeholder="Assignment Help"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    defaultValue={editingService?.category}
                    placeholder="Academic Support"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingService?.description}
                  placeholder="Describe your service..."
                  className="h-24"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (Credits)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="1"
                    defaultValue={editingService?.price}
                    placeholder="100"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    name="duration"
                    defaultValue={editingService?.duration}
                    placeholder="2-3 hours"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  defaultValue={editingService?.requirements}
                  placeholder="What do you need from the client?"
                  className="h-20"
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit">
                  {editingService ? 'Update Service' : 'Create Service'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingService(null);
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
