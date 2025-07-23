import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, User, Star, MessageSquare, Search, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Agent {
  id: string;
  user_id: string;
  cgpa: number;
  tech_skills: string[];
  specializations: string[];
  hourly_rate: number;
  bio: string;
  verification_status: string;
  profiles?: {
    full_name: string;
    email: string;
  } | null;
}

export const EnhancedAgentSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('all');
  const [specializationFilter, setSpecializationFilter] = useState('all');

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .eq('verification_status', 'approved')
        .order('cgpa', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedAgents: Agent[] = (data || []).map(agent => ({
        ...agent,
        profiles: agent.profiles && typeof agent.profiles === 'object' && !('error' in agent.profiles) 
          ? agent.profiles 
          : null
      }));
      
      setAgents(transformedAgents);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast({
        title: 'Error',
        description: 'Failed to load agents',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleHireAgent = async (agentId: string) => {
    try {
      // Create a service booking
      const { error } = await supabase
        .from('service_bookings')
        .insert({
          client_id: user?.id,
          agent_id: agentId,
          status: 'pending',
          credits_amount: 0, // Will be calculated based on service
          requirements: 'Initial consultation'
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Agent hire request sent successfully',
      });
    } catch (error) {
      console.error('Error hiring agent:', error);
      toast({
        title: 'Error',
        description: 'Failed to hire agent',
        variant: 'destructive',
      });
    }
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.bio?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkill = skillFilter === 'all' || agent.tech_skills?.includes(skillFilter);
    const matchesSpecialization = specializationFilter === 'all' || agent.specializations?.includes(specializationFilter);
    
    return matchesSearch && matchesSkill && matchesSpecialization;
  });

  const getAllSkills = () => {
    const skills = new Set<string>();
    agents.forEach(agent => {
      agent.tech_skills?.forEach(skill => skills.add(skill));
    });
    return Array.from(skills);
  };

  const getAllSpecializations = () => {
    const specializations = new Set<string>();
    agents.forEach(agent => {
      agent.specializations?.forEach(spec => specializations.add(spec));
    });
    return Array.from(specializations);
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading agents...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Hire Expert Agents
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Connect with verified UNILAG students who can help you with your academic and technical needs
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-primary" />
            <span>Find Agents</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={skillFilter} onValueChange={setSkillFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by skill" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skills</SelectItem>
                {getAllSkills().map(skill => (
                  <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specializations</SelectItem>
                {getAllSpecializations().map(spec => (
                  <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent) => (
          <Card key={agent.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{agent.profiles?.full_name || 'Anonymous'}</h3>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-muted-foreground">CGPA: {agent.cgpa}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Verified
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {agent.bio || 'No bio available'}
              </p>
              
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Skills:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {agent.tech_skills?.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {agent.tech_skills?.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{agent.tech_skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Specializations:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {agent.specializations?.slice(0, 2).map((spec) => (
                      <Badge key={spec} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                    {agent.specializations?.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{agent.specializations.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="text-lg font-bold text-primary">
                  {agent.hourly_rate} credits/hr
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleHireAgent(agent.id)}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleHireAgent(agent.id)}
                  >
                    Hire Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredAgents.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="text-center py-12">
            <User className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No agents found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search filters or check back later
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
