import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search, MessageSquare, Users, Clock, Pin, Heart, MessageCircle, Eye } from "lucide-react"

interface ForumPost {
  id: string
  title: string
  content: string
  author: {
    name: string
    avatar?: string
    role: string
  }
  category: string
  replies: number
  likes: number
  views: number
  lastActivity: string
  isPinned?: boolean
  tags: string[]
}

const mockForumPosts: ForumPost[] = [
  {
    id: "1",
    title: "Help with Quantum Physics Problem Set 3",
    content: "I'm struggling with the wave function calculations in problem 3. Can anyone explain the approach?",
    author: {
      name: "Sarah Chen",
      avatar: "/avatars/sarah.jpg",
      role: "Grade 12 Student"
    },
    category: "Physics Help",
    replies: 12,
    likes: 8,
    views: 145,
    lastActivity: "2 hours ago",
    tags: ["physics", "quantum-mechanics", "homework"]
  },
  {
    id: "2", 
    title: "Study Group for Calculus Final Exam",
    content: "Looking to form a study group for the upcoming calculus final. Who's interested?",
    author: {
      name: "Michael Rodriguez", 
      avatar: "/avatars/michael.jpg",
      role: "Grade 11 Student"
    },
    category: "Study Groups",
    replies: 18,
    likes: 25,
    views: 320,
    lastActivity: "4 hours ago",
    isPinned: true,
    tags: ["calculus", "study-group", "finals"]
  },
  {
    id: "3",
    title: "Computer Science Competition Results",
    content: "Congratulations to all participants in the regional coding competition! Here are the results...",
    author: {
      name: "Ms. Emily Watson",
      avatar: "/avatars/emily.jpg", 
      role: "CS Instructor"
    },
    category: "Announcements",
    replies: 45,
    likes: 78,
    views: 890,
    lastActivity: "1 day ago",
    isPinned: true,
    tags: ["competition", "computer-science", "results"]
  },
  {
    id: "4",
    title: "Tips for Biology Lab Reports",
    content: "After grading many lab reports, here are some common tips to improve your submissions...",
    author: {
      name: "Dr. Lisa Thompson",
      avatar: "/avatars/lisa.jpg",
      role: "Biology Instructor"
    },
    category: "Academic Tips",
    replies: 23,
    likes: 56,
    views: 567,
    lastActivity: "2 days ago",
    tags: ["biology", "lab-reports", "tips"]
  },
  {
    id: "5",
    title: "Chemistry Lab Safety Reminder",
    content: "Important reminders about lab safety protocols for next week's experiments...",
    author: {
      name: "Dr. James Park",
      avatar: "/avatars/james.jpg",
      role: "Chemistry Instructor"
    },
    category: "Safety",
    replies: 8,
    likes: 34,
    views: 234,
    lastActivity: "3 days ago",
    tags: ["chemistry", "safety", "lab"]
  }
]

const categories = [
  "All Categories",
  "Physics Help", 
  "Study Groups",
  "Announcements",
  "Academic Tips",
  "Safety",
  "General Discussion"
]

const Forums = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Student Forums</h1>
        <p className="text-muted-foreground">
          Connect with classmates, get help, and share knowledge.
        </p>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search forums..." 
            className="pl-10 bg-background"
          />
        </div>
        <Button className="bg-gradient-primary hover:opacity-90">
          New Post
        </Button>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge 
            key={category}
            variant={category === "All Categories" ? "default" : "secondary"}
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* Forum Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">127</p>
                <p className="text-sm text-muted-foreground">Total Posts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold text-foreground">45</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-8 w-8 text-info" />
              <div>
                <p className="text-2xl font-bold text-foreground">289</p>
                <p className="text-sm text-muted-foreground">Replies</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-sm text-muted-foreground">Posts Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forum Posts */}
      <div className="space-y-4">
        {mockForumPosts.map((post) => (
          <Card key={post.id} className={`shadow-soft hover:shadow-medium transition-shadow duration-200 ${post.isPinned ? 'border-primary bg-gradient-to-r from-primary/5 to-transparent' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <Avatar className="h-12 w-12 flex-shrink-0">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                    {post.author.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                {/* Post Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {post.isPinned && (
                          <Pin className="h-4 w-4 text-primary" />
                        )}
                        <h3 className="text-lg font-semibold text-foreground hover:text-primary cursor-pointer">
                          {post.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {post.content}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-gradient-subtle">
                      {post.category}
                    </Badge>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Author & Stats */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{post.author.name}</span>
                      <span>{post.author.role}</span>
                      <span>•</span>
                      <span>{post.lastActivity}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{post.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.replies}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" className="bg-gradient-subtle">
          Load More Posts
        </Button>
      </div>
    </div>
  )
}

export default Forums