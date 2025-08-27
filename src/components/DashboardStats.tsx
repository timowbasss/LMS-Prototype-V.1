import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Clock, TrendingUp, Award } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  trend?: string
}

const StatCard = ({ title, value, description, icon, trend }: StatCardProps) => (
  <Card className="shadow-soft hover:shadow-medium transition-shadow duration-200">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <div className="text-primary">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">
        {description}
        {trend && (
          <span className="text-success font-medium ml-1">
            {trend}
          </span>
        )}
      </p>
    </CardContent>
  </Card>
)

export function DashboardStats() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Active Courses"
        value="5"
        description="Currently enrolled"
        icon={<BookOpen className="h-4 w-4" />}
      />
      <StatCard
        title="Overall GPA"
        value="3.85"
        description="Current semester"
        trend="+0.12 from last term"
        icon={<Award className="h-4 w-4" />}
      />
      <StatCard
        title="Study Time"
        value="81h"
        description="This month"
        trend="+15% from last month"
        icon={<Clock className="h-4 w-4" />}
      />
      <StatCard
        title="Assignments Due"
        value="3"
        description="Next 7 days"
        icon={<TrendingUp className="h-4 w-4" />}
      />
    </div>
  )
}