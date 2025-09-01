import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Palette, Check, RotateCcw } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { toast } from 'sonner';

interface ColorScheme {
  id: string;
  name: string;
  primary: string;
  accent: string;
  success: string;
  warning: string;
  background: string;
  foreground: string;
}

interface ThemeCustomizerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ThemeCustomizer = ({ open, onOpenChange }: ThemeCustomizerProps) => {
  const { theme } = useTheme();
  const [selectedScheme, setSelectedScheme] = useState<string>('default');
  const [customColor, setCustomColor] = useState('#3b82f6');

  const colorSchemes: ColorScheme[] = [
    {
      id: 'default',
      name: 'Default Blue',
      primary: '216 87% 52%',
      accent: '142 76% 36%',
      success: '142 76% 36%',
      warning: '38 92% 50%',
      background: '210 20% 98%',
      foreground: '215 25% 15%'
    },
    {
      id: 'purple',
      name: 'Purple Passion',
      primary: '262 83% 58%',
      accent: '310 65% 52%',
      success: '142 76% 36%',
      warning: '38 92% 50%',
      background: '210 20% 98%',
      foreground: '215 25% 15%'
    },
    {
      id: 'emerald',
      name: 'Emerald Green',
      primary: '158 64% 52%',
      accent: '142 76% 36%',
      success: '142 76% 36%',
      warning: '38 92% 50%',
      background: '210 20% 98%',
      foreground: '215 25% 15%'
    },
    {
      id: 'orange',
      name: 'Vibrant Orange',
      primary: '20 94% 60%',
      accent: '38 92% 50%',
      success: '142 76% 36%',
      warning: '38 92% 50%',
      background: '210 20% 98%',
      foreground: '215 25% 15%'
    },
    {
      id: 'rose',
      name: 'Rose Pink',
      primary: '330 81% 60%',
      accent: '310 65% 52%',
      success: '142 76% 36%',
      warning: '38 92% 50%',
      background: '210 20% 98%',
      foreground: '215 25% 15%'
    },
    {
      id: 'teal',
      name: 'Teal Ocean',
      primary: '172 66% 50%',
      accent: '158 64% 52%',
      success: '142 76% 36%',
      warning: '38 92% 50%',
      background: '210 20% 98%',
      foreground: '215 25% 15%'
    }
  ];

  const applyColorScheme = (scheme: ColorScheme) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', scheme.primary);
    root.style.setProperty('--accent', scheme.accent);
    root.style.setProperty('--success', scheme.success);
    root.style.setProperty('--warning', scheme.warning);
    
    // Update gradients
    root.style.setProperty('--gradient-primary', `linear-gradient(135deg, hsl(${scheme.primary}), hsl(${scheme.primary.split(' ').map((v, i) => i === 2 ? `${parseInt(v.replace('%', '')) - 10}%` : v).join(' ')}))`);
    root.style.setProperty('--gradient-accent', `linear-gradient(135deg, hsl(${scheme.accent}), hsl(${scheme.accent.split(' ').map((v, i) => i === 2 ? `${parseInt(v.replace('%', '')) - 10}%` : v).join(' ')}))`);
    
    setSelectedScheme(scheme.id);
    localStorage.setItem('ivy-stem-color-scheme', scheme.id);
    toast.success(`Applied ${scheme.name} theme!`);
  };

  const applyCustomColor = () => {
    const hexToHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };

    const hslValue = hexToHsl(customColor);
    const root = document.documentElement;
    root.style.setProperty('--primary', hslValue);
    root.style.setProperty('--gradient-primary', `linear-gradient(135deg, hsl(${hslValue}), hsl(${hslValue.split(' ').map((v, i) => i === 2 ? `${parseInt(v.replace('%', '')) - 10}%` : v).join(' ')}))`);
    
    setSelectedScheme('custom');
    localStorage.setItem('ivy-stem-custom-color', customColor);
    toast.success('Applied custom color theme!');
  };

  const resetToDefault = () => {
    const defaultScheme = colorSchemes[0];
    applyColorScheme(defaultScheme);
    setCustomColor('#3b82f6');
    localStorage.removeItem('ivy-stem-color-scheme');
    localStorage.removeItem('ivy-stem-custom-color');
    toast.success('Reset to default theme!');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme Customizer
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Preset Color Schemes */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Preset Color Schemes</Label>
            <div className="grid grid-cols-2 gap-4">
              {colorSchemes.map((scheme) => (
                <Card 
                  key={scheme.id}
                  className={`cursor-pointer transition-all hover:shadow-medium ${
                    selectedScheme === scheme.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => applyColorScheme(scheme)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-sm">{scheme.name}</span>
                      {selectedScheme === scheme.id && (
                        <Check className="h-4 w-4 text-success" />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <div 
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: `hsl(${scheme.primary})` }}
                        title="Primary"
                      />
                      <div 
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: `hsl(${scheme.accent})` }}
                        title="Accent"
                      />
                      <div 
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: `hsl(${scheme.success})` }}
                        title="Success"
                      />
                      <div 
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: `hsl(${scheme.warning})` }}
                        title="Warning"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Custom Color Picker */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Custom Primary Color</Label>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-12 h-12 rounded border cursor-pointer"
                />
                <div className="space-y-1">
                  <div className="text-sm font-medium">Custom Color</div>
                  <div className="text-xs text-muted-foreground">{customColor}</div>
                </div>
              </div>
              <Button onClick={applyCustomColor} size="sm">
                Apply Custom
              </Button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Preview</Label>
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex gap-2">
                  <Button size="sm" className="bg-gradient-primary">Primary</Button>
                  <Button size="sm" variant="outline">Outline</Button>
                  <Button size="sm" variant="secondary">Secondary</Button>
                </div>
                <div className="flex gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
                <div className="p-3 bg-gradient-subtle rounded border">
                  <p className="text-sm text-foreground">
                    This is how your theme looks with the current color scheme.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reset Button */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button onClick={resetToDefault} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Default
            </Button>
            <p className="text-xs text-muted-foreground">
              Changes are saved automatically
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};