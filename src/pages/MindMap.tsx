import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Brain, Plus, Save, Trash2 } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { toast } from 'sonner';

interface MindMapNode {
  id: string;
  text: string;
  x: number;
  y: number;
  connections: string[];
}

const MindMap = () => {
  const { t } = useLanguage();
  const [nodes, setNodes] = useState<MindMapNode[]>([
    { id: '1', text: 'Main Topic', x: 400, y: 300, connections: [] }
  ]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [newNodeText, setNewNodeText] = useState('');

  const addNode = () => {
    if (!newNodeText.trim()) return;
    
    const newNode: MindMapNode = {
      id: Date.now().toString(),
      text: newNodeText,
      x: Math.random() * 600 + 100,
      y: Math.random() * 400 + 100,
      connections: []
    };
    
    setNodes([...nodes, newNode]);
    setNewNodeText('');
    toast.success('Node added successfully!');
  };

  const deleteNode = (nodeId: string) => {
    setNodes(nodes.filter(node => node.id !== nodeId));
    setSelectedNode(null);
    toast.success('Node deleted');
  };

  const updateNodeText = (nodeId: string, newText: string) => {
    setNodes(nodes.map(node => 
      node.id === nodeId ? { ...node, text: newText } : node
    ));
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Mind Map</h1>
        <p className="text-muted-foreground">
          Create visual representations of your thoughts and ideas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Mind Map Canvas */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Mind Map Canvas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-[600px] bg-gradient-subtle rounded-lg border overflow-hidden">
              <svg className="w-full h-full">
                {/* Render connections */}
                {nodes.map(node =>
                  node.connections.map(connectionId => {
                    const connectedNode = nodes.find(n => n.id === connectionId);
                    if (!connectedNode) return null;
                    return (
                      <line
                        key={`${node.id}-${connectionId}`}
                        x1={node.x}
                        y1={node.y}
                        x2={connectedNode.x}
                        y2={connectedNode.y}
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                      />
                    );
                  })
                )}
                
                {/* Render nodes */}
                {nodes.map(node => (
                  <g key={node.id}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="40"
                      fill={selectedNode === node.id ? "hsl(var(--accent))" : "hsl(var(--primary))"}
                      stroke="hsl(var(--border))"
                      strokeWidth="2"
                      className="cursor-pointer hover:opacity-80"
                      onClick={() => setSelectedNode(node.id)}
                    />
                    <text
                      x={node.x}
                      y={node.y}
                      textAnchor="middle"
                      dy="0.35em"
                      className="fill-primary-foreground text-sm font-medium pointer-events-none"
                    >
                      {node.text.length > 8 ? node.text.substring(0, 8) + '...' : node.text}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Controls Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Node</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Node text"
                value={newNodeText}
                onChange={(e) => setNewNodeText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addNode()}
              />
              <Button onClick={addNode} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Node
              </Button>
            </CardContent>
          </Card>

          {selectedNode && (
            <Card>
              <CardHeader>
                <CardTitle>Edit Node</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  value={nodes.find(n => n.id === selectedNode)?.text || ''}
                  onChange={(e) => updateNodeText(selectedNode, e.target.value)}
                />
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => deleteNode(selectedNode)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full">
                Export as Image
              </Button>
              <Button variant="outline" className="w-full">
                Save Mind Map
              </Button>
              <Button variant="outline" className="w-full">
                Load Template
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MindMap;