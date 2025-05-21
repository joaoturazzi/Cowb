import * as React from "react"
import { cn } from "@/lib/utils"

console.log("[PaginationItem] Componente sendo inicializado")

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => {
  console.log("[PaginationItem] Renderizando componente")
  return (
    <li ref={ref} className={cn("", className)} {...props} />
  )
})

PaginationItem.displayName = "PaginationItem"

export { PaginationItem } 