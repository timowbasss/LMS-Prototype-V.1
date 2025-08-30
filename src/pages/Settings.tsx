import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/components/LanguageProvider';
import { useTheme } from 'next-themes';
import { 
  Settings as SettingsIcon, 
  Palette, 
  Globe, 
  Accessibility, 
  Volume2, 
  Eye, 
  Keyboard, 
  Bell,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  
  // Accessibility settings
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    autoplay: true,
    soundEffects: true,
    fontSize: [16],
    animationSpeed: [1]
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    assignmentReminders: true,
    gradeUpdates: true,
    forumActivity: false,
    weeklyReports: true
  });

  const handleAccessibilityChange = (key: string, value: any) => {
    setAccessibilitySettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Apply changes immediately
    switch (key) {
      case 'highContrast':
        document.body.classList.toggle('high-contrast', value);
        break;
      case 'largeText':
        document.body.classList.toggle('large-text', value);
        break;
      case 'reducedMotion':
        document.body.classList.toggle('reduced-motion', value);
        break;
      case 'fontSize':
        document.documentElement.style.fontSize = `${value[0]}px`;
        break;
    }
    
    toast.success('Settings updated');
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: value
    }));
    toast.success('Notification preferences updated');
  };

  const resetToDefaults = () => {
    setAccessibilitySettings({
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: true,
      autoplay: true,
      soundEffects: true,
      fontSize: [16],
      animationSpeed: [1]
    });
    
    setNotificationSettings({
      emailNotifications: true,
      pushNotifications: true,
      assignmentReminders: true,
      gradeUpdates: true,
      forumActivity: false,
      weeklyReports: true
    });
    
    // Reset DOM changes
    document.body.classList.remove('high-contrast', 'large-text', 'reduced-motion');
    document.documentElement.style.fontSize = '16px';
    
    toast.success('Settings reset to defaults');
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Customize your learning experience and accessibility preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Theme</label>
              <div className="flex gap-3">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('light')}
                  className="flex items-center gap-2"
                >
                  <Sun className="h-4 w-4" />
                  Light
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('dark')}
                  className="flex items-center gap-2"
                >
                  <Moon className="h-4 w-4" />
                  Dark
                </Button>
                <Button
                  variant={theme === 'system' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('system')}
                  className="flex items-center gap-2"
                >
                  <Monitor className="h-4 w-4" />
                  System
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Font Size</label>
              <div className="px-3">
                <Slider
                  value={accessibilitySettings.fontSize}
                  onValueChange={(value) => handleAccessibilityChange('fontSize', value)}
                  max={24}
                  min={12}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Small (12px)</span>
                  <span>Normal (16px)</span>
                  <span>Large (24px)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language & Region */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Language & Region
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Interface Language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">🇺🇸 English</SelectItem>
                  <SelectItem value="es">🇪🇸 Español</SelectItem>
                  <SelectItem value="fr">🇫🇷 Français</SelectItem>
                  <SelectItem value="zh">🇨🇳 中文</SelectItem>
                  <SelectItem value="ar">🇸🇦 العربية</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 rounded-lg bg-gradient-subtle">
              <h4 className="font-medium text-foreground mb-2">Current Language</h4>
              <Badge variant="secondary">{t('language.' + language)}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Accessibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Accessibility className="h-5 w-5" />
              Accessibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">High Contrast</label>
                  <p className="text-xs text-muted-foreground">Increase contrast for better visibility</p>
                </div>
                <Switch
                  checked={accessibilitySettings.highContrast}
                  onCheckedChange={(checked) => handleAccessibilityChange('highContrast', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">Large Text</label>
                  <p className="text-xs text-muted-foreground">Increase text size throughout the app</p>
                </div>
                <Switch
                  checked={accessibilitySettings.largeText}
                  onCheckedChange={(checked) => handleAccessibilityChange('largeText', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">Reduced Motion</label>
                  <p className="text-xs text-muted-foreground">Minimize animations and transitions</p>
                </div>
                <Switch
                  checked={accessibilitySettings.reducedMotion}
                  onCheckedChange={(checked) => handleAccessibilityChange('reducedMotion', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">Screen Reader Support</label>
                  <p className="text-xs text-muted-foreground">Enhanced support for screen readers</p>
                </div>
                <Switch
                  checked={accessibilitySettings.screenReader}
                  onCheckedChange={(checked) => handleAccessibilityChange('screenReader', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">Keyboard Navigation</label>
                  <p className="text-xs text-muted-foreground">Enhanced keyboard accessibility</p>
                </div>
                <Switch
                  checked={accessibilitySettings.keyboardNavigation}
                  onCheckedChange={(checked) => handleAccessibilityChange('keyboardNavigation', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">Email Notifications</label>
                  <p className="text-xs text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">Push Notifications</label>
                  <p className="text-xs text-muted-foreground">Get instant notifications</p>
                </div>
                <Switch
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">Assignment Reminders</label>
                  <p className="text-xs text-muted-foreground">Reminders before due dates</p>
                </div>
                <Switch
                  checked={notificationSettings.assignmentReminders}
                  onCheckedChange={(checked) => handleNotificationChange('assignmentReminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">Grade Updates</label>
                  <p className="text-xs text-muted-foreground">Notify when grades are posted</p>
                </div>
                <Switch
                  checked={notificationSettings.gradeUpdates}
                  onCheckedChange={(checked) => handleNotificationChange('gradeUpdates', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">Weekly Reports</label>
                  <p className="text-xs text-muted-foreground">Weekly progress summaries</p>
                </div>
                <Switch
                  checked={notificationSettings.weeklyReports}
                  onCheckedChange={(checked) => handleNotificationChange('weeklyReports', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audio & Visual */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Audio & Visual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">Sound Effects</label>
                <p className="text-xs text-muted-foreground">Play sounds for interactions</p>
              </div>
              <Switch
                checked={accessibilitySettings.soundEffects}
                onCheckedChange={(checked) => handleAccessibilityChange('soundEffects', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">Autoplay Media</label>
                <p className="text-xs text-muted-foreground">Automatically play videos and audio</p>
              </div>
              <Switch
                checked={accessibilitySettings.autoplay}
                onCheckedChange={(checked) => handleAccessibilityChange('autoplay', checked)}
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Animation Speed</label>
              <div className="px-3">
                <Slider
                  value={accessibilitySettings.animationSpeed}
                  onValueChange={(value) => handleAccessibilityChange('animationSpeed', value)}
                  max={2}
                  min={0.5}
                  step={0.25}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Slow</span>
                  <span>Normal</span>
                  <span>Fast</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reset Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Reset Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Reset all settings to their default values. This action cannot be undone.
              </p>
              <Button 
                variant="outline" 
                onClick={resetToDefaults}
                className="w-full"
              >
                Reset to Defaults
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;