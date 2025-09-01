import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Search, FileText, Calendar, BookOpen, BarChart3, Users, Settings, MessageSquare, Brain, GitBranch, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/components/LanguageProvider';

interface SearchItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  category: string;
}

interface SpotlightSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SpotlightSearch = ({ open, onOpenChange }: SpotlightSearchProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const searchItems: SearchItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Overview of your academic progress',
      icon: <BarChart3 className="h-4 w-4" />,
      path: '/',
      category: 'Pages'
    },
    {
      id: 'courses',
      title: 'Courses',
      description: 'View and manage your courses',
      icon: <BookOpen className="h-4 w-4" />,
      path: '/courses',
      category: 'Pages'
    },
    {
      id: 'assignments',
      title: 'Assignments',
      description: 'Track and submit assignments',
      icon: <FileText className="h-4 w-4" />,
      path: '/assignments',
      category: 'Pages'
    },
    {
      id: 'calendar',
      title: 'Calendar',
      description: 'Schedule and view events',
      icon: <Calendar className="h-4 w-4" />,
      path: '/calendar',
      category: 'Pages'
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Performance insights and reports',
      icon: <Activity className="h-4 w-4" />,
      path: '/analytics',
      category: 'Pages'
    },
    {
      id: 'messages',
      title: 'Messages',
      description: 'Communicate with instructors and peers',
      icon: <MessageSquare className="h-4 w-4" />,
      path: '/messages',
      category: 'Pages'
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Customize your preferences',
      icon: <Settings className="h-4 w-4" />,
      path: '/settings',
      category: 'Pages'
    },
    {
      id: 'mindmap',
      title: 'Mind Map',
      description: 'Create visual thought maps',
      icon: <Brain className="h-4 w-4" />,
      path: '/mindmap',
      category: 'Tools'
    },
    {
      id: 'heatmap',
      title: 'Heat Map',
      description: 'Visualize study activity patterns',
      icon: <Activity className="h-4 w-4" />,
      path: '/heatmap',
      category: 'Tools'
    },
    {
      id: 'dependency-tree',
      title: 'Dependency Tree',
      description: 'Manage task dependencies',
      icon: <GitBranch className="h-4 w-4" />,
      path: '/dependency-tree',
      category: 'Tools'
    },
    {
      id: 'contact-instructor',
      title: 'Contact Instructor',
      description: 'Schedule sessions with teachers',
      icon: <Users className="h-4 w-4" />,
      path: '/contact-instructor',
      category: 'Communication'
    }
  ];

  const filteredItems = searchItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, SearchItem[]>);

  const handleSelect = (path: string) => {
    navigate(path);
    onOpenChange(false);
    setSearchQuery('');
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-[640px]">
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pages, tools, and features..."
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0 focus-visible:ring-0"
          />
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-2">
            <span className="text-xs">ESC</span>
          </kbd>
        </div>
        <Command>
          <CommandList className="max-h-[400px] overflow-y-auto">
            <CommandEmpty>No results found.</CommandEmpty>
            {Object.entries(groupedItems).map(([category, items]) => (
              <CommandGroup key={category} heading={category}>
                {items.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.title}
                    onSelect={() => handleSelect(item.path)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-3 w-full">
                      {item.icon}
                      <div className="flex-1">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-muted-foreground">{item.description}</div>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
        <div className="flex items-center justify-between border-t px-3 py-2 text-xs text-muted-foreground">
          <div>Use ↑↓ to navigate, ↵ to select, ESC to close</div>
          <div className="flex items-center gap-1">
            <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
              ⌘K
            </kbd>
            <span>to search</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};