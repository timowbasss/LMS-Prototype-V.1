import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Award, Calendar } from "lucide-react"
import { mockCourses, mockGrades } from "@/data/mockData"

const Grades = () => {
  const overallGPA = 3.85
  const semesterGPA = 3.92

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-success text-success-foreground'
    if (grade.startsWith('B')) return 'bg-info text-info-foreground'
    if (grade.startsWith('C')) return 'bg-warning text-warning-foreground'
    return 'bg-muted text-muted-foreground'
  }

  const getGradePoints = (grade: string) => {
    if (grade === 'A+') return 4.0
    if (grade === 'A') return 4.0
    if (grade === 'A-') return 3.7
    if (grade === 'B+') return 3.3
    if (grade === 'B') return 3.0
    return 0
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Grades & Performance</h1>
        <p className="text-muted-foreground">
          Track your academic progress and performance across all courses.
        </p>
      </div>

      {/* GPA Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall GPA</CardTitle>
            <Award className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{overallGPA}</div>
            <p className="text-xs text-muted-foreground">
              Cumulative grade point average
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Semester</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{semesterGPA}</div>
            <p className="text-xs text-success">
              +0.07 from last semester
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credit Hours</CardTitle>
            <Calendar className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">18</div>
            <p className="text-xs text-muted-foreground">
              Current semester load
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Course Grades */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Current Courses</h2>
        
        <div className="grid gap-6">
          {mockCourses.map((course) => (
            <Card key={course.id} className="shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{course.name}</CardTitle>
                    <p className="text-muted-foreground text-sm">{course.instructor}</p>
                  </div>
                  <Badge className={getGradeColor(course.grade)}>
                    {course.grade} ({getGradePoints(course.grade).toFixed(1)})
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Course Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>

                {/* Grade Breakdown */}
                {mockGrades.find(g => g.course === course.name) && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">Recent Assignments</h4>
                    <div className="space-y-2">
                      {mockGrades
                        .find(g => g.course === course.name)
                        ?.assignments.map((assignment, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gradient-subtle rounded-lg border">
                          <div>
                            <p className="font-medium text-sm text-foreground">{assignment.name}</p>
                            <p className="text-xs text-muted-foreground">{assignment.date}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className={getGradeColor(assignment.grade)}>
                              {assignment.grade}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">{assignment.points}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Grades