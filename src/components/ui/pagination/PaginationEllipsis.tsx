import * as React from "react"
import { MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

console.log("[PaginationEllipsis] Componente sendo inicializado")

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => {
  console.log("[PaginationEllipsis] Renderizando componente")
  return (
    <span
      aria-hidden
      className={cn("flex h-9 w-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

PaginationEllipsis.displayName = "PaginationEllipsis"

export { PaginationEllipsis } 