// Re-export all UI components for easy imports throughout the application
// This helps avoid circular dependencies and keeps imports clean

// First, export utility functions and hooks
export { useToast } from "./use-toast";

// Then export base UI components in a logical order
export * from "./button"; // Button is often a dependency for other components
export * from "./input"; // Input is a basic form component
export * from "./label"; // Label is often used with inputs
export * from "./checkbox"; // Checkbox is a basic form component
export * from "./select"; // Select is a form component
export * from "./tabs"; // Tabs is a navigation component
export * from "./card"; // Card is a layout component
export * from "./dialog"; // Dialog is a modal component
export * from "./popover"; // Popover is a tooltip-like component
export * from "./alert"; // Alert is a notification component
export * from "./alert-dialog"; // Alert dialog is a modal component
export * from "./accordion"; // Accordion is a collapsible component
export * from "./aspect-ratio"; // Aspect ratio is a layout component
export * from "./avatar"; // Avatar is a display component
export * from "./badge"; // Badge is a display component
export * from "./calendar"; // Calendar is a date component
export * from "./separator"; // Separator is a layout component

// Export toast-related components last since they might depend on other components
export * from "./toast";
export * from "./toaster";

// Re-export SonnerToaster with a clear name to avoid conflicts
export { Toaster as SonnerToaster } from "sonner";
export { toast as sonnerToast } from "sonner";
