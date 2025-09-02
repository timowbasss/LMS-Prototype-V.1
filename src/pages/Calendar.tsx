import { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, Plus, Edit3, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/components/LanguageProvider';
import { toast } from 'sonner';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Calendar theme styles
const calendarStyles = `
  .rbc-calendar {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
  }
  .rbc-header {
    background-color: hsl(var(--muted));
    color: hsl(var(--muted-foreground));
    border-bottom: 1px solid hsl(var(--border));
    padding: 0.5rem;
    font-weight: 600;
  }
  .rbc-month-view, .rbc-time-view {
    border: 1px solid hsl(var(--border));
    background-color: hsl(var(--card));
  }
  .rbc-date-cell {
    color: hsl(var(--muted-foreground));
  }
  .rbc-date-cell > a {
    color: hsl(var(--foreground));
  }
  .rbc-today {
    background-color: hsl(var(--primary) / 0.1);
  }
  .rbc-off-range {
    color: hsl(var(--muted-foreground) / 0.5);
  }
  .rbc-current-time-indicator {
    background-color: hsl(var(--primary));
  }
  .rbc-time-slot {
    border-top: 1px solid hsl(var(--border));
  }
  .rbc-time-gutter .rbc-timeslot-group {
    border-bottom: 1px solid hsl(var(--border));
  }
  .rbc-time-header > .rbc-row {
    border-bottom: 1px solid hsl(var(--border));
  }
  .rbc-toolbar {
    background-color: hsl(var(--background));
    border-bottom: 1px solid hsl(var(--border));
    padding: 1rem;
  }
  .rbc-toolbar button {
    background-color: hsl(var(--secondary));
    color: hsl(var(--secondary-foreground));
    border: 1px solid hsl(var(--border));
    padding: 0.5rem 1rem;
    margin: 0 0.25rem;
    border-radius: 0.375rem;
    font-weight: 500;
  }
  .rbc-toolbar button:hover {
    background-color: hsl(var(--secondary) / 0.8);
  }
  .rbc-toolbar button.rbc-active {
    background-color: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
  }
`;

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'study' | 'school' | 'assignment';
  description?: string;
  location?: string;
}

interface StudySession {
  id: string;
  title: string;
  description: string;
  scheduled_date: string;
  duration_minutes: number;
  completed: boolean;
}

const Calendar = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    type: 'study' as const,
    location: ''
  });

  useEffect(() => {
    if (user) {
      fetchStudySessions();
      fetchSchoolEvents();
    }
  }, [user]);

  const fetchStudySessions = async () => {
    try {
      const { data, error } = await supabase
        .from('planner_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('scheduled_date');

      if (error) throw error;
      
      setStudySessions(data || []);
      
      const studyEvents: CalendarEvent[] = (data || []).map(session => ({
        id: session.id,
        title: session.title,
        start: new Date(session.scheduled_date),
        end: new Date(new Date(session.scheduled_date).getTime() + session.duration_minutes * 60000),
        type: 'study',
        description: session.description
      }));

      setEvents(prev => [...prev.filter(e => e.type !== 'study'), ...studyEvents]);
    } catch (error) {
      console.error('Error fetching study sessions:', error);
    }
  };

  const fetchSchoolEvents = async () => {
    // Mock school events with more realistic dates
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 15);
    
    const schoolEvents: CalendarEvent[] = [
      {
        id: 'school-1',
        title: 'National Egypt Day',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
        type: 'school',
        description: 'National holiday - No classes'
      },
      {
        id: 'school-2', 
        title: 'Final Exams Week',
        start: nextWeek,
        end: new Date(nextWeek.getTime() + 5 * 24 * 60 * 60 * 1000),
        type: 'assignment',
        description: 'Final examination period for all subjects'
      },
      {
        id: 'school-3',
        title: 'Science Fair',
        start: nextMonth,
        end: nextMonth,
        type: 'school',
        description: 'Annual Science Fair - Main Gymnasium',
        location: 'Main Gymnasium'
      },
      {
        id: 'school-4',
        title: 'Parent-Teacher Conference',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
        type: 'school',
        description: 'Meet with teachers to discuss student progress'
      }
    ];

    setEvents(prev => [...prev.filter(e => e.type !== 'school' && e.type !== 'assignment'), ...schoolEvents]);
  };

  const createStudySession = async () => {
    if (!user || !newEvent.title.trim() || !newEvent.start || !newEvent.end) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const startDate = new Date(newEvent.start);
      const endDate = new Date(newEvent.end);
      const durationMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60000);

      const { data, error } = await supabase
        .from('planner_entries')
        .insert({
          user_id: user.id,
          title: newEvent.title,
          description: newEvent.description,
          scheduled_date: startDate.toISOString(),
          duration_minutes: durationMinutes
        })
        .select()
        .single();

      if (error) throw error;

      const newCalendarEvent: CalendarEvent = {
        id: data.id,
        title: data.title,
        start: startDate,
        end: endDate,
        type: 'study',
        description: data.description
      };

      setEvents(prev => [...prev, newCalendarEvent]);
      setNewEvent({
        title: '',
        description: '',
        start: '',
        end: '',
        type: 'study',
        location: ''
      });
      setShowCreateDialog(false);
      toast.success('Study session scheduled!');
    } catch (error) {
      console.error('Error creating study session:', error);
      toast.error('Failed to create study session');
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('planner_entries')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      setEvents(prev => prev.filter(e => e.id !== eventId));
      setSelectedEvent(null);
      toast.success('Event deleted');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '';
    switch (event.type) {
      case 'study':
        backgroundColor = 'hsl(var(--primary))';
        break;
      case 'school':
        backgroundColor = 'hsl(var(--accent))';
        break;
      case 'assignment':
        backgroundColor = 'hsl(var(--warning))';
        break;
    }
    
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  return (
    <div className="space-y-8">
      <style>{calendarStyles}</style>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">{t ? t('calendar.title') : 'Calendar'}</h1>
          <p className="text-muted-foreground">
            {t ? t('calendar.subtitle') : 'Manage your study sessions and view upcoming school events.'}
          </p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              New Study Session
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Study Session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Session title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
              <Textarea
                placeholder="Description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Start Time</label>
                  <Input
                    type="datetime-local"
                    value={newEvent.start}
                    onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">End Time</label>
                  <Input
                    type="datetime-local"
                    value={newEvent.end}
                    onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={createStudySession} className="w-full">
                Create Session
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-3">
          <CardContent className="p-6">
            <div style={{ height: '600px' }}>
              <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                view={view}
                onView={setView}
                date={date}
                onNavigate={setDate}
                eventPropGetter={eventStyleGetter}
                onSelectEvent={setSelectedEvent}
                className="bg-background text-foreground"
              />
            </div>
          </CardContent>
        </Card>

        {/* Event Details */}
        <div className="space-y-6">
          {selectedEvent && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Event Details
                  </span>
                  {selectedEvent.type === 'study' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteEvent(selectedEvent.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground">{selectedEvent.title}</h3>
                  <Badge variant={selectedEvent.type === 'study' ? 'default' : 'secondary'} className="mt-1">
                    {selectedEvent.type === 'study' ? 'Study Session' : 'School Event'}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    {moment(selectedEvent.start).format('MMM DD, YYYY HH:mm')} - 
                    {moment(selectedEvent.end).format('HH:mm')}
                  </span>
                </div>

                {selectedEvent.description && (
                  <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
                )}

                {selectedEvent.location && (
                  <p className="text-sm text-muted-foreground">
                    <strong>Location:</strong> {selectedEvent.location}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setShowCreateDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Schedule Study Time
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Schedule
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {events
                .filter(e => e.start > new Date())
                .slice(0, 3)
                .map(event => (
                  <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-subtle">
                    <div className={`w-3 h-3 rounded-full ${
                      event.type === 'study' ? 'bg-primary' : 
                      event.type === 'school' ? 'bg-accent' : 'bg-warning'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {moment(event.start).format('MMM DD, HH:mm')}
                      </p>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar;