
// This is a proxy file that redirects to our standardized toast implementation
import { toast as sonnerToast } from "sonner";

// Export toast directly to make it easier for users of this module
export const toast = sonnerToast;

// Create a compatible hook that works similar to the old useToast
// but uses sonner under the hood
export function useToast() {
  // Return a toast object that mimics the shadcn/ui toast API
  // but uses the sonner implementation under the hood
  return {
    toast: (props: { title: string; description?: string; variant?: "default" | "destructive" | "success" }) => {
      const { title, description, variant } = props;
      
      try {
        if (variant === "destructive") {
          return sonnerToast.error(title, {
            description: description
          });
        } else if (variant === "success") {
          return sonnerToast.success(title, {
            description: description
          });
        } else {
          return sonnerToast(title, {
            description: description
          });
        }
      } catch (error) {
        console.error("Error showing toast:", error);
        // Fallback to console log if toast fails
        console.log(`Toast (${variant}): ${title} - ${description || ""}`);
        return null;
      }
    },
    // Add a dummy toasts array to match the expected interface
    toasts: []
  };
}
