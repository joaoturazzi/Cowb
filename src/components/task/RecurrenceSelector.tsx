
import React, { useState } from 'react';
import { 
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Repeat, X } from 'lucide-react';

interface RecurrenceOptions {
  enabled: boolean;
  type: 'daily' | 'weekly' | 'monthly';
  interval: number;
  endDate: Date | null;
}

interface RecurrenceSelectorProps {
  value: RecurrenceOptions;
  onChange: (value: RecurrenceOptions) => void;
}

const RecurrenceSelector: React.FC<RecurrenceSelectorProps> = ({
  value,
  onChange
}) => {
  const [open, setOpen] = useState(false);
  
  const handleRecurrenceChange = (changes: Partial<RecurrenceOptions>) => {
    onChange({ ...value, ...changes });
  };
  
  const recurrenceLabels = {
    daily: 'Diária',
    weekly: 'Semanal',
    monthly: 'Mensal'
  };
  
  const getRecurrenceDescription = () => {
    if (!value.enabled) return 'Não se repete';
    
    let desc = '';
    
    switch(value.type) {
      case 'daily':
        desc = value.interval === 1 
          ? 'Todos os dias'
          : `A cada ${value.interval} dias`;
        break;
      case 'weekly':
        desc = value.interval === 1 
          ? 'Toda semana'
          : `A cada ${value.interval} semanas`;
        break;
      case 'monthly':
        desc = value.interval === 1 
          ? 'Todo mês'
          : `A cada ${value.interval} meses`;
        break;
    }
    
    if (value.endDate) {
      desc += ` até ${format(value.endDate, 'dd/MM/yyyy')}`;
    }
    
    return desc;
  };
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Recorrência</label>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-between h-9 px-3"
          >
            <div className="flex items-center">
              <Repeat className="h-4 w-4 mr-2" />
              <span>{getRecurrenceDescription()}</span>
            </div>
            {value.enabled && (
              <X 
                className="h-4 w-4 text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRecurrenceChange({ enabled: false });
                }}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="recurrence-toggle">Ativar recorrência</Label>
              <Switch 
                id="recurrence-toggle"
                checked={value.enabled}
                onCheckedChange={(checked) => handleRecurrenceChange({ enabled: checked })}
              />
            </div>
            
            {value.enabled && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="recurrence-type" className="col-span-1">Tipo</Label>
                  <Select
                    value={value.type}
                    onValueChange={(val: 'daily' | 'weekly' | 'monthly') => 
                      handleRecurrenceChange({ type: val })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">{recurrenceLabels.daily}</SelectItem>
                      <SelectItem value="weekly">{recurrenceLabels.weekly}</SelectItem>
                      <SelectItem value="monthly">{recurrenceLabels.monthly}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="recurrence-interval" className="col-span-1">
                    Intervalo
                  </Label>
                  <div className="flex items-center col-span-3">
                    <span className="mr-2">A cada</span>
                    <Input
                      id="recurrence-interval"
                      type="number"
                      min="1"
                      max="100"
                      value={value.interval}
                      onChange={(e) => 
                        handleRecurrenceChange({ 
                          interval: Math.max(1, parseInt(e.target.value) || 1) 
                        })
                      }
                      className="w-16 text-center"
                    />
                    <span className="ml-2">
                      {value.interval === 1 
                        ? value.type === 'daily' ? 'dia' 
                          : value.type === 'weekly' ? 'semana' : 'mês'
                        : value.type === 'daily' ? 'dias' 
                          : value.type === 'weekly' ? 'semanas' : 'meses'
                      }
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data de término (opcional)</label>
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      className={value.endDate ? 'text-left' : 'text-muted-foreground text-left'}
                      onClick={() => 
                        handleRecurrenceChange({ 
                          endDate: value.endDate ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) 
                        })
                      }
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {value.endDate ? format(value.endDate, 'PPP', { locale: ptBR }) : 'Sem data de término'}
                    </Button>
                    
                    {value.endDate && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRecurrenceChange({ endDate: null })}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  {value.endDate && (
                    <div className="pt-2">
                      <Calendar
                        mode="single"
                        selected={value.endDate}
                        onSelect={(date) => handleRecurrenceChange({ endDate: date })}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </div>
                  )}
                </div>
              </>
            )}
            
            <div className="flex justify-end">
              <Button 
                onClick={() => setOpen(false)}
                size="sm"
              >
                Concluído
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default RecurrenceSelector;
