import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GitBranch, Plus, CheckCircle, Circle, Clock } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dependencies: string[];
  estimatedHours: number;
  completedAt?: Date;
}

const DependencyTree = () => {
  const { t } = useLanguage();
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Read Chapter 1', completed: true, dependencies: [], estimatedHours: 2 },
    { id: '2', title: 'Complete Practice Problems', completed: true, dependencies: ['1'], estimatedHours: 3 },
    { id: '3', title: 'Write Summary', completed: false, dependencies: ['1', '2'], estimatedHours: 1 },
    { id: '4', title: 'Review with Peers', completed: false, dependencies: ['3'], estimatedHours: 2 },
    { id: '5', title: 'Final Review', completed: false, dependencies: ['4'], estimatedHours: 1 }
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedDependencies, setSelectedDependencies] = useState<string[]>([]);

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      dependencies: selectedDependencies,
      estimatedHours: 1
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setSelectedDependencies([]);
    toast.success('Task added to dependency tree!');
  };

  const toggleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          completed: !task.completed,
          completedAt: !task.completed ? new Date() : undefined
        };
      }
      return task;
    }));
    toast.success('Task status updated!');
  };

  const canCompleteTask = (task: Task) => {
    return task.dependencies.every(depId => 
      tasks.find(t => t.id === depId)?.completed
    );
  };

  const getTaskLevel = (taskId: string, visited = new Set()): number => {
    if (visited.has(taskId)) return 0;
    visited.add(taskId);
    
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.dependencies.length === 0) return 0;
    
    return 1 + Math.max(...task.dependencies.map(depId => getTaskLevel(depId, visited)));
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Dependency Tree</h1>
        <p className="text-muted-foreground">
          Organize and track task dependencies for better project management.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Tree */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Task Dependency Tree
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: Math.max(...tasks.map(t => getTaskLevel(t.id))) + 1 }).map((_, level) => {
                const tasksAtLevel = tasks.filter(task => getTaskLevel(task.id) === level);
                
                return (
                  <div key={level} className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">
                      Level {level + 1}
                    </div>
                    <div className="grid gap-2">
                      {tasksAtLevel.map(task => (
                        <div
                          key={task.id}
                          className={`p-3 rounded-lg border ${
                            task.completed ? 'bg-success/10 border-success' : 
                            canCompleteTask(task) ? 'bg-gradient-subtle border-primary' : 
                            'bg-muted/50 border-muted'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleTaskComplete(task.id)}
                                disabled={!canCompleteTask(task) && !task.completed}
                                className="p-1 h-auto"
                              >
                                {task.completed ? (
                                  <CheckCircle className="h-5 w-5 text-success" />
                                ) : canCompleteTask(task) ? (
                                  <Circle className="h-5 w-5 text-primary" />
                                ) : (
                                  <Clock className="h-5 w-5 text-muted-foreground" />
                                )}
                              </Button>
                              <div>
                                <div className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                  {task.title}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {task.estimatedHours}h estimated
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              {task.dependencies.map(depId => {
                                const depTask = tasks.find(t => t.id === depId);
                                return (
                                  <Badge key={depId} variant="outline" className="text-xs">
                                    {depTask?.title.substring(0, 10)}...
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Progress Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completed Tasks</span>
                  <span>{completedTasks}/{totalTasks}</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-gradient-subtle rounded-lg">
                  <div className="text-2xl font-bold text-success">{completedTasks}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="p-3 bg-gradient-subtle rounded-lg">
                  <div className="text-2xl font-bold text-warning">{tasks.filter(t => canCompleteTask(t) && !t.completed).length}</div>
                  <div className="text-sm text-muted-foreground">Available</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add New Task</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Dependencies</label>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {tasks.map(task => (
                    <label key={task.id} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedDependencies.includes(task.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDependencies([...selectedDependencies, task.id]);
                          } else {
                            setSelectedDependencies(selectedDependencies.filter(id => id !== task.id));
                          }
                        }}
                        className="rounded"
                      />
                      <span>{task.title}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <Button onClick={addTask} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {tasks
                .filter(task => canCompleteTask(task) && !task.completed)
                .slice(0, 3)
                .map(task => (
                  <div key={task.id} className="p-2 bg-gradient-subtle rounded border">
                    <div className="font-medium text-sm">{task.title}</div>
                    <div className="text-xs text-muted-foreground">{task.estimatedHours}h estimated</div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DependencyTree;