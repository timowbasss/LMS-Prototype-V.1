import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserCheck, Clock, Video, MapPin, Calendar, Send, Phone, Mail } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { toast } from 'sonner';

interface Instructor {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  phone?: string;
  avatar?: string;
  subjects: string[];
  officeHours: { day: string; time: string; location: string }[];
  availability: 'available' | 'busy' | 'offline';
  rating: number;
  responseTime: string;
}

interface StudySession {
  instructor: string;
  subject: string;
  type: 'online' | 'face-to-face';
  date: string;
  time: string;
  duration: number;
  topic: string;
  notes: string;
}

const ContactInstructor = () => {
  const { t } = useLanguage();
  const [selectedInstructor, setSelectedInstructor] = useState<string>('');
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  
  const [studySession, setStudySession] = useState<StudySession>({
    instructor: '',
    subject: '',
    type: 'online',
    date: '',
    time: '',
    duration: 60,
    topic: '',
    notes: ''
  });

  const [message, setMessage] = useState({
    instructor: '',
    subject: '',
    content: '',
    priority: 'medium'
  });

  const instructors: Instructor[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      title: 'Professor of Physics',
      department: 'Physics Department',
      email: 'sarah.johnson@university.edu',
      phone: '+1 (555) 123-4567',
      subjects: ['Physics 101', 'Advanced Mechanics', 'Quantum Physics'],
      officeHours: [
        { day: 'Monday', time: '2:00 PM - 4:00 PM', location: 'Physics Building, Room 302' },
        { day: 'Wednesday', time: '10:00 AM - 12:00 PM', location: 'Physics Building, Room 302' },
        { day: 'Friday', time: '1:00 PM - 3:00 PM', location: 'Physics Building, Room 302' }
      ],
      availability: 'available',
      rating: 4.8,
      responseTime: '2-4 hours'
    },
    {
      id: '2',
      name: 'Prof. Michael Chen',
      title: 'Associate Professor of Mathematics',
      department: 'Mathematics Department',
      email: 'michael.chen@university.edu',
      phone: '+1 (555) 234-5678',
      subjects: ['Calculus I', 'Calculus II', 'Linear Algebra', 'Statistics'],
      officeHours: [
        { day: 'Tuesday', time: '11:00 AM - 1:00 PM', location: 'Math Building, Room 205' },
        { day: 'Thursday', time: '3:00 PM - 5:00 PM', location: 'Math Building, Room 205' }
      ],
      availability: 'busy',
      rating: 4.6,
      responseTime: '4-6 hours'
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      title: 'Assistant Professor of Chemistry',
      department: 'Chemistry Department',
      email: 'emily.rodriguez@university.edu',
      subjects: ['General Chemistry', 'Organic Chemistry', 'Biochemistry'],
      officeHours: [
        { day: 'Monday', time: '9:00 AM - 11:00 AM', location: 'Chemistry Building, Room 150' },
        { day: 'Wednesday', time: '2:00 PM - 4:00 PM', location: 'Chemistry Building, Room 150' }
      ],
      availability: 'available',
      rating: 4.9,
      responseTime: '1-2 hours'
    }
  ];

  const scheduleStudySession = () => {
    if (!studySession.instructor || !studySession.subject || !studySession.date || !studySession.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success('Study session scheduled successfully!');
    setStudySession({
      instructor: '',
      subject: '',
      type: 'online',
      date: '',
      time: '',
      duration: 60,
      topic: '',
      notes: ''
    });
    setShowScheduleDialog(false);
  };

  const sendMessage = () => {
    if (!message.instructor || !message.subject || !message.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success('Message sent successfully!');
    setMessage({
      instructor: '',
      subject: '',
      content: '',
      priority: 'medium'
    });
    setShowMessageDialog(false);
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'text-success';
      case 'busy': return 'text-warning';
      case 'offline': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available': return 'Available';
      case 'busy': return 'Busy';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Contact Instructor</h1>
        <p className="text-muted-foreground">
          Schedule study sessions, ask questions, and get help from your instructors.
        </p>
      </div>

      <div className="flex gap-4">
        <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Study Session
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Schedule Study Session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Select value={studySession.instructor} onValueChange={(value) => setStudySession({ ...studySession, instructor: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select instructor" />
                </SelectTrigger>
                <SelectContent>
                  {instructors.map(instructor => (
                    <SelectItem key={instructor.id} value={instructor.id}>
                      {instructor.name} - {instructor.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={studySession.subject} onValueChange={(value) => setStudySession({ ...studySession, subject: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {instructors.find(i => i.id === studySession.instructor)?.subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  )) || <SelectItem value="" disabled>Select an instructor first</SelectItem>}
                </SelectContent>
              </Select>

              <Select value={studySession.type} onValueChange={(value: any) => setStudySession({ ...studySession, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Session type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Online Session
                    </div>
                  </SelectItem>
                  <SelectItem value="face-to-face">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Face-to-Face
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <Input
                    type="date"
                    value={studySession.date}
                    onChange={(e) => setStudySession({ ...studySession, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Time</label>
                  <Input
                    type="time"
                    value={studySession.time}
                    onChange={(e) => setStudySession({ ...studySession, time: e.target.value })}
                  />
                </div>
              </div>

              <Input
                placeholder="Topic (optional)"
                value={studySession.topic}
                onChange={(e) => setStudySession({ ...studySession, topic: e.target.value })}
              />

              <Textarea
                placeholder="Additional notes (optional)"
                value={studySession.notes}
                onChange={(e) => setStudySession({ ...studySession, notes: e.target.value })}
                rows={3}
              />

              <Button onClick={scheduleStudySession} className="w-full">
                Schedule Session
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Send Message</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Select value={message.instructor} onValueChange={(value) => setMessage({ ...message, instructor: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select instructor" />
                </SelectTrigger>
                <SelectContent>
                  {instructors.map(instructor => (
                    <SelectItem key={instructor.id} value={instructor.id}>
                      {instructor.name} - {instructor.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Subject"
                value={message.subject}
                onChange={(e) => setMessage({ ...message, subject: e.target.value })}
              />

              <Textarea
                placeholder="Your message"
                value={message.content}
                onChange={(e) => setMessage({ ...message, content: e.target.value })}
                rows={6}
              />

              <Button onClick={sendMessage} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {instructors.map(instructor => (
          <Card key={instructor.id} className="hover:shadow-medium transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={instructor.avatar} />
                  <AvatarFallback>{instructor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{instructor.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{instructor.title}</p>
                  <Badge variant="outline" className="mt-1">
                    {instructor.department}
                  </Badge>
                </div>
                <div className={`text-sm font-medium ${getAvailabilityColor(instructor.availability)}`}>
                  {getAvailabilityText(instructor.availability)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Contact Information</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    <span>{instructor.email}</span>
                  </div>
                  {instructor.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      <span>{instructor.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Subjects</h4>
                <div className="flex flex-wrap gap-1">
                  {instructor.subjects.map(subject => (
                    <Badge key={subject} variant="secondary" className="text-xs">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Office Hours</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  {instructor.officeHours.map((hour, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{hour.day}: {hour.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Response time:</span>
                <span className="font-medium">{instructor.responseTime}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Rating:</span>
                <div className="flex items-center gap-1">
                  <span className="font-medium">{instructor.rating}</span>
                  <span className="text-warning">★★★★★</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    setStudySession({ ...studySession, instructor: instructor.id });
                    setShowScheduleDialog(true);
                  }}
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  Schedule
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setMessage({ ...message, instructor: instructor.id });
                    setShowMessageDialog(true);
                  }}
                >
                  <Send className="h-3 w-3 mr-1" />
                  Message
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContactInstructor;