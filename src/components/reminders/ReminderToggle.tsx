
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { LucideIcon } from 'lucide-react';

interface ReminderToggleProps {
  id: string;
  label: string;
  icon: LucideIcon;
  iconColor: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const ReminderToggle: React.FC<ReminderToggleProps> = ({
  id,
  label,
  icon: Icon,
  iconColor,
  checked,
  onCheckedChange,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Icon className={`h-4 w-4 ${iconColor}`} />
        <Label htmlFor={id}>{label}</Label>
      </div>
      <Switch 
        id={id} 
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
};

export default ReminderToggle;
