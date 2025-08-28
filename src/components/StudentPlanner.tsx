import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Calendar, Clock, Plus, Check, Trash2 } from 'lucide-react';

interface PlannerEntry {
  id: string;
  title: string;
  description: string;
  scheduled_date: string;
  duration_minutes: number;
  completed: boolean;
}

interface StudentPlannerProps {
  assignmentId: string;
}

export const StudentPlanner: React.FC<StudentPlannerProps> = ({ assignmentId }) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<PlannerEntry[]>([]);
  const [newEntry, setNewEntry] = useState({
    title: '',
    description: '',
    scheduled_date: '',
    duration_minutes: 60
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPlannerEntries();
    }
  }, [user, assignmentId]);

  const fetchPlannerEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('planner_entries')
        .select('*')
        .eq('assignment_id', assignmentId)
        .eq('user_id', user?.id)
        .order('scheduled_date');

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching planner entries:', error);
      toast.error('Failed to load planner entries');
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async () => {
    if (!user || !newEntry.title.trim() || !newEntry.scheduled_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('planner_entries')
        .insert({
          user_id: user.id,
          assignment_id: assignmentId,
          title: newEntry.title,
          description: newEntry.description,
          scheduled_date: newEntry.scheduled_date,
          duration_minutes: newEntry.duration_minutes
        })
        .select()
        .single();

      if (error) throw error;

      setEntries([...entries, data]);
      setNewEntry({
        title: '',
        description: '',
        scheduled_date: '',
        duration_minutes: 60
      });
      toast.success('Study session scheduled!');
    } catch (error) {
      console.error('Error creating planner entry:', error);
      toast.error('Failed to create entry');
    }
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('planner_entries')
        .update({ completed: !completed })
        .eq('id', id);

      if (error) throw error;

      setEntries(entries.map(entry =>
        entry.id === id ? { ...entry, completed: !completed } : entry
      ));

      toast.success(completed ? 'Marked as incomplete' : 'Marked as complete');
    } catch (error) {
      console.error('Error updating entry:', error);
      toast.error('Failed to update entry');
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('planner_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEntries(entries.filter(entry => entry.id !== id));
      toast.success('Entry deleted');
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error('Failed to delete entry');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Study Planner</span>
          </CardTitle>
          <CardDescription>
            Schedule and track your study sessions for this assignment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Input
                placeholder="Study session title"
                value={newEntry.title}
                onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
              />
              <Textarea
                placeholder="What will you focus on?"
                value={newEntry.description}
                onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
              />
            </div>
            <div className="space-y-4">
              <Input
                type="datetime-local"
                value={newEntry.scheduled_date}
                onChange={(e) => setNewEntry({ ...newEntry, scheduled_date: e.target.value })}
              />
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <Input
                  type="number"
                  placeholder="Duration (minutes)"
                  value={newEntry.duration_minutes}
                  onChange={(e) => setNewEntry({ ...newEntry, duration_minutes: parseInt(e.target.value) || 60 })}
                />
              </div>
              <Button onClick={createEntry} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Session
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {entries.map((entry) => (
          <Card key={entry.id} className={entry.completed ? 'bg-muted/50' : ''}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className={`font-semibold ${entry.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {entry.title}
                    </h4>
                    <Badge variant={entry.completed ? 'secondary' : 'default'}>
                      {entry.completed ? 'Completed' : 'Pending'}
                    </Badge>
                  </div>
                  {entry.description && (
                    <p className="text-sm text-muted-foreground mb-2">{entry.description}</p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(entry.scheduled_date).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{entry.duration_minutes} minutes</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant={entry.completed ? 'secondary' : 'default'}
                    onClick={() => toggleComplete(entry.id, entry.completed)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteEntry(entry.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {entries.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No study sessions scheduled</h3>
              <p className="text-muted-foreground">
                Create your first study session to start planning your work
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};