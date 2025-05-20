
// This file provides a compatibility layer between the shadcn/ui toast API
// and the Sonner toast implementation
import { toast as sonnerToast } from "sonner";

// Export types for better TypeScript support
export type ToastProps = {
  title: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  duration?: number;
  action?: React.ReactNode;
};

type ToastActionElement = React.ReactNode;

// Export toast directly for simpler usage
export const toast = {
  // Main toast function with shadcn/ui compatible API
  (props: ToastProps) {
    const { title, description, variant, duration } = props;
    
    try {
      if (variant === "destructive") {
        return sonnerToast.error(title, {
          description,
          duration: duration || 5000,
        });
      } else if (variant === "success") {
        return sonnerToast.success(title, {
          description,
          duration: duration || 5000,
        });
      } else {
        return sonnerToast(title, {
          description,
          duration: duration || 5000,
        });
      }
    } catch (error) {
      console.error("Error showing toast:", error);
      // Fallback to console log if toast fails
      console.log(`Toast (${variant}): ${title} - ${description || ""}`);
      return null;
    }
  },
  
  // Add direct methods for convenience
  error(title: string, options?: { description?: string; duration?: number }) {
    return sonnerToast.error(title, options);
  },
  
  success(title: string, options?: { description?: string; duration?: number }) {
    return sonnerToast.success(title, options);
  },
  
  info(title: string, options?: { description?: string; duration?: number }) {
    return sonnerToast.info(title, options);
  },
  
  warning(title: string, options?: { description?: string; duration?: number }) {
    return sonnerToast.warning(title, options);
  },
  
  dismiss(toastId?: string) {
    sonnerToast.dismiss(toastId);
  }
};

// Create a compatible hook that works similar to the old useToast
// but uses sonner under the hood
export function useToast() {
  return {
    toast,
    // Add a dummy toasts array to match the expected interface
    toasts: []
  };
}

// Export types for compatibility with shadcn/ui toast
export type { ToastActionElement };
