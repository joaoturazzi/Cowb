// Re-export all UI components for easy imports throughout the application
// Export utility functions and hooks
export { useToast } from "./use-toast";

// Export base UI components explicitamente
export { Button } from "./button";
export { Input } from "./input";
export { Label } from "./label";
export { Checkbox } from "./checkbox";
export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator, SelectScrollUpButton, SelectScrollDownButton } from "./select";
export { Tabs } from "./tabs";
export { Card } from "./card";
export { Dialog } from "./dialog";
export { Popover, PopoverTrigger, PopoverContent } from "./popover";
export { Alert, AlertTitle, AlertDescription } from "./alert";
export { AlertDialog } from "./alert-dialog";
export { Accordion } from "./accordion";
export { AspectRatio } from "./aspect-ratio";
export { Avatar } from "./avatar";
export { Badge } from "./badge";
export { Calendar } from "./calendar";
export { Separator } from "./separator";
// export { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./pagination"; // Removido temporariamente para teste

// Export toast-related components
export * from "./toast";
export * from "./toaster";

// Re-export SonnerToaster com nome claro
export { Toaster as SonnerToaster } from "sonner";
export { toast as sonnerToast } from "sonner";
