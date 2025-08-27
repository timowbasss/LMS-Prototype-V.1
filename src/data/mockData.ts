export interface Course {
  id: string
  name: string
  instructor: string
  description: string
  progress: number
  grade: string
  color: string
  assignments: number
  nextAssignment?: string
  dueDate?: string
}

export interface Assignment {
  id: string
  title: string
  course: string
  dueDate: string
  status: "pending" | "submitted" | "graded"
  grade?: string
  maxPoints: number
  earnedPoints?: number
}

export interface GradeData {
  course: string
  currentGrade: string
  assignments: {
    name: string
    grade: string
    points: string
    date: string
  }[]
}

export interface AnalyticsData {
  timeSpent: { subject: string; hours: number }[]
  gradeDistribution: { grade: string; count: number }[]
  weeklyProgress: { week: string; completed: number; assigned: number }[]
}

export const mockCourses: Course[] = [
  {
    id: "1",
    name: "Advanced Physics",
    instructor: "Dr. Sarah Chen",
    description: "Quantum mechanics and modern physics concepts",
    progress: 78,
    grade: "A-",
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
    assignments: 12,
    nextAssignment: "Quantum States Lab Report",
    dueDate: "March 15, 2024"
  },
  {
    id: "2",
    name: "Calculus III",
    instructor: "Prof. Michael Rodriguez",
    description: "Multivariable calculus and vector analysis",
    progress: 85,
    grade: "A",
    color: "bg-gradient-to-br from-green-500 to-green-600",
    assignments: 8,
    nextAssignment: "Vector Fields Problem Set",
    dueDate: "March 12, 2024"
  },
  {
    id: "3",
    name: "Computer Science",
    instructor: "Ms. Emily Watson",
    description: "Data structures and algorithms",
    progress: 92,
    grade: "A+",
    color: "bg-gradient-to-br from-purple-500 to-purple-600",
    assignments: 6,
    nextAssignment: "Binary Tree Implementation",
    dueDate: "March 18, 2024"
  },
  {
    id: "4",
    name: "Chemistry Lab",
    instructor: "Dr. James Park",
    description: "Advanced organic chemistry laboratory",
    progress: 71,
    grade: "B+",
    color: "bg-gradient-to-br from-orange-500 to-orange-600",
    assignments: 10,
    nextAssignment: "Synthesis Experiment",
    dueDate: "March 20, 2024"
  },
  {
    id: "5",
    name: "Biology",
    instructor: "Dr. Lisa Thompson",
    description: "Molecular biology and genetics",
    progress: 88,
    grade: "A-",
    color: "bg-gradient-to-br from-teal-500 to-teal-600",
    assignments: 9,
    nextAssignment: "DNA Analysis Project",
    dueDate: "March 22, 2024"
  }
]

export const mockAssignments: Assignment[] = [
  {
    id: "1",
    title: "Quantum States Lab Report",
    course: "Advanced Physics",
    dueDate: "2024-03-15",
    status: "pending",
    maxPoints: 100
  },
  {
    id: "2",
    title: "Vector Fields Problem Set",
    course: "Calculus III",
    dueDate: "2024-03-12",
    status: "pending",
    maxPoints: 75
  },
  {
    id: "3",
    title: "Binary Tree Implementation",
    course: "Computer Science",
    dueDate: "2024-03-18",
    status: "pending",
    maxPoints: 150
  },
  {
    id: "4",
    title: "Wave Function Analysis",
    course: "Advanced Physics",
    dueDate: "2024-03-08",
    status: "graded",
    grade: "A-",
    maxPoints: 100,
    earnedPoints: 87
  },
  {
    id: "5",
    title: "Integration Techniques",
    course: "Calculus III",
    dueDate: "2024-03-05",
    status: "graded",
    grade: "A",
    maxPoints: 80,
    earnedPoints: 76
  }
]

export const mockGrades: GradeData[] = [
  {
    course: "Advanced Physics",
    currentGrade: "A-",
    assignments: [
      { name: "Midterm Exam", grade: "A-", points: "87/100", date: "Feb 28" },
      { name: "Lab Report 1", grade: "A", points: "45/50", date: "Feb 15" },
      { name: "Problem Set 3", grade: "B+", points: "23/25", date: "Feb 8" }
    ]
  },
  {
    course: "Calculus III",
    currentGrade: "A",
    assignments: [
      { name: "Quiz 4", grade: "A+", points: "25/25", date: "Mar 1" },
      { name: "Integration Test", grade: "A", points: "76/80", date: "Feb 20" },
      { name: "Homework 5", grade: "A-", points: "28/30", date: "Feb 12" }
    ]
  }
]

export const mockAnalytics: AnalyticsData = {
  timeSpent: [
    { subject: "Physics", hours: 18 },
    { subject: "Calculus", hours: 15 },
    { subject: "Computer Science", hours: 22 },
    { subject: "Chemistry", hours: 12 },
    { subject: "Biology", hours: 14 }
  ],
  gradeDistribution: [
    { grade: "A+", count: 8 },
    { grade: "A", count: 12 },
    { grade: "A-", count: 7 },
    { grade: "B+", count: 4 },
    { grade: "B", count: 2 }
  ],
  weeklyProgress: [
    { week: "Week 1", completed: 8, assigned: 10 },
    { week: "Week 2", completed: 12, assigned: 14 },
    { week: "Week 3", completed: 15, assigned: 16 },
    { week: "Week 4", completed: 11, assigned: 12 },
    { week: "Week 5", completed: 9, assigned: 11 }
  ]
}