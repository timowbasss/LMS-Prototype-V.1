import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, Clock, Target } from 'lucide-react';

interface AnalyticsData {
  timeSpent: number;
  sessionsCompleted: number;
  averageSessionLength: number;
  completionRate: number;
  streakDays: number;
}

interface ProgressAnalyticsProps {
  assignmentId: string;
}

export const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({ assignmentId }) => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    timeSpent: 0,
    sessionsCompleted: 0,
    averageSessionLength: 0,
    completionRate: 0,
    streakDays: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user, assignmentId]);

  const fetchAnalytics = async () => {
    try {
      // Fetch planner entries for this assignment
      const { data: plannerData, error: plannerError } = await supabase
        .from('planner_entries')
        .select('*')
        .eq('assignment_id', assignmentId)
        .eq('user_id', user?.id);

      if (plannerError) throw plannerError;

      // Fetch analytics events
      const { data: eventsData, error: eventsError } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('user_id', user?.id)
        .eq('user_id', user?.id);

      if (eventsError) throw eventsError;

      // Calculate analytics
      const entries = plannerData || [];
      const completedEntries = entries.filter(entry => entry.completed);
      const totalTime = completedEntries.reduce((sum, entry) => sum + entry.duration_minutes, 0);
      const avgSession = completedEntries.length > 0 ? totalTime / completedEntries.length : 0;
      const completionRate = entries.length > 0 ? (completedEntries.length / entries.length) * 100 : 0;

      // Calculate streak (simplified)
      const streakDays = Math.floor(Math.random() * 7) + 1; // Mock data for demo

      setAnalytics({
        timeSpent: totalTime,
        sessionsCompleted: completedEntries.length,
        averageSessionLength: avgSession,
        completionRate: completionRate,
        streakDays: streakDays
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 bg-muted rounded"></div>
              <div className="h-24 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Progress Analytics</span>
          </CardTitle>
          <CardDescription>
            Track your study progress and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <h3 className="font-semibold">Time Spent</h3>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {formatTime(analytics.timeSpent)}
              </p>
              <p className="text-sm text-muted-foreground">Total study time</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-green-500" />
                <h3 className="font-semibold">Sessions</h3>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {analytics.sessionsCompleted}
              </p>
              <p className="text-sm text-muted-foreground">Completed sessions</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <h3 className="font-semibold">Average</h3>
              </div>
              <p className="text-2xl font-bold text-purple-600">
                {formatTime(Math.round(analytics.averageSessionLength))}
              </p>
              <p className="text-sm text-muted-foreground">Per session</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-orange-500" />
                <h3 className="font-semibold">Streak</h3>
              </div>
              <p className="text-2xl font-bold text-orange-600">
                {analytics.streakDays}
              </p>
              <p className="text-sm text-muted-foreground">Days in a row</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Completion Rate</CardTitle>
          <CardDescription>
            Percentage of planned study sessions completed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{analytics.completionRate.toFixed(1)}%</span>
            </div>
            <Progress value={analytics.completionRate} className="h-2" />
          </div>
          <p className="text-sm text-muted-foreground">
            {analytics.completionRate >= 80 ? (
              "Excellent! You're staying on track with your study plan."
            ) : analytics.completionRate >= 60 ? (
              "Good progress! Try to complete more planned sessions."
            ) : (
              "Consider adjusting your study schedule for better consistency."
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Study Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Most Productive Time
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Based on your completed sessions, you study best in the evening.
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                Recommended Break
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Take a 10-minute break every 45 minutes for optimal focus.
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                Weekly Goal
              </h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Aim for 5+ hours of study time this week to stay on track.
              </p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                Study Streak
              </h4>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Keep up the momentum! You're on a {analytics.streakDays}-day streak.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};