
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

// Create a function type with additional properties
interface ToastFunction {
  (props: ToastProps): string | number;
  error: (title: string, options?: { description?: string; duration?: number }) => string | number;
  success: (title: string, options?: { description?: string; duration?: number }) => string | number;
  info: (title: string, options?: { description?: string; duration?: number }) => string | number;
  warning: (title: string, options?: { description?: string; duration?: number }) => string | number;
  dismiss: (toastId?: string) => void;
}

// Create the toast function
const toastFunction = ((props: ToastProps) => {
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
}) as ToastFunction;

// Add method properties to the function
toastFunction.error = (title, options) => {
  return sonnerToast.error(title, options);
};

toastFunction.success = (title, options) => {
  return sonnerToast.success(title, options);
};

toastFunction.info = (title, options) => {
  return sonnerToast.info(title, options);
};

toastFunction.warning = (title, options) => {
  return sonnerToast.warning(title, options);
};

toastFunction.dismiss = (toastId) => {
  sonnerToast.dismiss(toastId);
};

// Export the toast function
export const toast = toastFunction;

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
