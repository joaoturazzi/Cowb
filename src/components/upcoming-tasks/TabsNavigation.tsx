import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TabsNavigationProps {
  onScrollLeft: () => void;
  onScrollRight: () => void;
}

const TabsNavigation: React.FC<TabsNavigationProps> = ({
  onScrollLeft,
  onScrollRight
}) => {
  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full",
          "bg-background/95 backdrop-blur-sm shadow-md border border-border",
          "z-20 opacity-90 hover:opacity-100 transition-all duration-200",
          "hover:bg-primary/10 hover:scale-110 active:scale-95",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
          "group"
        )}
        onClick={onScrollLeft}
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
        <span className="sr-only">Rolar para esquerda</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full",
          "bg-background/95 backdrop-blur-sm shadow-md border border-border",
          "z-20 opacity-90 hover:opacity-100 transition-all duration-200",
          "hover:bg-primary/10 hover:scale-110 active:scale-95",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
          "group"
        )}
        onClick={onScrollRight}
        aria-label="Scroll right"
      >
        <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        <span className="sr-only">Rolar para direita</span>
      </Button>
    </>
  );
};

export default TabsNavigation;

