
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface AppearanceSettingsProps {
  themePreference: string;
  onThemeChange: (theme: string) => void;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  themePreference,
  onThemeChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aparência</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Tema</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant={themePreference === 'light' ? "default" : "outline"}
              onClick={() => onThemeChange('light')}
              className="justify-center"
            >
              Claro
            </Button>
            <Button 
              variant={themePreference === 'dark' ? "default" : "outline"}
              onClick={() => onThemeChange('dark')}
              className="justify-center"
            >
              Escuro
            </Button>
            <Button 
              variant={themePreference === 'system' ? "default" : "outline"}
              onClick={() => onThemeChange('system')}
              className="justify-center"
            >
              Sistema
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearanceSettings;
