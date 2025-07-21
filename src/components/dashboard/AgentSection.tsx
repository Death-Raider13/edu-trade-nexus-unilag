
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
import { Loader2, User, Award, Upload } from 'lucide-react';

interface Agent {
  id: string;
  cgpa: number;
  tech_skills: string[];
  specializations: string[];
  hourly_rate: number;
  bio: string;
  verification_status: string;
  exam_report_url: string;
}

export const AgentSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAgent();
    }
  }, [user]);

  const fetchAgent = async () => {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setAgent(data);
    } catch (error) {
      console.error('Error fetching agent:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const techSkills = (formData.get('tech_skills') as string).split(',').map(s => s.trim());
    const specializations = (formData.get('specializations') as string).split(',').map(s => s.trim());

    const agentData = {
      user_id: user?.id,
      cgpa: parseFloat(formData.get('cgpa') as string),
      tech_skills: techSkills,
      specializations: specializations,
      hourly_rate: parseInt(formData.get('hourly_rate') as string),
      bio: formData.get('bio') as string,
      exam_report_url: formData.get('exam_report_url') as string,
    };

    try {
      if (agent) {
        const { error } = await supabase
          .from('agents')
          .update(agentData)
          .eq('id', agent.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('agents')
          .insert(agentData);
        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: 'Agent application submitted successfully',
      });
      
      fetchAgent();
    } catch (error) {
      console.error('Error saving agent:', error);
      toast({
        title: 'Error',
        description: 'Failed to save agent application',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Agent Profile</span>
          {agent && (
            <Badge
              variant={
                agent.verification_status === 'approved'
                  ? 'default'
                  : agent.verification_status === 'rejected'
                  ? 'destructive'
                  : 'secondary'
              }
            >
              {agent.verification_status}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cgpa">CGPA</Label>
              <Input
                id="cgpa"
                name="cgpa"
                type="number"
                step="0.01"
                min="3.5"
                max="5.0"
                defaultValue={agent?.cgpa}
                placeholder="3.75"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hourly_rate">Hourly Rate (Credits)</Label>
              <Input
                id="hourly_rate"
                name="hourly_rate"
                type="number"
                min="1"
                defaultValue={agent?.hourly_rate}
                placeholder="100"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tech_skills">Tech Skills (comma-separated)</Label>
            <Input
              id="tech_skills"
              name="tech_skills"
              defaultValue={agent?.tech_skills?.join(', ')}
              placeholder="React, Node.js, Python, Data Analysis"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specializations">Specializations (comma-separated)</Label>
            <Input
              id="specializations"
              name="specializations"
              defaultValue={agent?.specializations?.join(', ')}
              placeholder="Web Development, Data Science, Mobile Apps"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              defaultValue={agent?.bio}
              placeholder="Tell us about yourself and your experience..."
              className="h-24"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="exam_report_url">Exam Report URL</Label>
            <Input
              id="exam_report_url"
              name="exam_report_url"
              type="url"
              defaultValue={agent?.exam_report_url}
              placeholder="https://example.com/exam-report.pdf"
              required
            />
          </div>

          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {agent ? 'Update Application' : 'Submit Application'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
