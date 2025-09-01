import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Calendar, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { useState } from 'react';

const HeatMap = () => {
  const { t } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeks = Array.from({ length: 8 }, (_, i) => i);
  
  const getRandomIntensity = () => Math.floor(Math.random() * 5);

  const subjects = [
    { id: 'all', name: 'All Subjects' },
    { id: 'math', name: 'Mathematics' },
    { id: 'physics', name: 'Physics' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'biology', name: 'Biology' }
  ];

  const stats = [
    { label: 'Current Streak', value: '7 days', color: 'text-success' },
    { label: 'Longest Streak', value: '14 days', color: 'text-primary' },
    { label: 'Total Study Days', value: '42 days', color: 'text-accent' },
    { label: 'Average Hours/Day', value: '3.2h', color: 'text-warning' }
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Study Activity Heat Map</h1>
        <p className="text-muted-foreground">
          Visualize your study patterns and track your consistency.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4">
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map(subject => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline">
          Export Data
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heat Map */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Study Activity Heat Map
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-7 gap-2">
              {days.map(day => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            
            {weeks.map(week => (
              <div key={week} className="grid grid-cols-7 gap-2">
                {days.map((day, dayIndex) => {
                  const intensity = getRandomIntensity();
                  const opacity = intensity * 0.2;
                  const hours = intensity === 0 ? 0 : Math.floor(Math.random() * 6) + 1;
                  
                  return (
                    <div
                      key={`${week}-${dayIndex}`}
                      className="aspect-square rounded border hover:scale-110 transition-transform cursor-pointer"
                      style={{
                        backgroundColor: `hsl(var(--primary))`,
                        opacity: opacity || 0.1
                      }}
                      title={`${day} - ${hours}h studied`}
                    />
                  );
                })}
              </div>
            ))}
            
            <div className="flex items-center justify-between text-sm text-muted-foreground pt-4">
              <span>Less</span>
              <div className="flex space-x-1">
                {[0, 1, 2, 3, 4].map(level => (
                  <div
                    key={level}
                    className="w-3 h-3 rounded border"
                    style={{
                      backgroundColor: `hsl(var(--primary))`,
                      opacity: level * 0.2 || 0.1
                    }}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </CardContent>
        </Card>

        {/* Stats Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Study Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                  <span className={`font-bold ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, index) => {
                const hours = Math.floor(Math.random() * 5) + 1;
                return (
                  <div key={day} className="flex justify-between items-center">
                    <span className="text-sm">{day}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(hours / 6) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8">{hours}h</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                📈 You're on a 7-day study streak! Keep it up!
              </p>
              <p className="text-sm text-muted-foreground">
                🔥 Your most productive day is Wednesday
              </p>
              <p className="text-sm text-muted-foreground">
                ⏰ Best study time: 2-4 PM
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HeatMap;