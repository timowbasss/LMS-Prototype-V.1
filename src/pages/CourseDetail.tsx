import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  BookOpen, 
  Calendar, 
  FileText, 
  BarChart3, 
  Brain, 
  GitBranch, 
  Thermometer,
  Video,
  Users,
  MessageSquare,
  Clock,
  Target,
  TrendingUp
} from 'lucide-react';
import { mockCourses, mockAssignments, mockGrades } from '@/data/mockData';
import { MindMapComponent } from '@/components/MindMapComponent';
import { HeatMapComponent } from '@/components/HeatMapComponent';
import { DependencyTree } from '@/components/DependencyTree';
import { ProgressAnalytics } from '@/components/ProgressAnalytics';
import { StudentPlanner } from '@/components/StudentPlanner';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface StudySession {
  id: string;
  type: 'face-to-face' | 'online';
  date: string;
  time: string;
  topic: string;
  notes: string;
}

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('assignments');
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [newSession, setNewSession] = useState<Partial<StudySession>>({
    type: 'online',
    date: '',
    time: '',
    topic: '',
    notes: ''
  });

  const course = mockCourses.find(c => c.id === courseId);
  const courseAssignments = mockAssignments.filter(a => a.course === course?.name);
  const courseGrades = mockGrades.find(g => g.course === course?.name);

  useEffect(() => {
    if (!course) {
      navigate('/courses');
    }
  }, [course, navigate]);

  if (!course) {
    return null;
  }

  const handleScheduleSession = () => {
    if (!newSession.date || !newSession.time || !newSession.topic) {
      toast.error('Please fill in all required fields');
      return;
    }

    // In a real app, this would save to the database
    toast.success(`Study session scheduled for ${newSession.date} at ${newSession.time}`);
    setShowSessionDialog(false);
    setNewSession({
      type: 'online',
      date: '',
      time: '',
      topic: '',
      notes: ''
    });
  };

  const syllabus = {
    description: course.description,
    objectives: [
      'Understand fundamental concepts and principles',
      'Apply theoretical knowledge to practical problems',
      'Develop critical thinking and analytical skills',
      'Demonstrate proficiency in subject-specific techniques'
    ],
    topics: [
      'Introduction and Fundamentals',
      'Core Concepts and Theory',
      'Advanced Applications',
      'Research Methods',
      'Final Project and Presentation'
    ],
    gradingPolicy: {
      assignments: '40%',
      midterm: '25%',
      final: '25%',
      participation: '10%'
    },
    schedule: [
      { week: 'Week 1-3', topic: 'Fundamentals' },
      { week: 'Week 4-6', topic: 'Core Theory' },
      { week: 'Week 7-9', topic: 'Applications' },
      { week: 'Week 10-12', topic: 'Advanced Topics' },
      { week: 'Week 13-15', topic: 'Projects & Review' }
    ]
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/courses')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg ${course.color} flex items-center justify-center`}>
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{course.name}</h1>
              <p className="text-muted-foreground">{course.instructor}</p>
            </div>
            <div className="ml-auto">
              <Badge variant="secondary" className="bg-success text-success-foreground">
                {course.grade}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-foreground mb-2">Course Progress</h3>
              <Progress value={course.progress} className="h-2 mb-2" />
              <p className="text-sm text-muted-foreground">{course.progress}% Complete</p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">Assignments</h3>
              <p className="text-2xl font-bold text-foreground">{courseAssignments.length}</p>
              <p className="text-sm text-muted-foreground">Total assignments</p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">Next Due</h3>
              <p className="text-sm font-medium text-foreground">{course.nextAssignment}</p>
              <p className="text-sm text-muted-foreground">{course.dueDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Assignments
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="mindmap" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Mind Map
          </TabsTrigger>
          <TabsTrigger value="heatmap" className="flex items-center gap-2">
            <Thermometer className="h-4 w-4" />
            Heat Map
          </TabsTrigger>
          <TabsTrigger value="dependency" className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            Dependency Tree
          </TabsTrigger>
          <TabsTrigger value="syllabus" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Syllabus
          </TabsTrigger>
        </TabsList>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Course Assignments</h3>
              {courseAssignments.map((assignment) => (
                <Card key={assignment.id} className="hover:shadow-medium transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{assignment.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">Due: {assignment.dueDate}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={assignment.status === 'graded' ? 'default' : 'secondary'}>
                            {assignment.status}
                          </Badge>
                          {assignment.grade && (
                            <Badge variant="outline">{assignment.grade}</Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {assignment.earnedPoints ? `${assignment.earnedPoints}/` : ''}{assignment.maxPoints} pts
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-6">
              {/* Study Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Study Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Dialog open={showSessionDialog} onOpenChange={setShowSessionDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full" variant="outline">
                        <Video className="h-4 w-4 mr-2" />
                        Schedule with Teacher
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Schedule Study Session</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Session Type</label>
                          <Select 
                            value={newSession.type} 
                            onValueChange={(value: 'face-to-face' | 'online') => 
                              setNewSession({ ...newSession, type: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select session type" />
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
                                  <Users className="h-4 w-4" />
                                  Face-to-Face
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Date</label>
                            <input
                              type="date"
                              className="w-full p-2 border border-border rounded-md"
                              value={newSession.date}
                              onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Time</label>
                            <input
                              type="time"
                              className="w-full p-2 border border-border rounded-md"
                              value={newSession.time}
                              onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium">Topic</label>
                          <input
                            type="text"
                            placeholder="What would you like to discuss?"
                            className="w-full p-2 border border-border rounded-md"
                            value={newSession.topic}
                            onChange={(e) => setNewSession({ ...newSession, topic: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium">Additional Notes</label>
                          <Textarea
                            placeholder="Any specific questions or areas of focus?"
                            value={newSession.notes}
                            onChange={(e) => setNewSession({ ...newSession, notes: e.target.value })}
                          />
                        </div>

                        <Button onClick={handleScheduleSession} className="w-full">
                          Schedule Session
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/grades')}
                  >
                    View Gradebook
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('analytics')}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('mindmap')}>
                    <Brain className="h-4 w-4 mr-2" />
                    Open Mind Map
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('heatmap')}>
                    <Thermometer className="h-4 w-4 mr-2" />
                    Open Heat Map
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('dependency')}>
                    <GitBranch className="h-4 w-4 mr-2" />
                    Open Dependency Tree
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/messages')}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message Teacher
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Course Analytics
                </CardTitle>
                <CardDescription>
                  Detailed performance analytics for {course.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold">Time Invested</h3>
                    </div>
                    <p className="text-2xl font-bold text-primary">24.5h</p>
                    <p className="text-sm text-muted-foreground">Total study time</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-success" />
                      <h3 className="font-semibold">Performance</h3>
                    </div>
                    <p className="text-2xl font-bold text-success">{course.grade}</p>
                    <p className="text-sm text-muted-foreground">Current grade</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-info" />
                      <h3 className="font-semibold">Assignments</h3>
                    </div>
                    <p className="text-2xl font-bold text-info">{courseAssignments.length}</p>
                    <p className="text-sm text-muted-foreground">Total assignments</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-warning" />
                      <h3 className="font-semibold">Progress</h3>
                    </div>
                    <p className="text-2xl font-bold text-warning">{course.progress}%</p>
                    <p className="text-sm text-muted-foreground">Course completion</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <ProgressAnalytics assignmentId={courseId || 'default'} />
          </div>
        </TabsContent>

        {/* Mind Map Tab */}
        <TabsContent value="mindmap">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Course Mind Map
                </CardTitle>
                <CardDescription>
                  Create visual mind maps to organize course concepts and topics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4">
                    Use mind maps to connect ideas, plan your studies, and visualize course relationships.
                  </p>
                  <Button 
                    className="bg-gradient-primary hover:opacity-90"
                    onClick={() => navigate('/mindmap')}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Open Full Mind Map Tool
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <MindMapComponent assignmentId={`course-${courseId}`} />
          </div>
        </TabsContent>

        {/* Heat Map Tab */}
        <TabsContent value="heatmap">
          <HeatMapComponent assignmentId={courseId || 'default'} />
        </TabsContent>

        {/* Dependency Tree Tab */}
        <TabsContent value="dependency">
          <DependencyTree assignmentId={courseId || 'default'} />
        </TabsContent>

        {/* Syllabus Tab */}
        <TabsContent value="syllabus" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Syllabus</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Course Description</h3>
                <p className="text-muted-foreground">{syllabus.description}</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3">Learning Objectives</h3>
                <ul className="space-y-2">
                  {syllabus.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Course Topics</h3>
                  <div className="space-y-2">
                    {syllabus.topics.map((topic, index) => (
                      <div key={index} className="p-3 rounded-lg bg-gradient-subtle">
                        <span className="text-sm font-medium text-foreground">{index + 1}. {topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3">Grading Policy</h3>
                  <div className="space-y-3">
                    {Object.entries(syllabus.gradingPolicy).map(([category, percentage]) => (
                      <div key={category} className="flex justify-between items-center p-3 rounded-lg bg-gradient-subtle">
                        <span className="font-medium text-foreground capitalize">{category}</span>
                        <Badge variant="secondary">{percentage}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3">Course Schedule</h3>
                <div className="space-y-2">
                  {syllabus.schedule.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gradient-subtle">
                      <span className="font-medium text-foreground">{item.week}</span>
                      <span className="text-muted-foreground">{item.topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseDetail;