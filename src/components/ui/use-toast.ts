
// This is a proxy file that redirects to our standardized toast implementation
import { toast } from "sonner";

// Re-export toast from sonner directly
export { toast };

// Create a compatible hook that works similar to the old useToast
// but uses sonner under the hood
export function useToast() {
  return { 
    toast: (props: { title: string; description: string; variant?: "default" | "destructive" | "success" }) => {
      const { title, description, variant } = props;
      
      try {
        if (variant === "destructive") {
          return toast.error(title, {
            description: description
          });
        } else if (variant === "success") {
          return toast.success(title, {
            description: description
          });
        } else {
          return toast(title, {
            description: description
          });
        }
      } catch (error) {
        console.error("Error showing toast:", error);
        // Fallback to console log if toast fails
        console.log(`Toast (${variant}): ${title} - ${description}`);
        return null;
      }
    }
  };
}
