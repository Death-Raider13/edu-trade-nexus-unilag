
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
import { Loader2, Plus, Settings, Edit, Star, Clock, CreditCard, User, Filter, Search, Award } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  agent_name?: string;
  agent_cgpa?: number;
  agent_rating?: number;
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
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

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
      // First get services with agent info
      const { data: services, error: servicesError } = await supabase
        .from('services')
        .select(`
          *,
          agents!inner(user_id, cgpa, verification_status)
        `)
        .eq('status', 'active')
        .eq('agents.verification_status', 'approved')
        .order('created_at', { ascending: false });

      if (servicesError) throw servicesError;

      // Then get agent names from profiles
      const servicesWithAgentInfo: Service[] = [];
      
      for (const service of services || []) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', service.agents.user_id)
          .single();
        
        servicesWithAgentInfo.push({
          ...service,
          agent_name: profile?.full_name || 'Anonymous',
          agent_cgpa: service.agents.cgpa,
          agent_rating: 4.8 // Mock rating for now
        });
      }

      setAllServices(servicesWithAgentInfo);
    } catch (error) {
      console.error('Error fetching all services:', error);
      toast({
        title: 'Error',
        description: 'Failed to load services',
        variant: 'destructive',
      });
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
      description: `Connecting you with ${service.agent_name}. Booking system coming soon!`,
    });
  };

  const filteredServices = allServices.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading services...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Student Services
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get help from verified UNILAG agents with excellent academic records
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
            <Settings className="h-4 w-4 mr-2" />
            Browse Services
          </Button>
          {isAgent && (
            <Button
              variant={activeTab === 'my-services' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('my-services')}
              className="rounded-lg px-6"
            >
              <Edit className="h-4 w-4 mr-2" />
              My Services
            </Button>
          )}
        </div>
      </div>

      {/* Browse Services Tab */}
      {activeTab === 'browse' && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Settings className="h-6 w-6 text-primary" />
                <span>Available Services</span>
                <Badge variant="secondary" className="ml-2">
                  {filteredServices.length} services
                </Badge>
              </CardTitle>
              
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Academic Support">Academic Support</SelectItem>
                    <SelectItem value="Tutoring">Tutoring</SelectItem>
                    <SelectItem value="Research">Research</SelectItem>
                    <SelectItem value="Programming">Programming</SelectItem>
                    <SelectItem value="Writing">Writing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {filteredServices.length === 0 ? (
              <div className="text-center py-12">
                <Settings className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  {searchTerm || categoryFilter !== 'all' 
                    ? 'No services match your search' 
                    : 'No services available yet'
                  }
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm || categoryFilter !== 'all'
                    ? 'Try adjusting your search filters'
                    : 'Check back soon for new services!'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredServices.map((service) => (
                  <Card key={service.id} className="group hover:shadow-2xl transition-all duration-300 border hover:border-primary/20">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-3">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                          {service.category}
                        </Badge>
                        <Badge className="bg-success/10 text-success border-success/20">
                          <Award className="h-3 w-3 mr-1" />
                          Verified Agent
                        </Badge>
                      </div>
                      <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">
                        {service.title}
                      </CardTitle>
                      <p className="text-muted-foreground line-clamp-2">{service.description}</p>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Agent Info */}
                      <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-lg">{service.agent_name}</div>
                          <div className="text-sm text-muted-foreground">CGPA: {service.agent_cgpa}</div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-warning text-warning" />
                            <span className="font-semibold">{service.agent_rating}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">(127 reviews)</div>
                        </div>
                      </div>

                      {/* Service Details */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{service.duration}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CreditCard className="h-5 w-5 text-primary" />
                            <span className="font-bold text-lg text-primary">
                              {service.price} credits
                            </span>
                          </div>
                        </div>

                        {/* Requirements */}
                        {service.requirements && (
                          <div className="p-3 bg-muted/20 rounded-lg">
                            <span className="font-medium text-sm">Requirements: </span>
                            <span className="text-sm text-muted-foreground">{service.requirements}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <Button 
                        className="w-full shadow-md group-hover:shadow-lg transition-all" 
                        onClick={() => handleHireAgent(service)}
                        size="lg"
                      >
                        <User className="h-4 w-4 mr-2" />
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
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Edit className="h-6 w-6 text-primary" />
                <span>My Services</span>
                <Badge variant="secondary" className="ml-2">
                  {myServices.length} services
                </Badge>
              </CardTitle>
              <Button onClick={() => setShowForm(true)} className="shadow-md">
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {myServices.length === 0 ? (
              <div className="text-center py-12">
                <Settings className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  No services created yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Create your first service to start helping students and earning credits!
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Service
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myServices.map((service) => (
                  <Card key={service.id} className="border-primary/20 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-2">
                          <h3 className="font-semibold text-lg line-clamp-2">{service.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {service.description}
                          </p>
                        </div>
                        <Badge 
                          variant={service.status === 'active' ? 'default' : 'secondary'}
                        >
                          {service.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xl font-bold text-primary">
                          {service.price} credits
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingService(service);
                            setShowForm(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                        <span>Category: {service.category}</span>
                        <span>Duration: {service.duration}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Enhanced Service Form - Only shown for agents */}
      {showForm && isAgent && (
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
            <CardTitle className="text-xl">
              {editingService ? 'Edit Service' : 'Create New Service'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">Service Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingService?.title}
                    placeholder="e.g., Assignment Help - Data Structures"
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">Category *</Label>
                  <Select name="category" defaultValue={editingService?.category} required>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Academic Support">Academic Support</SelectItem>
                      <SelectItem value="Tutoring">Tutoring</SelectItem>
                      <SelectItem value="Research">Research</SelectItem>
                      <SelectItem value="Programming">Programming</SelectItem>
                      <SelectItem value="Writing">Writing & Editing</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Language">Language Learning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">Service Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingService?.description}
                  placeholder="Describe your service in detail..."
                  className="h-32 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium">Price (Credits) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="1"
                    defaultValue={editingService?.price}
                    placeholder="100"
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-sm font-medium">Duration *</Label>
                  <Input
                    id="duration"
                    name="duration"
                    defaultValue={editingService?.duration}
                    placeholder="e.g., 2-3 hours, 1 week"
                    required
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements" className="text-sm font-medium">Requirements</Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  defaultValue={editingService?.requirements}
                  placeholder="What do you need from the client? (e.g., assignment details, deadlines, materials)"
                  className="h-24 resize-none"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <Button type="submit" className="shadow-md">
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
