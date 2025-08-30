import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Clock, FileText, Calendar } from "lucide-react"
import { mockCourses } from "@/data/mockData"

const Courses = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">My Courses</h1>
        <p className="text-muted-foreground">
          Manage your enrolled courses and track your progress.
        </p>
      </div>

      <div className="grid gap-6">
        {mockCourses.map((course) => (
          <Card key={course.id} className="shadow-soft hover:shadow-medium transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                {/* Course Icon */}
                <div className={`w-16 h-16 rounded-xl ${course.color} flex items-center justify-center flex-shrink-0`}>
                  <BookOpen className="w-8 h-8 text-white" />
                </div>

                {/* Course Details */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{course.name}</h3>
                      <p className="text-muted-foreground">{course.instructor}</p>
                      <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
                    </div>
                    <Badge variant="secondary" className="bg-success text-success-foreground">
                      {course.grade}
                    </Badge>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Course Progress</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>

                  {/* Course Stats */}
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>{course.assignments} assignments</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>24 students</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>3 hrs/week</span>
                    </div>
                  </div>

                  {/* Next Assignment */}
                  {course.nextAssignment && (
                    <div className="bg-gradient-subtle p-4 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <div>
                            <p className="font-medium text-foreground">{course.nextAssignment}</p>
                            <p className="text-xs text-muted-foreground">Due {course.dueDate}</p>
                          </div>
                        </div>
                        <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                          View Assignment
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button 
                      className="bg-gradient-primary hover:opacity-90"
                      onClick={() => window.location.href = `/course/${course.id}`}
                    >
                      Enter Course
                    </Button>
                    <Button variant="outline" className="bg-gradient-subtle">
                      View Grades
                    </Button>
                    <Button variant="outline" className="bg-gradient-subtle">
                      Syllabus
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Courses