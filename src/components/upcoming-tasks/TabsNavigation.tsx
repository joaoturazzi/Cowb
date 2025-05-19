
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
        className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/95 backdrop-blur-sm shadow-lg border border-primary/20 z-10 opacity-90 hover:opacity-100 hover:bg-primary/20 transition-all"
        onClick={onScrollLeft}
      >
        <ChevronLeft className="h-5 w-5 text-primary" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/95 backdrop-blur-sm shadow-lg border border-primary/20 z-10 opacity-90 hover:opacity-100 hover:bg-primary/20 transition-all"
        onClick={onScrollRight}
      >
        <ChevronRight className="h-5 w-5 text-primary" />
      </Button>

      {/* Efeitos de gradiente com visibilidade melhorada */}
      <div className="absolute top-0 left-0 bottom-0 w-20 pointer-events-none bg-gradient-to-r from-card to-transparent z-[1]"></div>
      <div className="absolute top-0 right-0 bottom-0 w-20 pointer-events-none bg-gradient-to-l from-card to-transparent z-[1]"></div>
    </>
  );
};

export default TabsNavigation;
