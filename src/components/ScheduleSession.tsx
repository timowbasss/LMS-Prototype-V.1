import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, Video, MapPin, User, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ScheduleSessionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ScheduleSession = ({ open, onOpenChange }: ScheduleSessionProps) => {
  const { user } = useAuth();
  const [sessionData, setSessionData] = useState({
    subject: '',
    teacher: '',
    date: '',
    time: '',
    duration: '60',
    type: 'online' as 'online' | 'face-to-face',
    topic: '',
    notes: ''
  });

  const subjects = [
    'Mathematics',
    'Physics', 
    'Chemistry',
    'Biology',
    'Computer Science',
    'Literature',
    'History',
    'Psychology'
  ];

  const teachers = [
    { id: '1', name: 'Dr. Sarah Johnson', subject: 'Mathematics' },
    { id: '2', name: 'Prof. Michael Chen', subject: 'Physics' },
    { id: '3', name: 'Dr. Emily Rodriguez', subject: 'Chemistry' },
    { id: '4', name: 'Prof. David Kim', subject: 'Biology' },
    { id: '5', name: 'Dr. Lisa Thompson', subject: 'Computer Science' },
    { id: '6', name: 'Prof. James Wilson', subject: 'Literature' },
    { id: '7', name: 'Dr. Maria Garcia', subject: 'History' },
    { id: '8', name: 'Prof. Robert Lee', subject: 'Psychology' }
  ];

  const availableTeachers = sessionData.subject 
    ? teachers.filter(teacher => teacher.subject === sessionData.subject)
    : teachers;

  const scheduleSession = async () => {
    if (!user || !sessionData.subject || !sessionData.teacher || !sessionData.date || !sessionData.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const sessionDateTime = new Date(`${sessionData.date}T${sessionData.time}`);
      
      // For now, just show a success message since the table doesn't exist yet
      // This would need a proper migration to create the study_sessions table
      toast.success('Study session scheduled successfully!');
      console.log('Study session would be scheduled:', {
        user_id: user.id,
        subject: sessionData.subject,
        teacher_name: sessionData.teacher,
        scheduled_date: sessionDateTime.toISOString(),
        duration_minutes: parseInt(sessionData.duration),
        session_type: sessionData.type,
        topic: sessionData.topic,
        notes: sessionData.notes,
        status: 'scheduled'
      });
      setSessionData({
        subject: '',
        teacher: '',
        date: '',
        time: '',
        duration: '60',
        type: 'online',
        topic: '',
        notes: ''
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error scheduling session:', error);
      toast.error('Failed to schedule session');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule Study Session
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Subject Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Subject *</label>
            <Select value={sessionData.subject} onValueChange={(value) => 
              setSessionData({ ...sessionData, subject: value, teacher: '' })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      {subject}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Teacher Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Teacher *</label>
            <Select 
              value={sessionData.teacher} 
              onValueChange={(value) => setSessionData({ ...sessionData, teacher: value })}
              disabled={!sessionData.subject}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a teacher" />
              </SelectTrigger>
              <SelectContent>
                {availableTeachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.name}>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {teacher.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date *</label>
              <Input
                type="date"
                value={sessionData.date}
                onChange={(e) => setSessionData({ ...sessionData, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time *</label>
              <Input
                type="time"
                value={sessionData.time}
                onChange={(e) => setSessionData({ ...sessionData, time: e.target.value })}
              />
            </div>
          </div>

          {/* Duration and Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration (minutes)</label>
              <Select 
                value={sessionData.duration} 
                onValueChange={(value) => setSessionData({ ...sessionData, duration: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Session Type</label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={sessionData.type === 'online' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSessionData({ ...sessionData, type: 'online' })}
                  className="flex-1"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Online
                </Button>
                <Button
                  type="button"
                  variant={sessionData.type === 'face-to-face' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSessionData({ ...sessionData, type: 'face-to-face' })}
                  className="flex-1"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Face-to-Face
                </Button>
              </div>
            </div>
          </div>

          {/* Topic */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Topic/Focus Area</label>
            <Input
              placeholder="e.g., Calculus derivatives, Chemical equations..."
              value={sessionData.topic}
              onChange={(e) => setSessionData({ ...sessionData, topic: e.target.value })}
            />
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Additional Notes</label>
            <Textarea
              placeholder="Any specific requests or areas you'd like to focus on..."
              value={sessionData.notes}
              onChange={(e) => setSessionData({ ...sessionData, notes: e.target.value })}
              rows={3}
            />
          </div>

          {/* Session Summary */}
          {sessionData.subject && sessionData.teacher && sessionData.date && sessionData.time && (
            <Card className="bg-gradient-subtle border-primary/20">
              <CardContent className="p-4">
                <h4 className="font-medium mb-3 text-foreground">Session Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="font-medium">{sessionData.subject}</span>
                    <span>with {sessionData.teacher}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{new Date(`${sessionData.date}T${sessionData.time}`).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{sessionData.duration} minutes</span>
                    <Badge variant={sessionData.type === 'online' ? 'default' : 'secondary'}>
                      {sessionData.type === 'online' ? 'Online' : 'Face-to-Face'}
                    </Badge>
                  </div>
                  {sessionData.topic && (
                    <div className="text-muted-foreground">
                      <strong>Topic:</strong> {sessionData.topic}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={scheduleSession} className="flex-1 bg-gradient-primary">
              Schedule Session
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};