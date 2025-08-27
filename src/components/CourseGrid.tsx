import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, FileText } from "lucide-react"
import { mockCourses } from "@/data/mockData"

export function CourseGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {mockCourses.map((course) => (
        <Card key={course.id} className="shadow-soft hover:shadow-medium transition-all duration-200 group">
          <CardHeader className="pb-3">
            <div className={`w-full h-32 rounded-lg ${course.color} mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}>
              <div className="text-center text-white">
                <h3 className="font-bold text-lg">{course.name}</h3>
                <p className="text-sm opacity-90">{course.instructor}</p>
              </div>
            </div>
            <CardTitle className="text-lg font-semibold">{course.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{course.description}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm">
                <span className="text-muted-foreground">Current Grade:</span>
                <span className="font-semibold text-success ml-1">{course.grade}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <FileText className="h-3 w-3" />
                <span>{course.assignments}</span>
              </div>
            </div>

            {course.nextAssignment && (
              <div className="bg-gradient-subtle p-3 rounded-lg border">
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-primary mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {course.nextAssignment}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Due {course.dueDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
              View Course
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}