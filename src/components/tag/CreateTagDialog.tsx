
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Cores predefinidas para seleção
const PREDEFINED_COLORS = [
  '#ef4444', // Vermelho
  '#f97316', // Laranja
  '#f59e0b', // Âmbar
  '#84cc16', // Verde limão
  '#10b981', // Esmeralda
  '#06b6d4', // Ciano
  '#0ea5e9', // Azul claro
  '#3b82f6', // Azul
  '#8b5cf6', // Violeta
  '#d946ef', // Fúcsia
  '#ec4899', // Rosa
  '#6b7280', // Cinza
];

interface CreateTagDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTag: (name: string, color: string) => Promise<void>;
}

const CreateTagDialog: React.FC<CreateTagDialogProps> = ({
  isOpen,
  onClose,
  onCreateTag
}) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState(PREDEFINED_COLORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !color) return;
    
    setIsSubmitting(true);
    try {
      await onCreateTag(name.trim(), color);
      setName('');
      setColor(PREDEFINED_COLORS[0]);
      onClose();
    } catch (error) {
      console.error('Erro ao criar tag:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Nova Tag</DialogTitle>
          <DialogDescription>
            Crie uma tag para organizar suas tarefas.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="tag-name">Nome da Tag</Label>
            <Input 
              id="tag-name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Trabalho, Estudos, Pessoal"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Cor</Label>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_COLORS.map(predefinedColor => (
                <button
                  key={predefinedColor}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${
                    color === predefinedColor ? 'border-gray-900 scale-110 dark:border-gray-50' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: predefinedColor }}
                  onClick={() => setColor(predefinedColor)}
                />
              ))}
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!name.trim() || isSubmitting}>
              {isSubmitting ? 'Criando...' : 'Criar Tag'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTagDialog;
