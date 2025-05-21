import * as React from "react"
import { cn } from "@/lib/utils"

console.log("[PaginationContent] Componente sendo inicializado")

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => {
  console.log("[PaginationContent] Renderizando componente")
  return (
    <ul
      ref={ref}
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  )
})

PaginationContent.displayName = "PaginationContent"

export { PaginationContent } 