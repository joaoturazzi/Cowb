
// This is a proxy file that redirects to our standardized toast implementation
import { toast, useToast, type ToastProps, type ToastActionElement } from "@/hooks/use-toast";

// Re-export everything from the main toast implementation
export { toast, useToast };
export type { ToastProps, ToastActionElement };
