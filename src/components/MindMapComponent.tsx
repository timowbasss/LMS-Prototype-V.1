import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Brain, Plus, Save, Trash2 } from 'lucide-react';

interface MindMapNode {
  id: string;
  text: string;
  x: number;
  y: number;
  connections: string[];
}

interface MindMap {
  id: string;
  title: string;
  content: any;
}

interface MindMapComponentProps {
  assignmentId: string;
}

export const MindMapComponent: React.FC<MindMapComponentProps> = ({ assignmentId }) => {
  const { user } = useAuth();
  const [mindMaps, setMindMaps] = useState<MindMap[]>([]);
  const [currentMap, setCurrentMap] = useState<MindMap | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMindMaps();
    }
  }, [user, assignmentId]);

  const fetchMindMaps = async () => {
    try {
      const { data, error } = await supabase
        .from('mindmaps')
        .select('*')
        .eq('assignment_id', assignmentId)
        .eq('user_id', user?.id);

      if (error) throw error;
      setMindMaps(data || []);
    } catch (error) {
      console.error('Error fetching mind maps:', error);
      toast.error('Failed to load mind maps');
    } finally {
      setLoading(false);
    }
  };

  const createMindMap = async () => {
    if (!user || !newTitle.trim()) {
      toast.error('Please enter a title');
      return;
    }

    try {
      const newMap = {
        user_id: user.id,
        assignment_id: assignmentId,
        title: newTitle,
        content: {
          nodes: [
            {
              id: '1',
              text: 'Main Topic',
              x: 400,
              y: 200,
              connections: []
            }
          ]
        }
      };

      const { data, error } = await supabase
        .from('mindmaps')
        .insert(newMap)
        .select()
        .single();

      if (error) throw error;

      setMindMaps([...mindMaps, data]);
      setCurrentMap(data);
      setNewTitle('');
      toast.success('Mind map created!');
    } catch (error) {
      console.error('Error creating mind map:', error);
      toast.error('Failed to create mind map');
    }
  };

  const saveMindMap = async () => {
    if (!currentMap) return;

    try {
      const { error } = await supabase
        .from('mindmaps')
        .update({ content: currentMap.content })
        .eq('id', currentMap.id);

      if (error) throw error;
      toast.success('Mind map saved!');
    } catch (error) {
      console.error('Error saving mind map:', error);
      toast.error('Failed to save mind map');
    }
  };

  const deleteMindMap = async (id: string) => {
    try {
      const { error } = await supabase
        .from('mindmaps')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMindMaps(mindMaps.filter(map => map.id !== id));
      if (currentMap?.id === id) {
        setCurrentMap(null);
      }
      toast.success('Mind map deleted!');
    } catch (error) {
      console.error('Error deleting mind map:', error);
      toast.error('Failed to delete mind map');
    }
  };

  const addNode = () => {
    if (!currentMap) return;

    const newNode: MindMapNode = {
      id: Date.now().toString(),
      text: 'New Idea',
      x: Math.random() * 600 + 100,
      y: Math.random() * 400 + 100,
      connections: []
    };

    setCurrentMap({
      ...currentMap,
      content: {
        nodes: [...currentMap.content.nodes, newNode]
      }
    });
  };

  const updateNode = (nodeId: string, text: string) => {
    if (!currentMap) return;

    setCurrentMap({
      ...currentMap,
      content: {
        nodes: currentMap.content.nodes.map(node =>
          node.id === nodeId ? { ...node, text } : node
        )
      }
    });
  };

  const removeNode = (nodeId: string) => {
    if (!currentMap) return;

    setCurrentMap({
      ...currentMap,
      content: {
        nodes: currentMap.content.nodes.filter(node => node.id !== nodeId)
      }
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Mind Maps</span>
          </CardTitle>
          <CardDescription>
            Create visual mind maps to organize your thoughts and ideas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter mind map title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && createMindMap()}
            />
            <Button onClick={createMindMap}>
              <Plus className="h-4 w-4 mr-2" />
              Create
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mindMaps.map((map) => (
              <Card
                key={map.id}
                className={`cursor-pointer transition-colors ${
                  currentMap?.id === map.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setCurrentMap(map)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{map.title}</h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMindMap(map.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {map.content.nodes.length} nodes
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {currentMap && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{currentMap.title}</CardTitle>
              <div className="space-x-2">
                <Button size="sm" onClick={addNode}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Node
                </Button>
                <Button size="sm" onClick={saveMindMap}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative border rounded-lg h-96 overflow-auto bg-gradient-to-br from-background to-muted/20">
              {currentMap.content.nodes.map((node) => (
                <div
                  key={node.id}
                  className="absolute bg-background border rounded-lg p-3 shadow-sm"
                  style={{ left: node.x, top: node.y }}
                >
                  <Textarea
                    value={node.text}
                    onChange={(e) => updateNode(node.id, e.target.value)}
                    className="min-h-[60px] w-48 resize-none border-none p-0 focus:ring-0"
                    placeholder="Enter your idea..."
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0"
                    onClick={() => removeNode(node.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {mindMaps.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No mind maps yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first mind map to start organizing your ideas visually
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};