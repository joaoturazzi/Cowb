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
<<<<<<< HEAD
        size="icon"
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full",
          "bg-background/95 backdrop-blur-sm shadow-md border border-border",
          "z-20 opacity-90 hover:opacity-100 transition-all duration-200",
          "hover:bg-primary/10 hover:scale-110 active:scale-95",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
          "group"
=======
        size="sm"
        disabled={!canScrollLeft}
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-full",
          "bg-background/90 backdrop-blur-sm shadow-sm border border-muted",
          "z-20 hover:bg-primary/5",
          "transition-all duration-200 hover:scale-105 hover:border-primary/40",
          "focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:ring-offset-1",
          !canScrollLeft && "opacity-0 pointer-events-none"
>>>>>>> 9e44140c44d801a0481ecf4acdf4a08dbe51b0d7
        )}
        onClick={onScrollLeft}
        aria-label="Scroll left"
      >
<<<<<<< HEAD
        <ChevronLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
=======
        <ChevronLeft className="h-4 w-4" />
>>>>>>> 9e44140c44d801a0481ecf4acdf4a08dbe51b0d7
        <span className="sr-only">Rolar para esquerda</span>
      </Button>
      <Button
        variant="outline"
<<<<<<< HEAD
        size="icon"
        className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full",
          "bg-background/95 backdrop-blur-sm shadow-md border border-border",
          "z-20 opacity-90 hover:opacity-100 transition-all duration-200",
          "hover:bg-primary/10 hover:scale-110 active:scale-95",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
          "group"
=======
        size="sm"
        disabled={!canScrollRight}
        className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-full",
          "bg-background/90 backdrop-blur-sm shadow-sm border border-muted",
          "z-20 hover:bg-primary/5",
          "transition-all duration-200 hover:scale-105 hover:border-primary/40",
          "focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:ring-offset-1",
          !canScrollRight && "opacity-0 pointer-events-none"
>>>>>>> 9e44140c44d801a0481ecf4acdf4a08dbe51b0d7
        )}
        onClick={onScrollRight}
        aria-label="Scroll right"
      >
<<<<<<< HEAD
        <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
=======
        <ChevronRight className="h-4 w-4" />
>>>>>>> 9e44140c44d801a0481ecf4acdf4a08dbe51b0d7
        <span className="sr-only">Rolar para direita</span>
      </Button>
    </>
  );
};

export default TabsNavigation;
