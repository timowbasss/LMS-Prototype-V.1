import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, FileText, AlertCircle } from "lucide-react"
import { mockAssignments } from "@/data/mockData"
import { useNavigate } from "react-router-dom"

const Assignments = () => {
  const navigate = useNavigate()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-warning text-warning-foreground'
      case 'submitted':
        return 'bg-info text-info-foreground'
      case 'graded':
        return 'bg-success text-success-foreground'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getDaysUntilDue = (dateString: string) => {
    const dueDate = new Date(dateString)
    const today = new Date()
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const pendingAssignments = mockAssignments.filter(a => a.status === 'pending')
  const completedAssignments = mockAssignments.filter(a => a.status !== 'pending')

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Assignments</h1>
        <p className="text-muted-foreground">
          Stay on top of your coursework and track assignment progress.
        </p>
      </div>

      {/* Pending Assignments */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-warning" />
            Pending Assignments ({pendingAssignments.length})
          </h2>
        </div>

        <div className="grid gap-4">
          {pendingAssignments.map((assignment) => {
            const daysUntilDue = getDaysUntilDue(assignment.dueDate)
            const isUrgent = daysUntilDue <= 3

            return (
              <Card key={assignment.id} className={`shadow-soft hover:shadow-medium transition-shadow duration-200 ${isUrgent ? 'border-warning bg-gradient-to-r from-warning/5 to-transparent' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{assignment.title}</h3>
                          <p className="text-muted-foreground">{assignment.course}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Due {formatDate(assignment.dueDate)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className={`font-medium ${isUrgent ? 'text-warning' : 'text-muted-foreground'}`}>
                            {daysUntilDue === 0 ? 'Due today' : 
                             daysUntilDue === 1 ? 'Due tomorrow' : 
                             `${daysUntilDue} days left`}
                          </span>
                        </div>
                        <div className="text-muted-foreground">
                          Max points: {assignment.maxPoints}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(assignment.status)}>
                        {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                      </Badge>
                      <Button 
                        className="bg-gradient-primary hover:opacity-90"
                        onClick={() => navigate('/assignment-demo')}
                      >
                        Start Assignment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Completed Assignments */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Recent Submissions</h2>

        <div className="grid gap-4">
          {completedAssignments.map((assignment) => (
            <Card key={assignment.id} className="shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{assignment.title}</h3>
                        <p className="text-muted-foreground">{assignment.course}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Submitted {formatDate(assignment.dueDate)}</span>
                      </div>
                      {assignment.earnedPoints && (
                        <div className="text-muted-foreground">
                          Score: {assignment.earnedPoints}/{assignment.maxPoints}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(assignment.status)}>
                      {assignment.status === 'graded' ? assignment.grade : 'Submitted'}
                    </Badge>
                    <Button variant="outline" size="sm" className="bg-gradient-subtle">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Assignments