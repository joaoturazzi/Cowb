
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
        className="absolute left-0 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/90 backdrop-blur-sm shadow-md border border-border z-10 opacity-90 hover:opacity-100"
        onClick={onScrollLeft}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/90 backdrop-blur-sm shadow-md border border-border z-10 opacity-90 hover:opacity-100"
        onClick={onScrollRight}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* Gradient fade effects with improved visibility */}
      <div className="absolute top-0 left-0 bottom-0 w-16 pointer-events-none bg-gradient-to-r from-card to-transparent z-[1]"></div>
      <div className="absolute top-0 right-0 bottom-0 w-16 pointer-events-none bg-gradient-to-l from-card to-transparent z-[1]"></div>
    </>
  );
};

export default TabsNavigation;
