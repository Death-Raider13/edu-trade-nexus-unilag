import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Clock, Users, Search, GraduationCap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  duration: string;
  agent_id: string;
  agent?: {
    user_id: string;
    cgpa: number;
    tech_skills: string[];
    specializations: string[];
    verification_status: string;
  };
  profile?: {
    full_name: string;
    avatar_url?: string;
  };
}

export const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const categories = [
    'all',
    'academic_writing',
    'tutoring',
    'research',
    'programming',
    'design',
    'consultation'
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      // First get services with agents
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select(`
          *,
          agents!inner(
            user_id,
            cgpa,
            tech_skills,
            specializations,
            verification_status
          )
        `)
        .eq('status', 'active')
        .eq('agents.verification_status', 'approved');

      if (servicesError) throw servicesError;

      // Then get profiles for each agent
      const servicesWithProfiles = await Promise.all(
        (servicesData || []).map(async (service) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', service.agents.user_id)
            .single();

          return {
            ...service,
            agent: service.agents,
            profile: profileData
          };
        })
      );
      
      setServices(servicesWithProfiles);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = (serviceId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book a service",
        variant: "destructive",
      });
      return;
    }
    navigate(`/dashboard?tab=book-service&service=${serviceId}`);
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Academic Services</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with verified student experts for academic assistance
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge variant="outline" className="mb-2">
                    {service.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                  <Badge variant="secondary">
                    ₦{service.price}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {service.description}
                </p>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <GraduationCap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{service.profile?.full_name}</p>
                    <p className="text-xs text-muted-foreground">CGPA: {service.agent?.cgpa}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {service.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current text-yellow-500" />
                    4.8
                  </div>
                </div>

                <Button 
                  onClick={() => handleBookService(service.id)}
                  className="w-full"
                >
                  Book Service
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No services found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};