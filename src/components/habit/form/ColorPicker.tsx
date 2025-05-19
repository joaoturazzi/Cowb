
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { HabitFormData } from './HabitFormTypes';

interface ColorPickerProps {
  form: UseFormReturn<HabitFormData>;
}

const colorOptions = [
  { value: '#9b87f5', label: 'Roxo' },
  { value: '#f87171', label: 'Vermelho' },
  { value: '#facc15', label: 'Amarelo' },
  { value: '#4ade80', label: 'Verde' },
  { value: '#60a5fa', label: 'Azul' },
  { value: '#e879f9', label: 'Rosa' },
  { value: '#f97316', label: 'Laranja' },
  { value: '#14b8a6', label: 'Turquesa' },
  { value: '#8b5cf6', label: 'Violeta' },
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="color"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Escolha uma cor</FormLabel>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map(color => (
              <div
                key={color.value}
                className={`w-10 h-10 rounded-full cursor-pointer flex items-center justify-center transition-all ${
                  field.value === color.value ? 'ring-2 ring-offset-2 ring-primary' : ''
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => form.setValue('color', color.value)}
                role="button"
                tabIndex={0}
                aria-label={`Selecionar cor ${color.label}`}
              >
                {field.value === color.value && (
                  <CheckCircle className="h-5 w-5 text-white" />
                )}
              </div>
            ))}
          </div>
          <FormDescription>
            Esta cor será usada para identificar seu hábito
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ColorPicker;
