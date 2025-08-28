import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface HeatMapComponentProps {
  assignmentId: string;
}

export const HeatMapComponent: React.FC<HeatMapComponentProps> = ({ assignmentId }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeks = Array.from({ length: 4 }, (_, i) => i);
  
  const getRandomIntensity = () => Math.floor(Math.random() * 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>Study Activity Heat Map</span>
        </CardTitle>
        <CardDescription>
          Visual representation of your study activity over time
        </CardDescription>
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
              return (
                <div
                  key={`${week}-${dayIndex}`}
                  className="aspect-square rounded border"
                  style={{
                    backgroundColor: `hsl(var(--primary))`,
                    opacity: opacity
                  }}
                  title={`${day} - ${intensity} hours studied`}
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
                  opacity: level * 0.2
                }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
};