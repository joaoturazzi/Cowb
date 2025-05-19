
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
        className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full 
                  bg-background/95 backdrop-blur-sm shadow-md border border-border 
                  z-20 opacity-90 hover:opacity-100 hover:bg-primary/10 transition-all"
        onClick={onScrollLeft}
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-3 w-3" />
        <span className="sr-only">Rolar para esquerda</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full 
                  bg-background/95 backdrop-blur-sm shadow-md border border-border 
                  z-20 opacity-90 hover:opacity-100 hover:bg-primary/10 transition-all"
        onClick={onScrollRight}
        aria-label="Scroll right"
      >
        <ChevronRight className="h-3 w-3" />
        <span className="sr-only">Rolar para direita</span>
      </Button>
    </>
  );
};

export default TabsNavigation;

