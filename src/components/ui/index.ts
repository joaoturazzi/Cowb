console.log("[UI] Inicializando exportações")

// Re-export all UI components for easy imports throughout the application
// Export utility functions and hooks
export * from "./alert-dialog"
export * from "./aspect-ratio"
export * from "./avatar"
export * from "./badge"
export * from "./button"
export * from "./calendar"
export * from "./card"
export * from "./checkbox"
export * from "./collapsible"
export * from "./command"
export * from "./context-menu"
export * from "./dialog"
export * from "./dropdown-menu"
export * from "./form"
export * from "./hover-card"
export * from "./input"
export * from "./label"
export * from "./menubar"
export * from "./navigation-menu"
export * from "./popover"
export * from "./progress"
export * from "./radio-group"
export * from "./scroll-area"
export * from "./select"
export * from "./separator"
export * from "./sheet"
export * from "./skeleton"
export * from "./slider"
export * from "./switch"
export * from "./table"
export * from "./tabs"
export * from "./textarea"
export * from "./toast"
export * from "./toaster"
export * from "./toggle"
export * from "./tooltip"
export * from "./use-toast"
export * from "./pagination/index"

// Re-export SonnerToaster com nome claro
export { Toaster as SonnerToaster } from "sonner";
export { toast as sonnerToast } from "sonner";

console.log("[UI] Exportações concluídas")
