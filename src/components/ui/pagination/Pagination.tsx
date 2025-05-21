import * as React from "react"
import { cn } from "@/lib/utils"

console.log("[Pagination] Componente sendo inicializado")

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => {
  console.log("[Pagination] Renderizando componente")
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

Pagination.displayName = "Pagination"

export { Pagination } 