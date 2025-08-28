import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, ArrowRight, CheckCircle } from 'lucide-react';

interface DependencyNode {
  id: string;
  title: string;
  completed: boolean;
  dependencies: string[];
}

interface DependencyTreeProps {
  assignmentId: string;
}

export const DependencyTree: React.FC<DependencyTreeProps> = ({ assignmentId }) => {
  const [nodes, setNodes] = useState<DependencyNode[]>([
    {
      id: '1',
      title: 'Read Chapter 1',
      completed: true,
      dependencies: []
    },
    {
      id: '2',
      title: 'Take Notes',
      completed: true,
      dependencies: ['1']
    },
    {
      id: '3',
      title: 'Complete Exercises',
      completed: false,
      dependencies: ['2']
    },
    {
      id: '4',
      title: 'Write Summary',
      completed: false,
      dependencies: ['3']
    },
    {
      id: '5',
      title: 'Review and Submit',
      completed: false,
      dependencies: ['4']
    }
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const addTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: DependencyNode = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      dependencies: []
    };

    setNodes([...nodes, newTask]);
    setNewTaskTitle('');
  };

  const toggleComplete = (id: string) => {
    setNodes(nodes.map(node => 
      node.id === id ? { ...node, completed: !node.completed } : node
    ));
  };

  const canComplete = (node: DependencyNode): boolean => {
    return node.dependencies.every(depId => 
      nodes.find(n => n.id === depId)?.completed
    );
  };

  const getNodeLevel = (node: DependencyNode): number => {
    if (node.dependencies.length === 0) return 0;
    const depLevels = node.dependencies.map(depId => {
      const depNode = nodes.find(n => n.id === depId);
      return depNode ? getNodeLevel(depNode) + 1 : 0;
    });
    return Math.max(...depLevels);
  };

  const sortedNodes = [...nodes].sort((a, b) => getNodeLevel(a) - getNodeLevel(b));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Dependency Tree</span>
          </CardTitle>
          <CardDescription>
            Visualize task dependencies and track progress through your assignment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Add a new task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
            />
            <Button onClick={addTask}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task Flow</CardTitle>
          <CardDescription>
            Complete tasks in order based on their dependencies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedNodes.map((node, index) => (
              <div key={node.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Button
                    size="sm"
                    variant={node.completed ? 'default' : canComplete(node) ? 'outline' : 'ghost'}
                    onClick={() => toggleComplete(node.id)}
                    disabled={!canComplete(node) && !node.completed}
                    className="w-10 h-10 rounded-full p-0"
                  >
                    {node.completed ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <span className="text-xs">{index + 1}</span>
                    )}
                  </Button>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className={`font-medium ${
                      node.completed ? 'line-through text-muted-foreground' : ''
                    }`}>
                      {node.title}
                    </h4>
                    <Badge variant={
                      node.completed ? 'default' : 
                      canComplete(node) ? 'secondary' : 
                      'outline'
                    }>
                      {node.completed ? 'Complete' : 
                       canComplete(node) ? 'Available' : 
                       'Blocked'}
                    </Badge>
                  </div>
                  
                  {node.dependencies.length > 0 && (
                    <div className="mt-1 flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>Depends on:</span>
                      {node.dependencies.map((depId, i) => {
                        const depNode = nodes.find(n => n.id === depId);
                        return (
                          <div key={depId} className="flex items-center space-x-1">
                            {i > 0 && <span>,</span>}
                            <span className={depNode?.completed ? 'text-green-600' : 'text-orange-600'}>
                              {depNode?.title || 'Unknown'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {index < sortedNodes.length - 1 && (
                  <div className="flex-shrink-0">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Progress Summary</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Completed</p>
                <p className="font-bold text-green-600">
                  {nodes.filter(n => n.completed).length}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Available</p>
                <p className="font-bold text-blue-600">
                  {nodes.filter(n => !n.completed && canComplete(n)).length}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Blocked</p>
                <p className="font-bold text-orange-600">
                  {nodes.filter(n => !n.completed && !canComplete(n)).length}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};