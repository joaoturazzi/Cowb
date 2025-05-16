
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';

interface SettingsHeaderProps {
  onSave: () => void;
  isSaving: boolean;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({ onSave, isSaving }) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">Configurações</h1>
      <Button
        onClick={onSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Save className="h-4 w-4 mr-2" />
        )}
        Salvar
      </Button>
    </div>
  );
};

export default SettingsHeader;
