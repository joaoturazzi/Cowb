import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TabsNavigationProps {
  onScrollLeft: () => void;
  onScrollRight: () => void;
  canScrollLeft?: boolean;
  canScrollRight?: boolean;
}

const TabsNavigation: React.FC<TabsNavigationProps> = ({
  onScrollLeft,
  onScrollRight,
  canScrollLeft = true,
  canScrollRight = true
}) => {
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        disabled={!canScrollLeft}
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-full",
          "bg-background/90 backdrop-blur-sm shadow-sm border border-muted",
          "z-20 hover:bg-primary/5",
          "transition-all duration-200 hover:scale-105 hover:border-primary/40",
          "focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:ring-offset-1",
          !canScrollLeft && "opacity-0 pointer-events-none"
        )}
        onClick={onScrollLeft}
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Rolar para esquerda</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={!canScrollRight}
        className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-full",
          "bg-background/90 backdrop-blur-sm shadow-sm border border-muted",
          "z-20 hover:bg-primary/5",
          "transition-all duration-200 hover:scale-105 hover:border-primary/40",
          "focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:ring-offset-1",
          !canScrollRight && "opacity-0 pointer-events-none"
        )}
        onClick={onScrollRight}
        aria-label="Scroll right"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Rolar para direita</span>
      </Button>
    </>
  );
};

export default TabsNavigation;
