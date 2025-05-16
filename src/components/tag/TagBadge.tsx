
import React from 'react';
import { Tag } from '@/contexts/task/types/tagTypes';
import { X } from 'lucide-react';

interface TagBadgeProps {
  tag: Tag;
  showRemove?: boolean;
  onRemove?: () => void;
}

const TagBadge: React.FC<TagBadgeProps> = ({ tag, showRemove = false, onRemove }) => {
  return (
    <span 
      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
      style={{ 
        backgroundColor: tag.color,
        color: getContrastColor(tag.color)
      }}
    >
      {tag.name}
      {showRemove && onRemove && (
        <button 
          onClick={e => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 rounded-full hover:bg-black/20 p-0.5"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
};

// Função para determinar se o texto deve ser preto ou branco com base na cor de fundo
function getContrastColor(hexColor: string): string {
  // Remove o # se existir
  const color = hexColor.replace('#', '');
  
  // Converte para RGB
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  
  // Calcula a luminância
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Retorna preto ou branco baseado na luminância
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

export default TagBadge;
