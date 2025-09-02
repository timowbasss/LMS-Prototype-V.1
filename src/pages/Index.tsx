import { DashboardStats } from "@/components/DashboardStats"
import { CourseGrid } from "@/components/CourseGrid"
import { PerformanceChart } from "@/components/PerformanceChart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock } from "lucide-react"
import { useLanguage } from "@/components/LanguageProvider"

const Index = () => {
  const { t } = useLanguage()
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
          {t("welcome.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("welcome.subtitle")}
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
          {/* Study Hours Today */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Today's Study Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">4.2h</div>
                <p className="text-sm text-muted-foreground">Hours studied today</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Physics</span>
                    <span>1.5h</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Math</span>
                    <span>2.0h</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Chemistry</span>
                    <span>0.7h</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gradient-subtle rounded-lg border">
                <span className="w-2 h-2 rounded-full bg-primary mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">New message from Dr. Johnson</p>
                  <p className="text-xs text-muted-foreground">“Please review the calculus worksheet before tomorrow’s class.”</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gradient-subtle rounded-lg border">
                <span className="w-2 h-2 rounded-full bg-accent mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Announcement: Lab Safety Seminar</p>
                  <p className="text-xs text-muted-foreground">Mandatory for all science students • Sep 12, 11:00 AM</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gradient-subtle rounded-lg border">
                <span className="w-2 h-2 rounded-full bg-warning mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Pending Assignment: Physics Problem Set</p>
                  <p className="text-xs text-muted-foreground">Due in 2 days • 10 questions</p>
                </div>
              </div>
            </CardContent>
          </Card>

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
