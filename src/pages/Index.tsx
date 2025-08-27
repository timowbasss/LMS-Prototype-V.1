import { DashboardStats } from "@/components/DashboardStats"
import { CourseGrid } from "@/components/CourseGrid"
import { PerformanceChart } from "@/components/PerformanceChart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock } from "lucide-react"

const Index = () => {
  const upcomingEvents = [
    { title: "Physics Lab", time: "10:00 AM", date: "Today" },
    { title: "Calculus Quiz", time: "2:00 PM", date: "Tomorrow" },
    { title: "Chemistry Exam", time: "9:00 AM", date: "Friday" }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, John! 👋
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your studies today.
        </p>
      </div>

      {/* Dashboard Stats */}
      <DashboardStats />

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Courses */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Your Courses</h2>
              <Button variant="outline" className="bg-gradient-subtle">
                View All Courses
              </Button>
            </div>
            <CourseGrid />
          </div>

          {/* Performance Charts */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Performance Overview</h2>
            <PerformanceChart />
          </div>
        </div>

        <div className="space-y-6">
          {/* Upcoming Schedule */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gradient-subtle rounded-lg border">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium text-sm text-foreground">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.time} • {event.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-gradient-primary hover:opacity-90">
                Submit Assignment
              </Button>
              <Button variant="outline" className="w-full bg-gradient-subtle">
                Schedule Study Session
              </Button>
              <Button variant="outline" className="w-full bg-gradient-subtle">
                Contact Instructor
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
