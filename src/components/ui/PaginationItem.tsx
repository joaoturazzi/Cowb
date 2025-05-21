import * as React from "react"
import { cn } from "@/lib/utils"

console.log('[pagination] PaginationItem componente executado');

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

export { PaginationItem } 