import * as React from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { PaginationLink } from "./PaginationLink"

console.log("[PaginationNext] Componente sendo inicializado")

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => {
  console.log("[PaginationNext] Renderizando componente")
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 pr-2.5", className)}
      {...props}
    >
      <span>Next</span>
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  )
}

PaginationNext.displayName = "PaginationNext"

export { PaginationNext } 