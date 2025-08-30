import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, TrendingUp, Clock, Award, Target, BookOpen, Calendar, FileText } from 'lucide-react';
import { mockAnalytics } from '@/data/mockData';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

const Analytics = () => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const performanceData = [
    { month: 'Jan', gpa: 3.8, studyHours: 45 },
    { month: 'Feb', gpa: 3.9, studyHours: 52 },
    { month: 'Mar', gpa: 3.7, studyHours: 48 },
    { month: 'Apr', gpa: 4.0, studyHours: 58 },
    { month: 'May', gpa: 3.9, studyHours: 55 }
  ];

  const subjectPerformance = [
    { subject: 'Physics', current: 87, target: 90, trend: '+5%' },
    { subject: 'Calculus', current: 92, target: 95, trend: '+3%' },
    { subject: 'Chemistry', current: 78, target: 85, trend: '+8%' },
    { subject: 'Biology', current: 89, target: 90, trend: '+2%' },
    { subject: 'CS', current: 95, target: 95, trend: '+1%' }
  ];

  const studyHabits = {
    totalHours: 81,
    weeklyAverage: 16.2,
    mostProductiveTime: '2:00 PM - 4:00 PM',
    preferredSubject: 'Computer Science',
    completionRate: 94
  };

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--warning))', 'hsl(var(--info))', 'hsl(var(--success))'];

  const generatePDFReport = async () => {
    if (!reportRef.current) return;
    
    setIsGeneratingPDF(true);
    toast.info('Generating PDF report...');

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        logging: false,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add title page
      pdf.setFontSize(24);
      pdf.text('Student Performance Report', 20, 30);
      pdf.setFontSize(14);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
      pdf.text('Student: John Doe', 20, 55);
      pdf.text('Academic Year: 2023-2024', 20, 65);

      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('student-performance-report.pdf');
      toast.success('PDF report generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF report');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Track your academic progress and performance insights.
          </p>
        </div>
        
        <Button 
          onClick={generatePDFReport}
          disabled={isGeneratingPDF}
          className="bg-gradient-primary hover:opacity-90"
        >
          <Download className="h-4 w-4 mr-2" />
          {isGeneratingPDF ? 'Generating...' : 'Download PDF Report'}
        </Button>
      </div>

      <div ref={reportRef} className="space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-gradient-primary text-white">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overall GPA</p>
                  <p className="text-2xl font-bold text-foreground">3.87</p>
                  <p className="text-xs text-success">+0.2 from last semester</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-gradient-accent text-white">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Study Hours</p>
                  <p className="text-2xl font-bold text-foreground">{studyHabits.totalHours}</p>
                  <p className="text-xs text-info">This month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-warning text-white">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold text-foreground">{studyHabits.completionRate}%</p>
                  <p className="text-xs text-success">+5% improvement</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-info text-white">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Goals Achieved</p>
                  <p className="text-2xl font-bold text-foreground">8/10</p>
                  <p className="text-xs text-warning">2 pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                GPA Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[3.0, 4.0]} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="gpa" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Study Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="studyHours" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Subject Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Subject Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {subjectPerformance.map((subject, index) => (
                <div key={subject.subject} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">{subject.subject}</h4>
                    <div className="flex items-center gap-3">
                      <Badge variant={subject.current >= subject.target ? 'default' : 'secondary'}>
                        {subject.trend}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {subject.current}% / {subject.target}%
                      </span>
                    </div>
                  </div>
                  <Progress value={subject.current} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Study Habits & Grade Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Study Habits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-gradient-subtle">
                  <p className="text-sm text-muted-foreground">Weekly Average</p>
                  <p className="text-xl font-bold text-foreground">{studyHabits.weeklyAverage}h</p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-subtle">
                  <p className="text-sm text-muted-foreground">Best Time</p>
                  <p className="text-sm font-bold text-foreground">{studyHabits.mostProductiveTime}</p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gradient-subtle">
                <p className="text-sm text-muted-foreground">Most Focused Subject</p>
                <p className="text-lg font-bold text-foreground">{studyHabits.preferredSubject}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Grade Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={mockAnalytics.gradeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ grade, count }) => `${grade}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {mockAnalytics.gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Personalized Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-2">Focus Area</h4>
                <p className="text-sm text-muted-foreground">
                  Increase study time for Chemistry to reach your 85% target goal.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-2">Study Schedule</h4>
                <p className="text-sm text-muted-foreground">
                  Your most productive time is 2-4 PM. Schedule important subjects during this window.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-2">Goal Achievement</h4>
                <p className="text-sm text-muted-foreground">
                  You're on track to achieve 8/10 goals this semester. Keep up the great work!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;