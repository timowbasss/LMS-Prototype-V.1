import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  BookOpen, 
  Brain, 
  BarChart3, 
  Calendar, 
  MapPin, 
  Coins,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';
import { MindMapComponent } from '@/components/MindMapComponent';
import { StudentPlanner } from '@/components/StudentPlanner';
import { ProgressAnalytics } from '@/components/ProgressAnalytics';
import { DependencyTree } from '@/components/DependencyTree';
import { HeatMapComponent } from '@/components/HeatMapComponent';

interface Assignment {
  id: string;
  title: string;
  description: string;
  max_points: number;
  due_date: string;
  course_id: string;
  courses: {
    name: string;
    instructor: string;
    color: string;
  };
}

interface UserAssignment {
  id: string;
  status: string;
  earned_points: number;
  submitted_at: string | null;
  graded_at: string | null;
}

export default function AssignmentDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [userAssignment, setUserAssignment] = useState<UserAssignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user && id) {
      fetchAssignmentData();
    }
  }, [user, id]);

  const fetchAssignmentData = async () => {
    try {
      // Fetch assignment details
      const { data: assignmentData, error: assignmentError } = await supabase
        .from('assignments')
        .select(`
          *,
          courses (
            name,
            instructor,
            color
          )
        `)
        .eq('id', id)
        .single();

      if (assignmentError) throw assignmentError;
      setAssignment(assignmentData);

      // Fetch user assignment status
      const { data: userAssignmentData, error: userAssignmentError } = await supabase
        .from('user_assignments')
        .select('*')
        .eq('assignment_id', id)
        .eq('user_id', user?.id)
        .maybeSingle();

      if (userAssignmentError && userAssignmentError.code !== 'PGRST116') {
        throw userAssignmentError;
      }

      setUserAssignment(userAssignmentData);
    } catch (error) {
      console.error('Error fetching assignment:', error);
      toast.error('Failed to load assignment');
    } finally {
      setLoading(false);
    }
  };

  const startAssignment = async () => {
    if (!user || !assignment) return;

    try {
      const { error } = await supabase
        .from('user_assignments')
        .upsert({
          user_id: user.id,
          assignment_id: assignment.id,
          status: 'in_progress'
        });

      if (error) throw error;

      setUserAssignment({
        id: crypto.randomUUID(),
        status: 'in_progress',
        earned_points: 0,
        submitted_at: null,
        graded_at: null
      });

      toast.success('Assignment started!');
    } catch (error) {
      console.error('Error starting assignment:', error);
      toast.error('Failed to start assignment');
    }
  };

  const submitAssignment = async () => {
    if (!user || !assignment) return;

    try {
      const earnedPoints = Math.floor(Math.random() * assignment.max_points * 0.3) + 
                          Math.floor(assignment.max_points * 0.7); // Random grade between 70-100%
      
      const { error } = await supabase
        .from('user_assignments')
        .upsert({
          user_id: user.id,
          assignment_id: assignment.id,
          status: 'submitted',
          submitted_at: new Date().toISOString()
        });

      if (error) throw error;

      // Award Ivy Coins
      const coinsEarned = Math.floor(earnedPoints / 10);
      const { data: profileData } = await supabase
        .from('profiles')
        .select('ivy_coins')
        .eq('user_id', user.id)
        .single();

      if (profileData) {
        await supabase
          .from('profiles')
          .update({ ivy_coins: (profileData.ivy_coins || 0) + coinsEarned })
          .eq('user_id', user.id);
      }

      setUserAssignment(prev => prev ? {
        ...prev,
        status: 'submitted',
        submitted_at: new Date().toISOString()
      } : null);

      toast.success(`Assignment submitted! Earned ${coinsEarned} Ivy Coins!`);
    } catch (error) {
      console.error('Error submitting assignment:', error);
      toast.error('Failed to submit assignment');
    }
  };

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/2"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p>Assignment not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'submitted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'graded':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
      case 'graded':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const currentStatus = userAssignment?.status || 'pending';

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{assignment.title}</h1>
          <p className="text-muted-foreground">
            {assignment.courses.name} • {assignment.courses.instructor}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge className={getStatusColor(currentStatus)}>
            {getStatusIcon(currentStatus)}
            {currentStatus}
          </Badge>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="font-bold">{assignment.max_points} points</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assignment Overview</CardTitle>
          <CardDescription>{assignment.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Coins className="h-4 w-4 text-yellow-500" />
                <span>Up to {Math.floor(assignment.max_points / 10)} Ivy Coins</span>
              </div>
            </div>
            <div className="space-x-2">
              {currentStatus === 'pending' && (
                <Button onClick={startAssignment}>Start Assignment</Button>
              )}
              {currentStatus === 'in_progress' && (
                <Button onClick={submitAssignment}>Submit Assignment</Button>
              )}
              {(currentStatus === 'submitted' || currentStatus === 'graded') && (
                <Button disabled>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Completed
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">
            <BookOpen className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="mindmap">
            <Brain className="h-4 w-4 mr-2" />
            Mind Map
          </TabsTrigger>
          <TabsTrigger value="heatmap">
            <BarChart3 className="h-4 w-4 mr-2" />
            Heat Map
          </TabsTrigger>
          <TabsTrigger value="dependency">
            <MapPin className="h-4 w-4 mr-2" />
            Dependencies
          </TabsTrigger>
          <TabsTrigger value="planner">
            <Calendar className="h-4 w-4 mr-2" />
            Planner
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Course Information</h4>
                  <p className="text-sm text-muted-foreground">Course: {assignment.courses.name}</p>
                  <p className="text-sm text-muted-foreground">Instructor: {assignment.courses.instructor}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Assignment Details</h4>
                  <p className="text-sm text-muted-foreground">Max Points: {assignment.max_points}</p>
                  <p className="text-sm text-muted-foreground">Due: {new Date(assignment.due_date).toLocaleString()}</p>
                </div>
              </div>
              {userAssignment?.earned_points && (
                <div>
                  <h4 className="font-semibold mb-2">Your Score</h4>
                  <p className="text-lg font-bold text-green-600">
                    {userAssignment.earned_points}/{assignment.max_points} points
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mindmap">
          <MindMapComponent assignmentId={assignment.id} />
        </TabsContent>

        <TabsContent value="heatmap">
          <HeatMapComponent assignmentId={assignment.id} />
        </TabsContent>

        <TabsContent value="dependency">
          <DependencyTree assignmentId={assignment.id} />
        </TabsContent>

        <TabsContent value="planner">
          <StudentPlanner assignmentId={assignment.id} />
        </TabsContent>

        <TabsContent value="analytics">
          <ProgressAnalytics assignmentId={assignment.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}